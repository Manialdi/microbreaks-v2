import { NextResponse } from 'next/server'
import { createClient as createServerAuth } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // 1. Security Check
        const authClient = await createServerAuth()
        const { data: { user } } = await authClient.auth.getUser()
        const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()) || [];

        if (!user || !user.email || !adminEmails.includes(user.email)) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // 2. Fetch Chrome Web Store Page
        const url = "https://chromewebstore.google.com/detail/microbreaks-personal/gmdpcildfnehopafflccogmhmichoppa";
        const response = await fetch(url, {
            headers: {
                // Mimic a browser to ensure we get the right HTML
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch Chrome Web Store: ${response.status}`);
        }

        const html = await response.text();

        // 3. Parse "X users"
        // Chrome store renders it like: <div class="F9iKBc">...3 users</div>
        // or just plain text >3 users< depending on the fetching method
        // Our curl dump shows: ...Well-being</a>3 users</div>

        // This regex looks for ">" followed by number, spaces, "users"
        const match = html.match(/>([0-9,]+)\+?\s+users/);

        let userCount = 0;
        if (match && match[1]) {
            // Remove commas if present (e.g. "1,000")
            userCount = parseInt(match[1].replace(/,/g, ''), 10);
        }

        return NextResponse.json({
            users: userCount,
            url: url
        })

    } catch (error: any) {
        console.error("Chrome Store API Error:", error)
        return NextResponse.json({ error: error.message, users: 0 }, { status: 500 })
    }
}
