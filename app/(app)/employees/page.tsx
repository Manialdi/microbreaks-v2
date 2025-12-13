"use client";

import { useState, useCallback } from "react";
import {
    Search, MoreVertical, Copy, Upload, Mail, X,
    RotateCcw, Trash2, Flame, CheckCircle, AlertCircle
} from "lucide-react";
import Papa from "papaparse";
import {
    BarChart, Bar, XAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";
import { createClient } from "@/lib/supabase/client";

// --- Mock Data ---

const MOCK_EMPLOYEES = [
    {
        id: "1",
        name: "Jane Doe",
        email: "jane@company.com",
        status: "Active",
        sessionsToday: 4,
        sessionsThisWeek: 18,
        totalSessions: 122,
        lastActive: "2025-12-10T08:33:00Z",
        createdAt: "2025-03-12T11:02:00Z",
        streakDays: 6,
        trend7Days: [3, 2, 4, 1, 5, 3, 4],
        exerciseBreakdown: { neck: 32, wrist: 18, eye: 20, posture: 22, breathing: 8 }
    },
    // ... (Keep existing mocks for fallback or remove if fully switching)
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

// --- Types ---
type Employee = typeof MOCK_EMPLOYEES[0];

export default function EmployeesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [inviteEmails, setInviteEmails] = useState("");
    const [isPreviewingInvite, setIsPreviewingInvite] = useState(false);
    const [parsedEmails, setParsedEmails] = useState<{ email: string, valid: boolean, reason?: string }[]>([]);
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [csvPreview, setCsvPreview] = useState<{ valid: any[], invalid: any[] } | null>(null);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const createSupabase = () => createClient();
    const supabase = createSupabase();

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // --- Actions ---

    const handleCopyLink = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
        if (profile?.company_id) {
            const url = `https://micro-breaks.com/signup?company=${profile.company_id}`;
            navigator.clipboard.writeText(url);
            showToast("Invite link copied!");
        }
    };

    const validateEmailDomain = async (email: string): Promise<boolean> => {
        // In real app, we fetch company domain from DB. 
        // For UI demo, assume current user's email domain is the restriction.
        const { data: { user } } = await supabase.auth.getUser();
        const userDomain = user?.email?.split('@')[1];

        if (!userDomain) return true; // Fallback
        return email.trim().endsWith(`@${userDomain}`);
    };

    const handleInvitePreview = async () => {
        const rawEmails = inviteEmails.split(',').map(e => e.trim()).filter(e => e.length > 0);
        const { data: { user } } = await supabase.auth.getUser();

        // Mock domain check - assume user's domain
        const requiredDomain = user?.email ? user.email.split('@')[1] : "company.com";

        const validated = rawEmails.map(email => {
            const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            const isCorrectDomain = email.endsWith(`@${requiredDomain}`);

            let valid = isValidFormat && isCorrectDomain;
            let reason = "";
            if (!isValidFormat) reason = "Invalid email format";
            else if (!isCorrectDomain) reason = `Must be @${requiredDomain}`;

            return { email, valid, reason };
        });

        setParsedEmails(validated);
        if (validated.length > 0) setIsPreviewingInvite(true);
    };

    const handleSendInvite = async () => {
        const validEmails = parsedEmails.filter(e => e.valid).map(e => e.email);

        // 1. Insert into Invites table
        // 2. Upsert into Employees table with status 'invited'
        // For now, mock success

        showToast(`Invites sent to ${validEmails.length} employees.`);
        setIsPreviewingInvite(false);
        setInviteEmails("");
        setParsedEmails([]);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCsvFile(file);
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: async (results) => {
                    const { data: { user } } = await supabase.auth.getUser();
                    const requiredDomain = user?.email ? user.email.split('@')[1] : "company.com";

                    const rows = results.data as any[];
                    const valid: any[] = [];
                    const invalid: any[] = [];

                    rows.forEach((row, idx) => {
                        // Normalize keys (case insensitive)
                        const normalized: any = {};
                        Object.keys(row).forEach(k => normalized[k.toLowerCase()] = row[k]);

                        const email = normalized['mail id'] || normalized['email'];
                        const name = normalized['name'];

                        if (!email || !name) {
                            invalid.push({ ...row, reason: "Missing Name or Mail id" });
                            return;
                        }

                        const isCorrectDomain = email.trim().endsWith(`@${requiredDomain}`);

                        if (isCorrectDomain) {
                            valid.push(normalized);
                        } else {
                            invalid.push({ ...row, reason: "Incorrect domain" });
                        }
                    });

                    setCsvPreview({ valid, invalid });
                }
            });
        }
    };

    const handleImportEmployees = () => {
        if (!csvPreview) return;
        // Logic to upsert valid rows to Supabase
        showToast(`Imported ${csvPreview.valid.length} employees. Skipped ${csvPreview.invalid.length} invalid rows.`);
        setCsvFile(null);
        setCsvPreview(null);
    };

    // --- Filtering ---
    const filteredEmployees = MOCK_EMPLOYEES.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || emp.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8 relative">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium z-50 animate-fade-in-up ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {toast.message}
                </div>
            )}

            {/* SECTION 1: Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Employees</h1>
                    <p className="text-gray-500 mt-1">Invite employees and manage their activity across the Micro-Breaks platform.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleCopyLink}
                        className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition shadow-sm"
                    >
                        <Copy className="h-4 w-4" /> Copy Invite Link
                    </button>
                    <button
                        onClick={() => document.getElementById('invite-card')?.scrollIntoView({ behavior: 'smooth' })}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition shadow-sm"
                    >
                        <Mail className="h-4 w-4" /> Invite Employees
                    </button>
                </div>
            </div>

            {/* SECTION 2: Invite Card */}
            <div id="invite-card" className="bg-white rounded-xl shadow-sm border p-6 space-y-8">
                {/* A. Email Invitation */}
                <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                        <label className="text-sm font-semibold text-gray-900">Invite New Employees</label>
                        <span className="text-xs text-gray-500">Enter email addresses separated by commas (Example: john@company.com)</span>
                    </div>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            className="flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder="john@company.com, jane@company.com"
                            value={inviteEmails}
                            onChange={(e) => setInviteEmails(e.target.value)}
                        />
                        <button
                            onClick={handleInvitePreview}
                            className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition text-sm whitespace-nowrap"
                        >
                            Preview Invite →
                        </button>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* B. CSV Upload */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">Bulk Upload via CSV</h3>
                            <p className="text-sm text-gray-500 mt-1">Upload a CSV to invite or update multiple employees.</p>
                            <p className="text-xs text-gray-400 mt-1">Only 4 columns needed: Name, Mail id, Employee id, Department.</p>
                        </div>
                        <button className="text-sm text-blue-600 hover:underline">Download sample CSV</button>
                    </div>

                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer relative">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                        {csvFile ? (
                            <div className="text-sm text-gray-900 font-medium">
                                Selected: {csvFile.name}
                                {csvPreview && (
                                    <div className="mt-2 space-y-1">
                                        <span className="block text-green-600">{csvPreview.valid.length} valid rows</span>
                                        {csvPreview.invalid.length > 0 && <span className="block text-red-600">{csvPreview.invalid.length} invalid rows</span>}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500 mt-1">UTF-8 encoded CSV only</p>
                            </>
                        )}
                    </div>
                    {csvFile && csvPreview && (
                        <div className="mt-4 flex justify-end gap-2">
                            <button onClick={() => { setCsvFile(null); setCsvPreview(null); }} className="px-4 py-2 border rounded-lg text-sm text-gray-700">Cancel</button>
                            <button onClick={handleImportEmployees} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700" disabled={csvPreview.valid.length === 0}>
                                Import {csvPreview.valid.length} Employees
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* SECTION 4: Employee Directory Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-900">Employee Directory</h2>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Invited">Invited</option>
                            <option value="Disabled">Disabled</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Sessions (Today)</th>
                                <th className="px-6 py-4">Last Active</th>
                                <th className="px-6 py-4">Created At</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredEmployees.map((emp) => (
                                <tr
                                    key={emp.id}
                                    className="hover:bg-gray-50 transition cursor-pointer"
                                    onClick={() => setSelectedEmployee(emp)}
                                >
                                    <td className="px-6 py-4 font-semibold text-gray-900">{emp.name}</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{emp.email}</td>
                                    <td className="px-6 py-4">
                                        <Badge status={emp.status} />
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 font-medium">{emp.sessionsToday}</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{emp.lastActive ? new Date(emp.lastActive).toLocaleDateString() : '-'}</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{new Date(emp.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600 p-1">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SECTION 5: Side Drawer */}
            {selectedEmployee && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={() => setSelectedEmployee(null)}
                    ></div>
                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col animate-slide-in-right">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{selectedEmployee.name}</h2>
                                <p className="text-sm text-gray-500">{selectedEmployee.email}</p>
                            </div>
                            <button
                                onClick={() => setSelectedEmployee(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-8 flex-1">
                            {/* A. Quick Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <StatCard label="Sessions Today" value={selectedEmployee.sessionsToday} />
                                <StatCard label="Total Sessions" value={selectedEmployee.totalSessions} />
                                <StatCard
                                    label="Streak"
                                    value={
                                        <div className="flex items-center gap-1">
                                            <span>{selectedEmployee.streakDays} days</span>
                                            {selectedEmployee.streakDays > 5 && <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />}
                                        </div>
                                    }
                                />
                                <StatCard label="Last 7 Days" value={selectedEmployee.sessionsThisWeek} />
                            </div>

                            {/* B. Activity Chart */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">7-Day Activity Trend</h3>
                                <div className="h-40 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={selectedEmployee.trend7Days.map((val, i) => ({ day: i, sessions: val }))}>
                                            <XAxis dataKey="day" hide />
                                            <Tooltip />
                                            <Bar dataKey="sessions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* C. Exercise Breakdown */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">Exercise Breakdown</h3>
                                <div className="h-48 w-full flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={Object.entries(selectedEmployee.exerciseBreakdown).map(([name, value]) => ({ name, value }))}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {Object.entries(selectedEmployee.exerciseBreakdown).map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex flex-wrap gap-2 justify-center mt-2">
                                    {Object.keys(selectedEmployee.exerciseBreakdown).map((key, i) => (
                                        <div key={key} className="flex items-center gap-1 text-xs text-gray-500 capitalize">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                            {key}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* D. Timestamps */}
                            <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
                                <div>
                                    <p className="text-gray-500">Last Active</p>
                                    <p className="font-medium">{selectedEmployee.lastActive ? new Date(selectedEmployee.lastActive).toLocaleString() : 'Never'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Joined On</p>
                                    <p className="font-medium">{new Date(selectedEmployee.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* E. Action Buttons */}
                        <div className="mt-8 space-y-3 pt-6 border-t">
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition">
                                <Mail className="h-4 w-4" /> Send Reminder Email
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition">
                                <RotateCcw className="h-4 w-4" /> Reset Password
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition">
                                <Trash2 className="h-4 w-4" /> Deactivate Access
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Invite Modal */}
            {isPreviewingInvite && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Confirm Invitations</h3>
                        <p className="text-sm text-gray-500 mb-4">We will send an invitation to the following people:</p>

                        <div className="max-h-40 overflow-y-auto border rounded-lg p-2 mb-6 bg-gray-50 space-y-1">
                            {parsedEmails.map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm py-1 px-2 border-b last:border-0 border-gray-100">
                                    <div className="flex items-center gap-2">
                                        {item.valid ? (
                                            <CheckCircle className="h-3 w-3 text-green-500" />
                                        ) : (
                                            <AlertCircle className="h-3 w-3 text-red-500" />
                                        )}
                                        <span className={item.valid ? "text-gray-900" : "text-red-600"}>{item.email}</span>
                                    </div>
                                    {!item.valid && <span className="text-xs text-red-500">{item.reason}</span>}
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsPreviewingInvite(false)}
                                className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendInvite}
                                disabled={!parsedEmails.some(e => e.valid)}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Send {parsedEmails.filter(e => e.valid).length} Invites
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Helper Components ---

function Badge({ status }: { status: string }) {
    const styles = {
        Active: "bg-green-100 text-green-800",
        Invited: "bg-blue-100 text-blue-800",
        Disabled: "bg-gray-100 text-gray-800",
    }[status] || "bg-gray-100 text-gray-800";

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles}`}>
            {status}
        </span>
    );
}

function StatCard({ label, value }: { label: string, value: React.ReactNode }) {
    return (
        <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</div>
            <div className="text-xl font-bold text-gray-900">{value}</div>
        </div>
    );
}
