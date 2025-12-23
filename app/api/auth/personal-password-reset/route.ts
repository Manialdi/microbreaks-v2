import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/email/resend';
import { getResetPasswordEmailTemplate } from '@/lib/email/templates';

export async function POST(req: NextRequest) {
    if (req.method === 'OPTIONS') {
        return new NextResponse(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    }

    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
        }

        // Use Personal Project Creds Explicitly
        const supabaseUrl = 'https://vnhhlyceginwmeyohafs.supabase.co';
        const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuaGhseWNlZ2lud21leW9oYWZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjIyNzI1MCwiZXhwIjoyMDgxODAzMjUwfQ.fht5PlUgw9vqaLDhTVAWMdt-RHP62tEwhzpYpQsPNn0';

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email: email,
            options: {
                redirectTo: 'https://www.micro-breaks.com/update-password' // Should exist or be created
            }
        });

        if (linkError) {
            console.error('Link Generation Error:', linkError);
            return NextResponse.json({ error: linkError.message }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
        }

        const actionLink = linkData.properties.action_link;

        const { error: emailError } = await resend.emails.send({
            from: 'MicroBreaks <onboarding@micro-breaks.com>',
            to: email,
            subject: 'Reset your MicroBreaks password',
            html: getResetPasswordEmailTemplate(actionLink)
        });

        if (emailError) {
            console.error('Resend Error:', emailError);
            return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
        }

        return NextResponse.json({ success: true }, { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
}

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
