import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/email/resend';
import { getInviteEmailTemplate } from '@/lib/email/templates';

export async function POST(req: NextRequest) {
    try {
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

        if (!serviceRoleKey) {
            console.error("Critical: SUPABASE_SERVICE_ROLE_KEY is missing from process.env");
            return NextResponse.json({ error: 'Server Configuration Error: Missing Supabase Service Key. Please check your Vercel Environment Variables.' }, { status: 500 });
        }
        if (!supabaseUrl) {
            console.error("Critical: NEXT_PUBLIC_SUPABASE_URL is missing from process.env");
            return NextResponse.json({ error: 'Server Configuration Error: Missing Supabase URL' }, { status: 500 });
        }

        const supabase = await createClient();

        // 1. Verify User is Authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { emails, companyId } = body;

        // 2. Validate Input
        if (!emails || !Array.isArray(emails) || emails.length === 0) {
            return NextResponse.json({ error: 'No emails provided' }, { status: 400 });
        }
        if (!companyId) {
            return NextResponse.json({ error: 'Company ID required' }, { status: 400 });
        }

        // 3. Verify HR belongs to this company (Security Check)
        const { data: profile } = await supabase
            .from('profiles')
            .select('company_id, companies(domain)')
            .eq('id', user.id)
            .single();

        if (!profile || profile.company_id !== companyId) {
            return NextResponse.json({ error: 'Forbidden: You do not belong to this company' }, { status: 403 });
        }

        // @ts-ignore
        const companyDomain = profile.companies?.domain;

        // 4. Admin Client for Invites (Service Role)
        const supabaseAdmin = createAdminClient(supabaseUrl, serviceRoleKey);

        const results = [];

        for (const email of emails) {
            // A. Domain Validation
            if (companyDomain && !email.endsWith(`@${companyDomain}`)) {
                results.push({ email, status: 'error', message: `Email must end with @${companyDomain}` });
                continue;
            }

            try {
                // B. Create User (Silently - Auto Confirm)
                // This prevents Supabase from sending its default email
                const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
                    email: email,
                    email_confirm: true,
                    user_metadata: { company_id: companyId }
                });

                let authUserId = userData.user?.id;

                if (createError) {
                    // Check if user already exists
                    if (createError.message.includes('already been registered') || createError.status === 422) {
                        console.log(`User ${email} exists. Fetching details...`);

                        // Attempt to find user to get their ID
                        // Note: listUsers is paginated (default 50). This is a simple fallback for small batches.
                        const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
                        const existingUser = listData?.users.find(u => u.email?.toLowerCase() === email.toLowerCase());

                        if (existingUser) {
                            authUserId = existingUser.id;
                        } else {
                            console.warn(`Could not find ID for existing user ${email} in page 1. Skipping DB link.`);
                            // We allow flow to continue to send EMAIL, but we might fail DB upsert if auth_user_id is strictly required.
                            // However, usually we can just send the email.
                        }

                    } else {
                        console.error(`Failed to create user ${email}:`, createError);
                        results.push({ email, status: 'error', message: createError.message });
                        continue;
                    }
                } else {
                    authUserId = userData.user?.id;
                }

                // If we still don't have ID, we might fail DB, but let's try to send email at least?
                // Logic: If we can't get ID, we can't generateLink easily either? 
                // Wait, generateLink only needs email. So we are good for email sending!

                // C. Upsert Employee Record (Manual check to be robust against missing DB constraints)
                if (authUserId) {
                    const { data: existingEmp } = await supabaseAdmin
                        .from('employees')
                        .select('id')
                        .eq('email', email)
                        .single();

                    if (existingEmp) {
                        await supabaseAdmin
                            .from('employees')
                            .update({
                                company_id: companyId,
                                status: 'invited', // Reset status if re-inviting
                                auth_user_id: authUserId
                            })
                            .eq('email', email);
                    } else {
                        await supabaseAdmin
                            .from('employees')
                            .insert({
                                company_id: companyId,
                                email: email,
                                status: 'invited',
                                auth_user_id: authUserId
                            });
                    }
                }

                // D. Log Invitation (Manual Upsert)
                let inviteId;
                const { data: existingInvite } = await supabaseAdmin
                    .from('invitations')
                    .select('id')
                    .eq('email', email)
                    .single();

                if (existingInvite) {
                    // Update existing invite
                    await supabaseAdmin
                        .from('invitations')
                        .update({
                            company_id: companyId,
                            status: 'pending',
                            auth_user_id: authUserId,
                            created_at: new Date().toISOString()
                        })
                        .eq('id', existingInvite.id);
                    inviteId = existingInvite.id;
                } else {
                    // Insert new
                    const { data: newInvite, error: insertError } = await supabaseAdmin
                        .from('invitations')
                        .insert({
                            company_id: companyId,
                            email: email,
                            status: 'pending',
                            auth_user_id: authUserId
                        })
                        .select('id')
                        .single();

                    if (insertError) throw new Error(`Invite Insert Failed: ${insertError.message}`);
                    inviteId = newInvite.id;
                }

                if (!inviteId) {
                    throw new Error("Could not retrieve invitation ID");
                }

                // E. Construct Secure ID-based Link
                const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.micro-breaks.com';
                const protectedLink = `${siteUrl}/verify-invite?id=${inviteId}`;



                // F. Send Email
                const { error: emailError } = await resend.emails.send({
                    from: process.env.RESEND_FROM_EMAIL || 'invites@micro-breaks.com',
                    to: email,
                    subject: 'You have been invited to MicroBreaks',
                    html: getInviteEmailTemplate(protectedLink)
                });

                if (emailError) {
                    throw new Error(`Email sending failed: ${emailError.message}`);
                }

                results.push({ email, status: 'success', id: authUserId });

            } catch (err: any) {
                console.error(`Process failed for ${email}:`, err);
                results.push({ email, status: 'error', message: err.message });
            }
        }

        return NextResponse.json({ results });

    } catch (err: any) {
        console.error("Invite API Error:", err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
