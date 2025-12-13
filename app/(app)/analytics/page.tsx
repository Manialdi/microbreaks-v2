"use client";

import { useState, useEffect } from "react";
import { Flame, Info } from "lucide-react";
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";
import { createClient } from "@/lib/supabase/client";

// --- Types ---
type EngagementDataPoint = {
    date: string;
    active: number;
    sessions: number;
    avg: number;
};

type StreakData = {
    name: string;
    email: string;
    currentStreak: number;
    maxStreak: number;
    consistencyScore: number;
};

type TimeOfDayData = {
    buckets: string[];
    days: string[];
    values: number[][]; // [bucketIndex][dayIndex]
};

type CategoryData = {
    name: string;
    value: number;
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState("Last 7 days");
    const [engagementData, setEngagementData] = useState<EngagementDataPoint[]>([]);
    const [streakData, setStreakData] = useState<StreakData[]>([]);
    const [timeOfDayData, setTimeOfDayData] = useState<TimeOfDayData | null>(null);
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const supabase = createClient();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch Company ID
            const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
            if (!profile?.company_id) return;

            const companyId = profile.company_id;

            // 1. Fetch Streak Leaderboard (Mocked logic for now as aggregations are complex client-side)
            // In real app: create a view or RPC
            const { data: employees } = await supabase
                .from('employees')
                .select('name, email, id') // Joined with dummy streaks effectively
                .eq('company_id', companyId)
                .limit(10);

            // Mock augmentation for demo purposes since we lack the sessions aggregation RPC
            const mockedStreaks = (employees || []).map(emp => ({
                name: emp.name || emp.email,
                email: emp.email,
                currentStreak: Math.floor(Math.random() * 15),
                maxStreak: Math.floor(Math.random() * 20),
                consistencyScore: Math.floor(Math.random() * 40) + 60
            })).sort((a, b) => b.currentStreak - a.currentStreak);

            setStreakData(mockedStreaks);


            // 2. Engagement Trends (Mocked for visual structure until SQL views are ready)
            setEngagementData([
                { date: "Mon", active: 30, sessions: 120, avg: 4 },
                { date: "Tue", active: 40, sessions: 160, avg: 4 },
                { date: "Wed", active: 35, sessions: 140, avg: 4 },
                { date: "Thu", active: 45, sessions: 180, avg: 4 },
                { date: "Fri", active: 42, sessions: 168, avg: 4 },
                { date: "Sat", active: 10, sessions: 30, avg: 3 },
                { date: "Sun", active: 5, sessions: 10, avg: 2 },
            ]);

            // 3. Time of Day (Mocked)
            setTimeOfDayData({
                buckets: ["9-11", "11-13", "13-15", "15-17", "17-19"],
                days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                values: [
                    [5, 10, 8, 12, 6],
                    [12, 15, 10, 14, 8],
                    [10, 12, 12, 10, 5],
                    [15, 12, 18, 15, 10],
                    [6, 8, 5, 8, 4]
                ]
            });

            // 4. Category (Mocked)
            setCategoryData([
                { name: "Neck mobility", value: 30 },
                { name: "Wrist mobility", value: 20 },
                { name: "Eye relaxation", value: 25 },
                { name: "Posture", value: 15 },
                { name: "Breathing", value: 10 },
            ]);

            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-500 mt-1">Understand how your employees use Micro-Breaks over time.</p>
            </div>

            {/* Grid Layout - UPDATED ORDER */}
            <div className="grid grid-cols-1 gap-8">

                {/* 1. Streak Leaderboard (TOP) */}
                <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Streak Leaderboard</h2>
                            <p className="text-xs text-gray-500">Top performers by consistency</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs font-semibold text-gray-500 border-b">
                                    <th className="pb-2 pl-2">Employee</th>
                                    <th className="pb-2 text-center">Streak</th>
                                    <th className="pb-2 text-center">Consistency Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {streakData.map((user, idx) => (
                                    <tr key={user.email} className={`text-sm ${idx < 3 ? 'bg-yellow-50/50' : ''}`}>
                                        <td className="py-3 pl-2">
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="py-3 text-center">
                                            <div className="flex items-center justify-center gap-1 font-bold text-gray-900">
                                                {user.currentStreak}
                                                {user.currentStreak > 5 && <Flame className="h-3 w-3 text-orange-500 fill-orange-500" />}
                                            </div>
                                        </td>
                                        <td className="py-3 text-center">
                                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {user.consistencyScore}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {streakData.length === 0 && (
                                    <tr><td colSpan={3} className="text-center py-4 text-gray-500">No streak data yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>


                {/* 2. Time-of-Day Insights (SECOND) */}
                <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col">
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Time-of-Day Insights</h2>
                        <p className="text-xs text-gray-500">Peak activity hours (Darker = More Active)</p>
                    </div>

                    {timeOfDayData && (
                        <div className="flex-1 flex flex-col justify-center overflow-x-auto">
                            <div className="min-w-[300px]">
                                {/* X-Axis Labels */}
                                <div className="flex mb-2">
                                    <div className="w-12"></div>
                                    {timeOfDayData.days.map(day => (
                                        <div key={day} className="flex-1 text-center text-xs text-gray-500 font-medium">{day}</div>
                                    ))}
                                </div>

                                {/* Rows */}
                                {timeOfDayData.buckets.map((bucket, i) => (
                                    <div key={bucket} className="flex items-center mb-1">
                                        <div className="w-12 text-xs text-gray-500 font-medium">{bucket}</div>
                                        {timeOfDayData.values[i].map((val, j) => (
                                            <div key={`${i}-${j}`} className="flex-1 px-0.5 aspect-[2/1] relative group cursor-default">
                                                <div
                                                    className={`w-full h-full rounded-sm ${val > 12 ? 'bg-blue-700' :
                                                            val > 8 ? 'bg-blue-500' :
                                                                val > 5 ? 'bg-blue-300' :
                                                                    val > 2 ? 'bg-blue-100' : 'bg-gray-100'
                                                        }`}
                                                ></div>
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap">
                                                    {val} sessions
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Engagement Trends (THIRD) */}
                <div className="bg-white rounded-xl shadow-sm border p-6 space-y-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Engagement Trends</h2>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* 1. Daily Active Employees */}
                        <div className="h-64">
                            <h3 className="text-sm font-semibold text-gray-500 mb-2">Daily Active Employees</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={engagementData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="active" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 2. Sessions Per Day */}
                        <div className="h-64">
                            <h3 className="text-sm font-semibold text-gray-500 mb-2">Total Sessions</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={engagementData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Bar dataKey="sessions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 3. Avg Exercises */}
                        <div className="h-64">
                            <h3 className="text-sm font-semibold text-gray-500 mb-2">Avg. Exercises per Employee</h3>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={engagementData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="avg" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 4. Category Breakdown (FOURTH) */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Exercise Category Breakdown</h2>

                    <div className="flex flex-col md:flex-row items-center justify-around h-64">
                        <div className="h-full w-full md:w-1/2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Legend */}
                        <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {categoryData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{entry.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {entry.value}%
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
