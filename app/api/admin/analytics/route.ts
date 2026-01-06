import { BetaAnalyticsDataClient } from '@google-analytics/data';
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

        // 2. Check Credentials
        // We look for a JSON string in env to avoid file path issues in serverless
        const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
        const propertyId = process.env.GA_PROPERTY_ID;

        if (!credentialsJson || !propertyId) {
            return NextResponse.json({
                configured: false,
                message: "Environment variables GOOGLE_APPLICATION_CREDENTIALS_JSON or GA_PROPERTY_ID are missing."
            })
        }

        // 3. Fetch Data from GA4
        const analyticsDataClient = new BetaAnalyticsDataClient({
            credentials: JSON.parse(credentialsJson)
        });

        // Run Report: Trend (Last 30 Days)
        const [trendResponse] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                { startDate: '30daysAgo', endDate: 'today' },
            ],
            dimensions: [
                { name: 'date' },
            ],
            metrics: [
                { name: 'activeUsers' },
                { name: 'screenPageViews' },
            ],
            orderBys: [
                { dimension: { dimensionName: 'date' } }
            ]
        });

        // Run Report: Top Pages
        const [pagesResponse] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                { startDate: '30daysAgo', endDate: 'today' },
            ],
            dimensions: [
                { name: 'pageTitle' },
                { name: 'pagePath' }
            ],
            metrics: [
                { name: 'screenPageViews' },
                { name: 'activeUsers' }
            ],
            limit: 10,
            orderBys: [
                { metric: { metricName: 'screenPageViews' }, desc: true }
            ]
        });

        // Format Data
        const trendData = trendResponse.rows?.map(row => ({
            date: row.dimensionValues?.[0]?.value,
            users: Number(row.metricValues?.[0]?.value || 0),
            views: Number(row.metricValues?.[1]?.value || 0)
        })) || [];

        const pagesData = pagesResponse.rows?.map(row => ({
            title: row.dimensionValues?.[0]?.value,
            path: row.dimensionValues?.[1]?.value,
            views: Number(row.metricValues?.[0]?.value || 0),
            users: Number(row.metricValues?.[1]?.value || 0)
        })) || [];

        // Calculate Totals for cards
        const totalViews = trendData.reduce((acc, curr) => acc + curr.views, 0);
        const totalActiveUsers = trendData.reduce((acc, curr) => acc + curr.users, 0);

        return NextResponse.json({
            configured: true,
            totals: {
                views: totalViews,
                users: totalActiveUsers
            },
            trend: trendData,
            pages: pagesData
        })

    } catch (error: any) {
        console.error("GA API Error:", error)
        return NextResponse.json({ configured: true, error: error.message }, { status: 500 })
    }
}
