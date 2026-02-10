"use client";

import { useEffect, useState } from "react";
import {
    Users,
    TrendingUp,
    Linkedin,
    Activity,
    FileText,
    ExternalLink,
    AlertTriangle,
    BarChart3,
    Download,
    Chrome
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

export default function AdminDashboard() {
    const [userStats, setUserStats] = useState<{
        totalUsers: number;
        last30Days: number;
        last7Days: number;
        paidUsers?: number;
        recentUsers?: { email: string; created_at: string }[];
        error?: string;
    } | null>(null);

    const [analytics, setAnalytics] = useState<{
        configured: boolean;
        totals?: { views: number; users: number };
        trend?: any[];
        pages?: any[];
        error?: string;
        message?: string;
    } | null>(null);

    const [linkedin, setLinkedin] = useState<{
        configured: boolean;
        dashboardUrl: string;
        analyticsUrl: string;
        followersUrl: string;
    } | null>(null);

    const [chromeStore, setChromeStore] = useState<{
        users: number;
        url: string;
    } | null>(null);

    const [userActivity, setUserActivity] = useState<{
        report: {
            user_email: string;
            user_id: string;
            total_sessions: number;
            total_days_used: number;
            first_used: string | null;
            last_used: string | null;
        }[]
    } | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [u, a, l, c, ua] = await Promise.all([
                    fetch('/api/admin/users').then(r => r.json()),
                    fetch('/api/admin/analytics').then(r => r.json()),
                    fetch('/api/admin/linkedin').then(r => r.json()),
                    fetch('/api/admin/chrome-store').then(r => r.json()),
                    fetch('/api/admin/user-activity').then(r => r.json())
                ]);
                setUserStats(u);
                setAnalytics(a);
                setLinkedin(l);
                setChromeStore(c);
                setUserActivity(ua);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Top Stats Grid */}
            {/* Top Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">

                {/* 1. Paid Users */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2 text-green-600">
                        <Users size={16} />
                        <span className="text-[10px] uppercase font-bold text-slate-400">Paid Users</span>
                    </div>
                    <div className="text-xl font-bold text-slate-900">
                        {userStats?.paidUsers?.toLocaleString() || "0"}
                    </div>
                </div>

                {/* 2. Registered Users */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2 text-blue-600">
                        <Users size={16} />
                        <span className="text-[10px] uppercase font-bold text-slate-400">Registered</span>
                    </div>
                    <div className="text-xl font-bold text-slate-900">
                        {userStats?.totalUsers?.toLocaleString() || "0"}
                    </div>
                    <div className="text-[10px] text-green-600 font-medium mt-1">
                        +{userStats?.last30Days || 0} recent
                    </div>
                </div>

                {/* 3. Chrome Users */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2 text-indigo-600">
                        <div className="flex items-center gap-2">
                            <Chrome size={16} />
                            <span className="text-[10px] uppercase font-bold text-slate-400">Chrome</span>
                        </div>
                    </div>
                    <div className="text-xl font-bold text-slate-900">
                        {chromeStore?.users?.toLocaleString() || "0"}
                    </div>
                    {chromeStore?.url && (
                        <a href={chromeStore.url} target="_blank" className="text-[10px] text-indigo-500 hover:underline mt-1 truncate">
                            View Store
                        </a>
                    )}
                </div>

                {/* 4. Impressions (Link Only) */}
                <a
                    href="https://chrome.google.com/webstore/devconsole/c6876d89-ae90-477a-aeb6-0b8049e49970/gmdpcildfnehopafflccogmhmichoppa/analytics/impressions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-400 transition-colors group cursor-pointer"
                >
                    <div className="flex items-center gap-2 mb-2 text-slate-400 group-hover:text-indigo-600">
                        <TrendingUp size={16} />
                        <span className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-indigo-600">Impressions</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-1">
                        View Report <ExternalLink size={12} className="opacity-50" />
                    </div>
                </a>

                {/* 5. Installs & Uninstalls (Link Only) */}
                <a
                    href="https://chrome.google.com/webstore/devconsole/c6876d89-ae90-477a-aeb6-0b8049e49970/gmdpcildfnehopafflccogmhmichoppa/analytics/installs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-400 transition-colors group cursor-pointer"
                >
                    <div className="flex items-center gap-2 mb-2 text-slate-400 group-hover:text-indigo-600">
                        <Download size={16} />
                        <span className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-indigo-600"> installs</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-1">
                        View Report <ExternalLink size={12} className="opacity-50" />
                    </div>
                </a>

                {/* 6. Website Visitors */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2 text-orange-600">
                        <Activity size={16} />
                        <span className="text-[10px] uppercase font-bold text-slate-400">Visitors</span>
                    </div>
                    <div className="text-xl font-bold text-slate-900">
                        {analytics?.totals?.users?.toLocaleString() || "0"}
                    </div>
                    {!analytics?.configured && (
                        <span className="text-[9px] text-amber-500 mt-1">Setup Req</span>
                    )}
                </div>

                {/* 7. Page Views */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2 text-purple-600">
                        <BarChart3 size={16} />
                        <span className="text-[10px] uppercase font-bold text-slate-400">Page Views</span>
                    </div>
                    <div className="text-xl font-bold text-slate-900">
                        {analytics?.totals?.views?.toLocaleString() || "0"}
                    </div>
                </div>

                {/* 8. Linkedin Portal */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between group cursor-pointer hover:border-blue-400 transition-colors"
                    onClick={() => linkedin?.dashboardUrl && window.open(linkedin.dashboardUrl, '_blank')}>
                    <div className="flex items-center gap-2 mb-2 text-[#0077b5]">
                        <Linkedin size={16} />
                        <span className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-blue-500">LinkedIn</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 flex items-center gap-1">
                        View Portal <ExternalLink size={12} className="opacity-50 group-hover:opacity-100" />
                    </div>
                </div>
            </div>

            {/* User Activity Section */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Activity size={18} /> User Activity
                </h3>
                <div className="overflow-x-auto max-h-[400px] custom-scrollbar">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0 z-10">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">User Email</th>
                                <th className="px-4 py-3">User ID</th>
                                <th className="px-4 py-3 text-center">Total Sessions</th>
                                <th className="px-4 py-3 text-center">Total Days Used</th>
                                <th className="px-4 py-3 text-center">First Used</th>
                                <th className="px-4 py-3 text-center rounded-r-lg">Last Used</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {userActivity?.report && userActivity.report.length > 0 ? (
                                userActivity.report.map((item, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-700 max-w-[200px] truncate" title={item.user_email}>{item.user_email}</td>
                                        <td className="px-4 py-3 text-xs font-mono text-slate-400 max-w-[150px] truncate" title={item.user_id}>{item.user_id}</td>
                                        <td className="px-4 py-3 text-center text-slate-600">{item.total_sessions}</td>
                                        <td className="px-4 py-3 text-center text-slate-600">{item.total_days_used}</td>
                                        <td className="px-4 py-3 text-center text-xs text-slate-500">
                                            {item.first_used ? new Date(item.first_used).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-center text-xs text-slate-500">
                                            {item.last_used ? new Date(item.last_used).toLocaleDateString() : '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                                        No activity data found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Main Graph */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <TrendingUp size={18} /> Website Traffic Trend
                    </h3>

                    {analytics?.configured && analytics?.trend ? (
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics.trend}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        tickFormatter={(val) => {
                                            if (!val) return '';
                                            // Format YYYYMMDD to DD/MM
                                            return `${val.substring(6, 8)}/${val.substring(4, 6)}`;
                                        }}
                                        minTickGap={30}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#2563eb"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorUsers)"
                                        name="Active Users"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] w-full flex flex-col items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                            <Activity className="text-slate-300 mb-2" size={48} />
                            <p className="text-slate-500 font-medium mb-1">No Analytics Data</p>
                            <p className="text-xs text-slate-400 max-w-xs text-center">
                                {analytics?.message || "Check server console for configuration errors."}
                            </p>
                        </div>
                    )}
                </div>

                {/* Top Pages */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <FileText size={18} /> Top Pages
                    </h3>

                    {analytics?.configured && analytics?.pages ? (
                        <div className="space-y-4">
                            {analytics.pages.map((page: any, i: number) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-700 truncate group-hover:text-blue-600 transition-colors" title={page.title}>
                                            {page.title === '(not set)' ? 'Home / Other' : page.title}
                                        </p>
                                        <p className="text-xs text-slate-400 truncate">{page.path}</p>
                                    </div>
                                    <div className="text-sm font-bold text-slate-900 pl-4">
                                        {page.views}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                            No page data available
                        </div>
                    )}
                </div>

                {/* Registered Users List */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Users size={18} /> Registered Users
                    </h3>

                    {userStats?.recentUsers && userStats.recentUsers.length > 0 ? (
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {userStats.recentUsers.map((user, i) => (
                                <div key={i} className="flex flex-col border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                                    <span className="text-sm font-medium text-slate-700 truncate" title={user.email}>
                                        {user?.email || 'Unknown Email'}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        {user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        }) : 'No Date'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                            No recent users
                        </div>
                    )}
                </div>
            </div>

            {/* Resources / Links Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-4">Data Sources</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm text-slate-600">Google Analytics Property</span>
                            <span className="text-xs font-mono bg-white border border-slate-200 px-2 py-1 rounded">
                                {analytics?.configured ? 'Connected' : 'Missing'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <span className="text-sm text-slate-600">Supabase Admin Access</span>
                            <span className={`text-xs font-mono bg-white border border-slate-200 px-2 py-1 rounded ${userStats?.error ? 'text-red-500' : 'text-green-600'}`}>
                                {userStats?.error ? 'Error' : 'Active'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#0077b5] to-[#005582] p-6 rounded-xl shadow-sm text-white">
                    <h3 className="font-bold text-lg mb-2">LinkedIn Report</h3>
                    <p className="text-blue-100 text-sm mb-6">
                        Access detailed follower demographics, organic impressions, and post engagement rates.
                    </p>
                    <a
                        href={linkedin?.analyticsUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-white text-[#0077b5] px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors"
                    >
                        Download Report <ExternalLink size={14} className="ml-2" />
                    </a>
                </div>
            </div >
        </div >
    );
}
