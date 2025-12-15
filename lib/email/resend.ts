import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
    console.warn("Missing RESEND_API_KEY");
}

export const resend = new Resend(apiKey);
