import { NextResponse } from 'next/server'
import { createClient as createServerAuth } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    // 1. Security Check
    const authClient = await createServerAuth()
    const { data: { user } } = await authClient.auth.getUser()
    const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()) || [];

    if (!user || !user.email || !adminEmails.includes(user.email)) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    // 2. Configuration
    // Use env var or fallback to the ID seen in user's screenshot
    const organizationId = process.env.LINKEDIN_ORG_ID || "110527497";

    // 3. Return Link Data
    // This allows the frontend to render a "View LinkedIn Analytics" button
    // which is the most reliable way to get all metrics (visitors, posts, followers)
    // without complex OAuth implementation right now.

    return NextResponse.json({
        configured: true,
        method: "link",
        dashboardUrl: `https://www.linkedin.com/company/${organizationId}/admin/dashboard/`,
        analyticsUrl: `https://www.linkedin.com/company/${organizationId}/admin/analytics/visitors/`,
        followersUrl: `https://www.linkedin.com/company/${organizationId}/admin/analytics/followers/`
    })
}
