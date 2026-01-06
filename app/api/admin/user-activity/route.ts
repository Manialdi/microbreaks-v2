import { createClient } from '@supabase/supabase-js'
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

        // 2. Initialize Supabase Admin Client
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL_INDIVIDUAL
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY_INDIVIDUAL

        if (!supabaseUrl || !serviceRoleKey) {
            return NextResponse.json({
                error: "Server Configuration Error: Missing SUPABASE_SERVICE_ROLE_KEY_INDIVIDUAL"
            }, { status: 500 })
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        })

        // 3. Fetch Data

        // A. Fetch Profiles (for email)
        // If profiles doesn't have email, we might need to join with auth.users, but
        // the prompt says "email from profiles table". So we assume it's there.
        const { data: profiles, error: profilesError } = await supabaseAdmin
            .from('profiles')
            .select('id, email');

        if (profilesError) throw profilesError;

        // B. Fetch Personal Logs (for stats)
        // Fetching just needed columns to optimize
        const { data: logs, error: logsError } = await supabaseAdmin
            .from('personal_logs')
            .select('user_id, created_at');

        if (logsError) throw logsError;

        // 4. Processing
        const excludedEmails = [
            "p14manikant@iima.ac.in",
            "manialdi9999@gmail.com",
            "manialdi999999@gmail.com",
            "support@micro-breaks.com",
            "sales@micro-breaks.com",
            "invites@micro-breaks.com",
            "bindualdi2001@gmail.com",
            "dmanish154613@gmail.com"
        ];

        // Map userId -> { totalSessions, datesSet, firstUsed, lastUsed }
        const activityMap = new Map<string, {
            sessions: number,
            dates: Set<string>,
            firstUsed: number | null,
            lastUsed: number | null
        }>();

        logs.forEach((log: any) => {
            if (!log.user_id) return;

            if (!activityMap.has(log.user_id)) {
                activityMap.set(log.user_id, {
                    sessions: 0,
                    dates: new Set(),
                    firstUsed: null,
                    lastUsed: null
                });
            }

            const stats = activityMap.get(log.user_id)!;
            stats.sessions += 1;

            if (log.created_at) {
                // Days count
                const d = new Date(log.created_at);
                const dateStr = d.toISOString().split('T')[0];
                stats.dates.add(dateStr);

                // Min/Max timestamps
                const ts = d.getTime();
                if (stats.firstUsed === null || ts < stats.firstUsed) stats.firstUsed = ts;
                if (stats.lastUsed === null || ts > stats.lastUsed) stats.lastUsed = ts;
            }
        });

        const report = profiles
            .filter((p: any) => p.email && !excludedEmails.includes(p.email))
            .map((p: any) => {
                const stats = activityMap.get(p.id) || { sessions: 0, dates: new Set(), firstUsed: null, lastUsed: null };
                return {
                    user_email: p.email,
                    user_id: p.id,
                    total_sessions: stats.sessions,
                    total_days_used: stats.dates.size,
                    first_used: stats.firstUsed ? new Date(stats.firstUsed).toISOString() : null,
                    last_used: stats.lastUsed ? new Date(stats.lastUsed).toISOString() : null
                };
            })
            // Sort by sessions descending
            .sort((a: any, b: any) => b.total_sessions - a.total_sessions);

        return NextResponse.json({ report });

    } catch (error: any) {
        console.error("Admin Activity API Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
