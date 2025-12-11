"use client";

import { useState } from "react";
import { Flame, Info } from "lucide-react";
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";

// --- Mock Data ---
const ENGAGEMENT_DATA = {
    dates: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    dailyActiveEmployees: [32, 40, 38, 45, 42, 10, 5],
    sessionsPerDay: [120, 150, 132, 160, 145, 40, 20],
    avgExercisesPerEmployee: [3.2, 3.8, 3.5, 3.9, 3.6, 2.0, 1.5]
};

const STREAK_DATA = [
    { name: "Jane Doe", email: "jane@company.com", currentStreak: 12, maxStreak: 14, consistencyScore: 92 },
    { name: "Alice Johnson", email: "alice@company.com", currentStreak: 7, maxStreak: 10, consistencyScore: 88 },
    { name: "Bob Brown", email: "bob@company.com", currentStreak: 3, maxStreak: 5, consistencyScore: 75 },
    { name: "Charlie Davis", email: "charlie@company.com", currentStreak: 0, maxStreak: 2, consistencyScore: 40 },
    { name: "Diana Evans", email: "diana@company.com", currentStreak: 5, maxStreak: 8, consistencyScore: 82 },
];

const TIME_OF_DAY_DATA = {
    buckets: ["9-11", "11-13", "13-15", "15-17", "17-19"],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    values: [
        [5, 8, 12, 6, 2],   // 9-11
        [10, 15, 8, 12, 5], // 11-13
        [8, 12, 10, 8, 4],  // 13-15
        [12, 10, 15, 10, 6], // 15-17
        [4, 6, 5, 8, 3]     // 17-19
    ]
};

const CATEGORY_DATA = [
    { name: "Neck mobility", value: 324 },
    { name: "Wrist mobility", value: 180 },
    { name: "Eye relaxation", value: 210 },
    { name: "Posture", value: 220 },
    { name: "Breathing", value: 80 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
    const [dateRange, setDateRange] = useState("Last 7 days");
    const [streakTimeframe, setStreakTimeframe] = useState("All time");
    const [categoryTimeframe, setCategoryTimeframe] = useState("All time");

    // Transform ENGAGEMENT_DATA for Recharts
    const chartData = ENGAGEMENT_DATA.dates.map((date, index) => ({
        date,
        active: ENGAGEMENT_DATA.dailyActiveEmployees[index],
        sessions: ENGAGEMENT_DATA.sessionsPerDay[index],
        avg: ENGAGEMENT_DATA.avgExercisesPerEmployee[index]
    }));

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-500 mt-1">Understand how your employees use Micro-Breaks over time.</p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* SECTION A: Engagement Trends */}
                <div className="bg-white rounded-xl shadow-sm border p-6 lg:col-span-2 space-y-8">
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

                    {/* 1. Daily Active Employees */}
                    <div className="h-64">
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Daily Active Employees</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
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
                            <BarChart data={chartData}>
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
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="avg" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* SECTION B: Streak Leaderboard */}
                <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Streak Leaderboard</h2>
                            <p className="text-xs text-gray-500">Top performers by consistency</p>
                        </div>
                        <select
                            value={streakTimeframe}
                            onChange={(e) => setStreakTimeframe(e.target.value)}
                            className="border rounded-lg px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option>All time</option>
                            <option>Last 30 days</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs font-semibold text-gray-500 border-b">
                                    <th className="pb-2 pl-2">Employee</th>
                                    <th className="pb-2 text-center">Streak</th>
                                    <th className="pb-2 text-center">Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {STREAK_DATA.sort((a, b) => b.currentStreak - a.currentStreak).map((user, idx) => (
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
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* SECTION C: Time-of-Day Insights (Heatmap Mock) */}
                <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col">
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Time-of-Day Insights</h2>
                        <p className="text-xs text-gray-500">Peak activity hours (Darker = More Active)</p>
                    </div>

                    <div className="flex-1 flex flex-col justify-center overflow-x-auto">
                        <div className="min-w-[300px]">
                            {/* X-Axis Labels */}
                            <div className="flex mb-2">
                                <div className="w-12"></div>
                                {TIME_OF_DAY_DATA.days.map(day => (
                                    <div key={day} className="flex-1 text-center text-xs text-gray-500 font-medium">{day}</div>
                                ))}
                            </div>

                            {/* Rows */}
                            {TIME_OF_DAY_DATA.buckets.map((bucket, i) => (
                                <div key={bucket} className="flex items-center mb-1">
                                    <div className="w-12 text-xs text-gray-500 font-medium">{bucket}</div>
                                    {TIME_OF_DAY_DATA.values[i].map((val, j) => (
                                        <div key={`${i}-${j}`} className="flex-1 px-0.5 aspect-[2/1] relative group cursor-default">
                                            <div
                                                className={`w-full h-full rounded-sm ${val > 12 ? 'bg-blue-700' :
                                                        val > 8 ? 'bg-blue-500' :
                                                            val > 5 ? 'bg-blue-300' :
                                                                val > 2 ? 'bg-blue-100' : 'bg-gray-100'
                                                    }`}
                                            ></div>
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap">
                                                {val} sessions
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex items-center justify-end gap-2 text-xs text-gray-500">
                            <span>Low</span>
                            <div className="flex gap-0.5">
                                <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
                                <div className="w-3 h-3 bg-blue-100 rounded-sm"></div>
                                <div className="w-3 h-3 bg-blue-300 rounded-sm"></div>
                                <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                                <div className="w-3 h-3 bg-blue-700 rounded-sm"></div>
                            </div>
                            <span>High</span>
                        </div>
                    </div>
                </div>

                {/* SECTION D: Category Breakdown */}
                <div className="bg-white rounded-xl shadow-sm border p-6 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Exercise Breakdown</h2>
                        <select
                            value={categoryTimeframe}
                            onChange={(e) => setCategoryTimeframe(e.target.value)}
                            className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option>All time</option>
                            <option>Last 30 days</option>
                        </select>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-around h-64">
                        <div className="h-full w-full md:w-1/2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={CATEGORY_DATA}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {CATEGORY_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Legend */}
                        <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {CATEGORY_DATA.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{entry.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {entry.value} sessions ({Math.round((entry.value / 1014) * 100)}%)
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
