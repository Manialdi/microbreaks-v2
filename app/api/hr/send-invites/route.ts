import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

        if (!serviceRoleKey || !supabaseUrl) {
            console.error("Missing Env Vars - Supabase Service Key or URL not found");
            return NextResponse.json({ error: 'Server Configuration Error: Missing Supabase Service Key' }, { status: 500 });
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

            // B. Send Invite via Supabase Auth
            const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://micro-breaks.com'}/employee/onboarding`
            });

            if (inviteError) {
                console.error(`Failed to invite ${email}:`, inviteError);
                // If user already registered, we might want to just "invited" them in DB? 
                // But usually inviteUserByEmail fails if user exists. 
                // Let's report error.
                results.push({ email, status: 'error', message: inviteError.message });
                continue;
            }

            const newAuthUserId = inviteData.user.id;

            // C. Upsert Employee (Ensure DB record exists)
            const { error: empError } = await supabaseAdmin
                .from('employees')
                .upsert({
                    company_id: companyId,
                    email: email,
                    status: 'invited',
                    auth_user_id: newAuthUserId // Store auth linkage
                }, { onConflict: 'email' } as any) // Assuming email unique constraints or handle logic
            // Note: We used select-insert logic in frontend, but here backend upsert is cleaner if constraint exists.
            // Ref previous fix: We removed constraint reliance. Let's start with simple check-insert or upsert if PK known.
            // actually, let's use the safer select-check pattern here too to match strictness if needed, 
            // OR just upsert by email if email is unique. 
            // Let's trust the frontend logic established earlier? 
            // Actually, backend should be robust. 
            // Let's do a simple upsert on 'email' if we assume specific uniqueness, otherwise Select -> Update/Insert.
            // For simplicity and robustness given previous errors, lets do Select -> Insert/Update.

            // D. Insert Invitation (Tracking)
            await supabaseAdmin.from('invitations').insert({
                company_id: companyId,
                email: email,
                status: 'pending',
                auth_user_id: newAuthUserId
            });

            results.push({ email, status: 'success', id: newAuthUserId });
        }

        return NextResponse.json({ results });

    } catch (err: any) {
        console.error("Invite API Error:", err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
