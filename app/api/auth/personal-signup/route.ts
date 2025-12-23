import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/email/resend';
import { getConfirmationEmailTemplate } from '@/lib/email/templates';

export async function POST(req: NextRequest) {
    // 1. Handle CORS for Extension
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
        const { email, password, fullName } = body;

        // 2. Validate Inputs
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

        // 3. Admin Client (to generate link)
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

        // 4. Generate Signup Link
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'signup',
            email: email,
            password: password,
            options: {
                data: { full_name: fullName },
                redirectTo: 'https://www.micro-breaks.com/auth/confirmed' // Allow standard redirect handling
            }
        });

        if (linkError) {
            console.error('Link Generation Error:', linkError);
            return NextResponse.json({ error: linkError.message }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
        }

        const actionLink = linkData.properties.action_link;

        // 5. Send Email via Resend
        const { error: emailError } = await resend.emails.send({
            from: 'MicroBreaks <onboarding@micro-breaks.com>',
            to: email,
            subject: 'Confirm your MicroBreaks account',
            html: getConfirmationEmailTemplate(actionLink)
        });

        if (emailError) {
            console.error('Resend Error:', emailError);
            return NextResponse.json({ error: 'Failed to send confirmation email' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
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
