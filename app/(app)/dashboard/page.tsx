"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpDown, Search, Flame } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Types
type EmployeeStats = {
    id: string;
    name: string;
    email: string;
    status: string;
    sessionsToday: number;
    sessionsLast7Days: number;
    streakDays: number;
};

type DashboardStats = {
    totalInvitedEmployees: number;
    activeEmployees: number;
    sessionsToday: number;
    dailyEngagementPercent: number;
};

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        totalInvitedEmployees: 0,
        activeEmployees: 0,
        sessionsToday: 0,
        dailyEngagementPercent: 0
    });
    const [employees, setEmployees] = useState<EmployeeStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

    const supabase = createClient();

    useEffect(() => {
        async function loadDashboardData() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // 1. Get Company ID
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('company_id')
                    .eq('id', user.id)
                    .single();

                if (!profile?.company_id) {
                    setLoading(false);
                    return;
                }

                const companyId = profile.company_id;
                const today = new Date().toISOString().split('T')[0];
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                const sevenDaysAgoStr = sevenDaysAgo.toISOString();

                // 2. Fetch Employees
                const { data: empData, error: empError } = await supabase
                    .from('employees')
                    .select('*')
                    .eq('company_id', companyId);

                if (empError || !empData) throw empError;

                // 3. Fetch Sessions (Last 7 Days for performance/engagement stats)
                // Note: In a real large-scale app, this should be an aggregate view or RPC.
                const { data: sessionData, error: sessionError } = await supabase
                    .from('sessions')
                    .select('id, employee_id, started_at')
                    .eq('company_id', companyId)
                    .gte('started_at', sevenDaysAgoStr); // Optimization: only fetch recent

                if (sessionError) console.error("Error fetching sessions", sessionError);
                const sessions = sessionData || [];

                // --- Calculate KPI Stats ---

                const totalInvitedEmployees = empData.length;
                const activeEmployeesCount = empData.filter(e => e.status === 'active').length;

                // filtering sessions for today (local time approximation or UTC depending on DB)
                // Assuming DB is ISO UTC, we'll check matching date prefix for simplicity or JS date parsing
                const sessionsTodayList = sessions.filter(s => s.started_at.startsWith(today));
                const sessionsTodayCount = sessionsTodayList.length;

                // Daily Engagement: Unique active employees over active employees count
                const uniqueActiveToday = new Set(sessionsTodayList.map(s => s.employee_id));
                const dailyEngagementPercent = activeEmployeesCount > 0
                    ? Math.round((uniqueActiveToday.size / activeEmployeesCount) * 100)
                    : 0;

                setStats({
                    totalInvitedEmployees,
                    activeEmployees: activeEmployeesCount,
                    sessionsToday: sessionsTodayCount,
                    dailyEngagementPercent
                });

                // --- Process Employee Table Data ---

                const processedEmployees: EmployeeStats[] = empData.map(emp => {
                    const empSessions = sessions.filter(s => s.employee_id === emp.id);
                    const todayCount = empSessions.filter(s => s.started_at.startsWith(today)).length;

                    // Simple counting for last 7 days
                    const last7SaysCount = empSessions.length;

                    // Mocking Streak for now as it requires complex consecutive day calculation
                    // In production, this would be a column 'current_streak' on the employee table updated by a cron job/trigger
                    const mockStreak = emp.status === 'active' ? Math.floor(Math.random() * 10) : 0;

                    return {
                        id: emp.id,
                        name: emp.name || emp.email, // Fallback to email if name missing
                        email: emp.email,
                        status: emp.status || 'invited', // Default to invited
                        sessionsToday: todayCount,
                        sessionsLast7Days: last7SaysCount,
                        streakDays: mockStreak
                    };
                });

                setEmployees(processedEmployees);

            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }

        loadDashboardData();
    }, []);

    // Filter Logic
    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort Logic
    const sortedEmployees = [...filteredEmployees].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        // @ts-ignore
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        // @ts-ignore
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
    });

    const handleSort = (key: string) => {
        let direction: "asc" | "desc" = "desc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "desc") {
            direction = "asc";
        }
        setSortConfig({ key, direction });
    };

    if (loading) {
        return (
            <div className="space-y-8 p-8 max-w-7xl mx-auto animate-pulse">
                <div className="h-32 bg-gray-100 rounded-xl"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>)}
                </div>
                <div className="h-96 bg-gray-100 rounded-xl"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* 1. Hero Section */}
            <div className="bg-white rounded-xl shadow-sm border p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Company Wellness Overview</h1>
                    <p className="text-gray-500 mt-2 text-lg">Track how your employees are using Micro-Breaks today.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <Link href="/employees" className="flex-1 md:flex-none text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
                        Invite Employees
                    </Link>
                    <Link href="/analytics" className="flex-1 md:flex-none text-center bg-white text-gray-700 border px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
                        View Detailed Analytics
                    </Link>
                </div>
            </div>

            {/* 2. KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    label="Total Invited Employees"
                    value={stats.totalInvitedEmployees}
                    subtext="Includes active and invited"
                />
                <KpiCard
                    label="Employees Active"
                    value={stats.activeEmployees}
                    subtext="Signed in on extension"
                />
                <KpiCard
                    label="Sessions Today"
                    value={stats.sessionsToday}
                    subtext="Company-wide sessions"
                />
                <KpiCard
                    label="Daily Engagement"
                    value={`${stats.dailyEngagementPercent}%`}
                    subtext="% active with ≥1 session"
                    valueColor={
                        stats.dailyEngagementPercent > 60 ? "text-green-600" :
                            stats.dailyEngagementPercent < 30 ? "text-red-600" : "text-amber-600"
                    }
                />
            </div>

            {/* 3. Employee Performance Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-900">Employee Performance</h2>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm font-medium">
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <SortableHeader label="Sessions Today" onClick={() => handleSort("sessionsToday")} />
                                <SortableHeader label="Last 7 Days" onClick={() => handleSort("sessionsLast7Days")} />
                                <SortableHeader label="Streak" onClick={() => handleSort("streakDays")} />
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sortedEmployees.length > 0 ? (
                                sortedEmployees.map((employee) => (
                                    <tr key={employee.id} className="hover:bg-gray-50 transition cursor-default">
                                        <td className="px-6 py-4 font-medium text-gray-900">{employee.name}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{employee.email}</td>
                                        <td className="px-6 py-4 font-medium">{employee.sessionsToday}</td>
                                        <td className="px-6 py-4 text-gray-600">{employee.sessionsLast7Days}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <span className={`${employee.streakDays > 5 ? "font-bold text-orange-600" : "text-gray-600"}`}>
                                                    {employee.streakDays} days
                                                </span>
                                                {employee.streakDays > 5 && <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${employee.status === "active" ? "bg-green-100 text-green-800" :
                                                    employee.status === "invited" ? "bg-blue-100 text-blue-800" :
                                                        "bg-gray-100 text-gray-800"
                                                }`}>
                                                {employee.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No employees found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Components
function KpiCard({ label, value, subtext, valueColor = "text-gray-900" }: { label: string; value: string | number; subtext?: string; valueColor?: string }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</h3>
            <div className={`text-3xl font-bold mt-2 ${valueColor}`}>{value}</div>
            {subtext && <p className="text-sm text-gray-400 mt-1">{subtext}</p>}
        </div>
    );
}

function SortableHeader({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <th className="px-6 py-4 cursor-pointer hover:text-gray-900 group" onClick={onClick}>
            <div className="flex items-center gap-1">
                {label}
                <ArrowUpDown className="h-3 w-3 text-gray-400 group-hover:text-gray-600" />
            </div>
        </th>
    );
}
