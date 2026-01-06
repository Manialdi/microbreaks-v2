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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">

                {/* 1. Paid Users (New) */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <Users size={20} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">
                        {userStats?.paidUsers?.toLocaleString() || "0"}
                    </div>
                    <div className="text-sm text-slate-500">Paid Users</div>
                </div>

                {/* 2. Registered Users */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Users size={20} />
                        </div>
                        <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                            +{userStats?.last30Days || 0} this month
                        </span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">
                        {userStats?.totalUsers?.toLocaleString() || "0"}
                    </div>
                    <div className="text-sm text-slate-500">Registered Users</div>
                </div>

                {/* 3. Chrome Extension Users */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Chrome size={20} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">
                        {chromeStore?.users?.toLocaleString() || "0"}
                    </div>
                    <div className="text-sm text-slate-500 mb-2">Chrome Web Store Users</div>
                    {chromeStore?.url && (
                        <a
                            href={chromeStore.url}
                            target="_blank"
                            className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                        >
                            View Store Page <ExternalLink size={10} />
                        </a>
                    )}
                </div>

                {/* 4. Google Analytics Users */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                            <Activity size={20} />
                        </div>
                        {analytics?.configured && (
                            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                                Active 7d
                            </span>
                        )}
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">
                        {analytics?.totals?.users?.toLocaleString() || "N/A"}
                    </div>
                    <div className="text-sm text-slate-500">Website Visitors (30d)</div>
                    {!analytics?.configured && (
                        <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                            <AlertTriangle size={12} /> Setup Required
                        </p>
                    )}
                </div>

                {/* 5. Google Analytics Views */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <BarChart3 size={20} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">
                        {analytics?.totals?.views?.toLocaleString() || "N/A"}
                    </div>
                    <div className="text-sm text-slate-500">Page Views (30d)</div>
                </div>

                {/* 6. LinkedIn Quick Access */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-100 text-[#0077b5] rounded-lg">
                            <Linkedin size={20} />
                        </div>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">LinkedIn Portal</h3>
                    {linkedin?.configured ? (
                        <a
                            href={linkedin.dashboardUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                        >
                            Open Dashboard <ExternalLink size={14} className="ml-1" />
                        </a>
                    ) : (
                        <p className="text-sm text-slate-500">Not configured</p>
                    )}
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
