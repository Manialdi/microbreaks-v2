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

        // 2. Initialize Supabase Admin Client (using INDIVIDUAL keys)
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
        // Listing users (page 1, up to 1000 users)
        const { data: { users: allUsers }, error } = await supabaseAdmin.auth.admin.listUsers({
            page: 1,
            perPage: 1000
        })

        if (error) throw error

        // Filter out test accounts
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

        const users = allUsers.filter(u => !u.email || !excludedEmails.includes(u.email));

        // 4. Calculate Metrics
        const totalUsers = users.length
        const now = new Date()

        const last30DaysCount = users.filter(u => {
            const d = new Date(u.created_at)
            const diffTime = Math.abs(now.getTime() - d.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            return diffDays <= 30
        }).length

        const last7DaysCount = users.filter(u => {
            const d = new Date(u.created_at)
            const diffTime = Math.abs(now.getTime() - d.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            return diffDays <= 7
        }).length

        // Fetch paid users count from profiles
        const { count: paidUsersCount, error: profilesError } = await supabaseAdmin
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('is_pro', true);

        if (profilesError) {
            console.error("Error fetching profiles:", profilesError);
        }

        return NextResponse.json({
            totalUsers,
            last30Days: last30DaysCount,
            last7Days: last7DaysCount,
            paidUsers: paidUsersCount || 0,
            recentUsers: users
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 50)
                .map(u => ({
                    email: u.email,
                    created_at: u.created_at
                }))
        })

    } catch (error: any) {
        console.error("Admin API Error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
