import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

        if (!serviceRoleKey || !supabaseUrl) {
            return NextResponse.json({ error: 'Server Config Error' }, { status: 500 });
        }

        const body = await req.json();
        const { inviteId } = body;

        if (!inviteId) {
            return NextResponse.json({ error: 'Missing Invitation ID' }, { status: 400 });
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

        // 1. Lookup Invitation
        const { data: invitation, error: inviteError } = await supabaseAdmin
            .from('invitations')
            .select('*')
            .eq('id', inviteId)
            .single();

        if (inviteError || !invitation) {
            return NextResponse.json({ error: 'Invitation not found or expired.' }, { status: 404 });
        }

        if (invitation.status === 'accepted') {
            // Optional: If already accepted, maybe redirect to login?
            // For now, let's allow re-generation logic or just return active session info if possible?
            // Actually, if accepted, they should just login.
            return NextResponse.json({ error: 'This invitation has already been accepted. Please log in.' }, { status: 400 });
        }

        // 2. Generate FRESH Magic Link / Set Password Link
        // We use the email from the invitation record
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email: invitation.email,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/employee/onboarding`
            }
        });

        if (linkError || !linkData.properties?.action_link) {
            throw new Error(linkError?.message || "Failed to generate link");
        }

        // 3. Return the fresh URL
        return NextResponse.json({ url: linkData.properties.action_link });

    } catch (err: any) {
        console.error("Verify Invite API Error:", err);
        return NextResponse.json({ error: err.message || 'Verification Failed' }, { status: 500 });
    }
}
