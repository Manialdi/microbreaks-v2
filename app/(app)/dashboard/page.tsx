"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Search, Flame } from "lucide-react";

// Mock Data
const MOCK_STATS = {
    totalInvitedEmployees: 120,
    activeEmployees: 87,
    sessionsToday: 243,
    dailyEngagementPercent: 72,
};

const MOCK_EMPLOYEES = [
    { id: "1", name: "Jane Doe", email: "jane@company.com", sessionsToday: 3, sessionsLast7Days: 14, streakDays: 6, status: "Active" },
    { id: "2", name: "John Smith", email: "john@company.com", sessionsToday: 0, sessionsLast7Days: 5, streakDays: 0, status: "Active" },
    { id: "3", name: "Alice Johnson", email: "alice@company.com", sessionsToday: 5, sessionsLast7Days: 20, streakDays: 12, status: "Active" },
    { id: "4", name: "Bob Brown", email: "bob@company.com", sessionsToday: 0, sessionsLast7Days: 0, streakDays: 0, status: "Invited" },
    { id: "5", name: "Charlie Davis", email: "charlie@company.com", sessionsToday: 2, sessionsLast7Days: 10, streakDays: 3, status: "Inactive" },
    { id: "6", name: "Diana Evans", email: "diana@company.com", sessionsToday: 4, sessionsLast7Days: 18, streakDays: 8, status: "Active" },
];

export default function DashboardPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

    // Filter Logic
    const filteredEmployees = MOCK_EMPLOYEES.filter(employee =>
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
        let direction: "asc" | "desc" = "desc"; // Default to desc for numbers usually
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "desc") {
            direction = "asc";
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="space-y-8">
            {/* 1. Hero Section */}
            <div className="bg-white rounded-xl shadow-sm border p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Company Wellness Overview</h1>
                    <p className="text-gray-500 mt-2 text-lg">Track how your employees are using Micro-Breaks today.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <Link href="/invite" className="flex-1 md:flex-none text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
                        Invite Employees
                    </Link>
                    <button className="flex-1 md:flex-none bg-white text-gray-700 border px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition">
                        View Detailed Analytics
                    </button>
                </div>
            </div>

            {/* 2. KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    label="Total Invited Employees"
                    value={MOCK_STATS.totalInvitedEmployees}
                    subtext="Includes active and invited"
                />
                <KpiCard
                    label="Employees Active"
                    value={MOCK_STATS.activeEmployees}
                    subtext="Signed in on extension"
                />
                <KpiCard
                    label="Sessions Today"
                    value={MOCK_STATS.sessionsToday}
                    subtext="Company-wide sessions"
                />
                <KpiCard
                    label="Daily Engagement"
                    value={`${MOCK_STATS.dailyEngagementPercent}%`}
                    subtext="% active with ≥1 session"
                    valueColor={
                        MOCK_STATS.dailyEngagementPercent > 60 ? "text-green-600" :
                            MOCK_STATS.dailyEngagementPercent < 30 ? "text-red-600" : "text-amber-600"
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
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${employee.status === "Active" ? "bg-green-100 text-green-800" :
                                                    employee.status === "Invited" ? "bg-blue-100 text-blue-800" :
                                                        "bg-gray-100 text-gray-800" // Inactive
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
