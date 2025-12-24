import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { resend } from '@/lib/email/resend';
import { getInviteEmailTemplate } from '@/lib/email/templates';
// Note: We might want a specific "Welcome" template, 
// but reusing Invite or creating a new generic 'Welcome' is fine.
// Let's create a quick "getWelcomeEmailTemplate" inline or use a simple one for now.

const getWelcomeEmailTemplate = (name: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to MicroBreaks</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">MicroBreaks</h1>
    </div>

    <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <h2 style="margin-top: 0; color: #111827;">Welcome, ${name}! 👋</h2>
        
        <p style="color: #4b5563; margin-bottom: 24px;">
            Thank you for signing in with Google. You are all set to start your journey towards better health and productivity.
        </p>

        <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <p style="margin: 0 0 10px 0; font-weight: 600; color: #374151;">Getting Started</p>
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
                Click the extension icon anytime to access your dashboard, customize your break schedule, and track your progress.
            </p>
        </div>
        
        <p style="margin-top: 30px; font-size: 13px; color: #9ca3af; text-align: center;">
            Happy Stretching! <br> The MicroBreaks Team
        </p>
    </div>
</body>
</html>
`;

export async function POST(req: NextRequest) {
    // CORS
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
        const { userId, email, fullName } = body;

        if (!userId || !email) {
            return NextResponse.json({ error: 'Missing userId or email' }, { status: 400 });
        }

        // Use Service Role to admin user data
        const supabaseUrl = 'https://vnhhlyceginwmeyohafs.supabase.co';
        // Note: NEVER expose this on client. This is a server route.
        const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuaGhseWNlZ2lud21leW9oYWZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjIyNzI1MCwiZXhwIjoyMDgxODAzMjUwfQ.fht5PlUgw9vqaLDhTVAWMdt-RHP62tEwhzpYpQsPNn0';

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

        // 1. Check if we already sent welcome email
        const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);

        if (userError || !user) {
            throw new Error('User not found');
        }

        if (user.user.user_metadata?.welcome_email_sent) {
            return NextResponse.json({ message: 'Email already sent' });
        }

        // 2. Send Email
        const { error: emailError } = await resend.emails.send({
            from: 'MicroBreaks <onboarding@micro-breaks.com>',
            to: email,
            subject: 'Welcome to MicroBreaks!',
            html: getWelcomeEmailTemplate(fullName || 'there')
        });

        if (emailError) {
            console.error('Resend Error:', emailError);
            // Don't mark as sent if failed
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }

        // 3. Mark as sent in user_metadata
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
            user_metadata: { ...user.user.user_metadata, welcome_email_sent: true }
        });

        if (updateError) {
            console.error('Failed to update metadata:', updateError);
        }

        return NextResponse.json({ success: true, message: 'Welcome email sent' }, {
            headers: { 'Access-Control-Allow-Origin': '*' }
        });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
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
