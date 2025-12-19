import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate corporate email (simple check to exclude common public domains)
        const publicDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];
        const emailDomain = email.split('@')[1];

        if (publicDomains.includes(emailDomain)) {
            return NextResponse.json(
                { error: 'Please use a work email address.' },
                { status: 400 }
            );
        }

        const data = await resend.emails.send({
            from: 'Micro Breaks Contact <onboarding@resend.dev>', // Update this if you have a verified domain
            to: ['sales@micro-breaks.com'],
            subject: `New Contact from ${name} at ${emailDomain}`,
            html: `
                <h2>New Contact Request</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
            reply_to: email, // Valid property is reply_to, not replyTo
        });

        if (data.error) {
            return NextResponse.json(
                { error: data.error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
