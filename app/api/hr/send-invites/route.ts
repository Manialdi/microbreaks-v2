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
            return NextResponse.json({ error: 'Server Configuration Error: Missing Supabase Service Key.' }, { status: 500 });
        }
        if (!supabaseUrl) {
            console.error("Critical: NEXT_PUBLIC_SUPABASE_URL is missing from process.env");
            return NextResponse.json({ error: 'Server Configuration Error: Missing Supabase URL' }, { status: 500 });
        }

        const supabase = await createClient();

        console.log('Invites API: Checking Session...');

        // 1. Verify User is Authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
            console.error('Invites API Auth Error:', authError);
        }

        if (!user) {
            console.error('Invites API: No user found. Unauthorized.');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('Invites API: User found:', user.id);

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
                // Generate Invite Link (Magic Link)
                // This creates (or gets) the user and returns a link to verifying their email/logging in.
                const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
                    type: 'invite',
                    email: email,
                    options: {
                        // Redirect to callback to exchange code for session, then to password update page
                        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/update-password`
                    }
                });

                if (linkError) {
                    results.push({ email, status: 'error', message: linkError.message });
                    continue;
                }

                const actionLink = linkData.properties.action_link;
                const authUserId = linkData.user.id; // User is created if not exists

                // C. Send Invited Email
                const { error: emailError } = await resend.emails.send({
                    from: 'MicroBreaks <onboarding@micro-breaks.com>',
                    to: email,
                    subject: 'You have been invited to MicroBreaks',
                    html: getInviteEmailTemplate(actionLink)
                });

                if (emailError) {
                    console.error('Email sending failed:', emailError);
                    results.push({ email, status: 'error', message: 'Failed to send invitation email' });
                    continue;
                }


                // D. Upsert Employee Record
                if (authUserId) {
                    const { data: existingEmps } = await supabaseAdmin
                        .from('employees')
                        .select('id')
                        .eq('email', email)
                        .limit(1);

                    const existingEmp = existingEmps?.[0];

                    if (existingEmp) {
                        await supabaseAdmin
                            .from('employees')
                            .update({
                                company_id: companyId,
                                status: 'active', // Mark active immediately as they have password
                                auth_user_id: authUserId
                            })
                            .eq('id', existingEmp.id);
                    } else {
                        await supabaseAdmin
                            .from('employees')
                            .insert({
                                company_id: companyId,
                                email: email,
                                status: 'active',
                                auth_user_id: authUserId
                            });
                    }
                }

                // E. Log Invitation (Upsert)
                const { data: existingInvites } = await supabaseAdmin
                    .from('invitations')
                    .select('id')
                    .eq('email', email)
                    .limit(1);

                const existingInvite = existingInvites?.[0];

                if (existingInvite) {
                    await supabaseAdmin
                        .from('invitations')
                        .update({
                            company_id: companyId,
                            status: 'accepted', // Auto-accepted technically
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', existingInvite.id);
                } else {
                    await supabaseAdmin
                        .from('invitations')
                        .insert({
                            company_id: companyId,
                            email: email,
                            status: 'accepted',
                            token: crypto.randomUUID(), // Legacy field
                            activation_token: crypto.randomUUID() // Legacy field
                        });
                }

                results.push({ email, status: 'success' });

            } catch (err: any) {
                console.error(`Unexpected error processing ${email}:`, err);
                results.push({ email, status: 'error', message: err.message || 'Internal Server Error' });
            }
        }

        return NextResponse.json({ results });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
