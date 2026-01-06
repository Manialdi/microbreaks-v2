# Implementation Plan: Admin Dashboard

This plan outlines the creation of a protected admin dashboard to view key metrics: registered users, LinkedIn engagement, and website analytics.

## 1. Architecture

We will create a specific namespace `app/admin` to isolate this functionality from the rest of the application.

### File Structure
- `app/admin/layout.tsx`: **Security Layer**. Checks user authentication and authorizes specific emails (Admin).
- `app/admin/dashboard/page.tsx`: **Main UI**. Displays the grid of metrics.
- `app/api/admin/users/route.ts`: API to fetch Supabase user stats.
- `app/api/admin/analytics/route.ts`: API to fetch Google Analytics data.
- `app/api/admin/linkedin/route.ts`: API to fetch LinkedIn data.

## 2. Authentication & Security (Crucial)

Since this exposes sensitive data, we will not rely on client-side checks alone.
- **Environment Variable**: `ADMIN_EMAILS="your_email@example.com"` (Comma separated).
- **Layout Protection**: The `app/admin/layout.tsx` will run on the server.
    - It gets the current session user.
    - It checks if `user.email` is in `ADMIN_EMAILS`.
    - If not, it redirects to the home page or shows a 404/403.
- **API Protection**: Each API route will perform the same check before executing any queries.

## 3. Data Sources & Implementation Details

### A. Number of Users (Supabase)
- **Source**: `auth.users` table in Supabase.
- **Method**: Use `supabase-admin` client with `SUPABASE_SERVICE_ROLE_KEY` (Server-side only).
- **Metrics**:
    - Total User Count.
    - Recent signups (last 7/30 days).

### B. Google Analytics 4 (GA4)
- **Source**: Google Analytics Data API (v1beta).
- **Setup**:
    - Requires a **Google Cloud Service Account** JSON key.
    - The Service Account email must be added as a user to the GA4 property.
    - `GOOGLE_APPLICATION_CREDENTIALS` (or inline JSON) env var.
- **Dependency**: `npm install googleapis`.
- **Metrics**:
    - `activeUsers` (Total visits).
    - `screenPageViews` dimensioned by `pageTitle`.

### C. LinkedIn Metrics
- **Source**: LinkedIn Marketing Developer Platform API.
- **Complexity**: High. Requires OAuth 2.0 3-legged flow (User must "Log in with LinkedIn" to grant access to the app). Tokens expire every 60 days.
- **Strategy**:
    - **Phase 1 (MVP)**: "Download Report" Link. We will place a direct button sending you to the LinkedIn Admin analytics text export page.
    - **Phase 2 (Automation)**: We implement an OAuth flow where you "Connect LinkedIn" on the dashboard. We store the `access_token` in a `system_settings` table. The API route uses this token to fetch `ugcPosts` or `networkSizes`.
    - **Recommendation for now**: We will scaffold the API route. If a valid token is present in ENV (e.g. `LINKEDIN_ACCESS_TOKEN` for a personal token generated manually), it works. If not, it falls back to showing a "Open LinkedIn Analytics" button.

## 4. Dashboard UI

- **Framework**: Tailwind CSS + shadcn/ui (if available) or raw accessible components.
- **Charts**: Use `recharts` (already installed) for visual trends.
- **Layout**:
    - **Header**: "Admin Dashboard" + Date Range Picker (default: Last 30 days).
    - **Top Cards**: Total Users, Total Visits (GA), LinkedIn Followers.
    - **Middle Section**:
        - Chart: User Growth vs Website Traffic.
        - Table: Top Viewed Pages (GA).
    - **Bottom Section**:
        - LinkedIn detailed metrics or link to report.

## 5. Next Steps (Upon Approval)

1.  Add `ADMIN_EMAILS` to `.env.local`.
2.  Install `googleapis`.
3.  Create the `app/admin/layout.tsx` guard.
4.  Create the `/api/admin/*` endpoints.
5.  Build the dashboard page.
