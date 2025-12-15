import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY || 're_123';

if (!process.env.RESEND_API_KEY) {
    console.warn("⚠️  WARNING: RESEND_API_KEY is missing. Email features will not work.");
}

export const resend = new Resend(apiKey);
