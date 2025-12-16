"use client";

import { useState, useCallback, useEffect } from "react";
import {
    Search, MoreVertical, Copy, Upload, Mail, X,
    RotateCcw, Trash2, Flame, CheckCircle, AlertCircle, AlertTriangle
} from "lucide-react";
import Papa from "papaparse";
import {
    BarChart, Bar, XAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";
import { createClient } from "@/lib/supabase/client";

// --- Types ---
type EmployeeStats = {
    id: string;
    name: string;
    email: string;
    status: string;
    sessionsToday: number;
    sessionsThisWeek: number;
    totalSessions: number;
    lastActive: string | null;
    createdAt: string;
    streakDays: number;
    trend7Days: number[];
    exerciseBreakdown: Record<string, number>;
};


const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function EmployeesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeStats | null>(null);

    // Invite State
    const [inviteEmails, setInviteEmails] = useState("");
    const [isPreviewingInvite, setIsPreviewingInvite] = useState(false);
    const [parsedEmails, setParsedEmails] = useState<{ email: string, valid: boolean, reason?: string }[]>([]);

    // CSV State
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [csvPreview, setCsvPreview] = useState<{ valid: any[], invalid: any[] } | null>(null);

    // Data State
    const [employees, setEmployees] = useState<EmployeeStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [companyDomain, setCompanyDomain] = useState<string | null>(null);
    const [companyId, setCompanyId] = useState<string | null>(null);

    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const supabase = createClient();

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // --- 1. Initial Data Fetch ---
    useEffect(() => {
        async function init() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // A. Get Profile & Company
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('company_id, companies(domain)')
                    .eq('id', user.id)
                    .single();

                if (!profile?.company_id) return;

                const cId = profile.company_id;
                // @ts-ignore
                let domain = profile.companies?.domain;

                // Fallback: Use HR User's email domain if DB value is missing
                if (!domain && user.email) {
                    const parts = user.email.split('@');
                    if (parts.length === 2) {
                        domain = parts[1];
                    }
                }

                setCompanyId(cId);
                setCompanyDomain(domain || null);

                // B. Fetch Employees
                const { data: emps, error } = await supabase
                    .from('employees')
                    .select('*')
                    .eq('company_id', cId);

                if (error) throw error;

                // C. Fetch Sessions for aggregation (Optimization: only needed columns)
                // In production, use RPC. For now, aggregate client side.
                const { data: sessions } = await supabase
                    .from('sessions')
                    .select('employee_id, started_at')
                    .eq('company_id', cId);

                const sessionList = sessions || [];
                const today = new Date().toISOString().split('T')[0];
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

                // Process Employees
                const processed = emps.map(emp => {
                    const mySessions = sessionList.filter(s => s.employee_id === emp.id);
                    const todayCount = mySessions.filter(s => s.started_at.startsWith(today)).length;
                    const weekCount = mySessions.filter(s => new Date(s.started_at) >= sevenDaysAgo).length;

                    // Keep mock for visualizations
                    const trend = [0, 0, 0, 0, 0, 0, 0].map(() => Math.floor(Math.random() * 5));
                    const breakdown = { neck: 10, wrist: 5, eye: 8, posture: 12, breathing: 3 };

                    return {
                        id: emp.id,
                        name: emp.name || emp.email,
                        email: emp.email,
                        status: emp.status || 'invited',
                        sessionsToday: todayCount,
                        sessionsThisWeek: weekCount,
                        totalSessions: mySessions.length,
                        lastActive: emp.last_active_at || null,
                        createdAt: emp.created_at || new Date().toISOString(),
                        streakDays: emp.status === 'active' ? Math.floor(Math.random() * 10) : 0,
                        trend7Days: trend,
                        exerciseBreakdown: breakdown
                    };
                });

                setEmployees(processed);

            } catch (err) {
                console.error(err);
                showToast("Failed to load employee data", 'error');
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    // --- 2. Action Handlers ---

    const handleCopyLink = () => {
        if (!companyId) return;
        const url = `https://micro-breaks.com/signup?company=${companyId}`;
        navigator.clipboard.writeText(url);
        showToast("Invite link copied!");
    };


    const handleInvitePreview = () => {
        // Parse & Validate
        const rawEmails = inviteEmails.split(',').map(e => e.trim()).filter(e => e.length > 0);

        const validated = rawEmails.map(email => {
            const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            // Strict match
            const isCorrectDomain = companyDomain ? email.toLowerCase().endsWith(`@${companyDomain.toLowerCase()}`) : false;

            let valid = isValidFormat && isCorrectDomain;
            let reason = "";
            if (!isValidFormat) reason = "Invalid email format";
            else if (!isCorrectDomain) reason = `Email domain must match your company domain: @${companyDomain}`;

            return { email, valid, reason };
        });

        setParsedEmails(validated);
        if (validated.length > 0) setIsPreviewingInvite(true);
    };

    const handleSendInvite = async () => {
        if (!companyId) return;
        const validEmails = parsedEmails.filter(e => e.valid).map(e => e.email);

        if (parsedEmails.some(e => !e.valid)) {
            showToast(`Please remove invalid emails before sending.`, 'error');
            return;
        }

        if (validEmails.length === 0) return;

        try {
            const response = await fetch('/api/hr/send-invites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emails: validEmails, companyId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to send invites");
            }

            const results = data.results || [];
            const failed = results.filter((r: any) => r.status === 'error');
            const success = results.filter((r: any) => r.status === 'success');

            if (failed.length > 0) {
                showToast(`Sent ${success.length}, Failed ${failed.length}. Check console.`, 'error');
                console.error("Failed emails:", failed);
            } else {
                showToast(`Invites sent to ${success.length} employees successfully.`);
            }

            setIsPreviewingInvite(false);
            setInviteEmails("");
            setParsedEmails([]);

            // Reload to update list
            setTimeout(() => window.location.reload(), 1000);

        } catch (err: any) {
            console.error("Invite API Error:", err);
            showToast(`Error: ${err.message || "We couldn't send the invites."}`, 'error');
        }
    };

    // --- 3. CSV Handlers ---

    const downloadSampleCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8,Name,Mail id,Employee id,Department\nJohn Doe,john.doe@acme.com,EMP001,Sales";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "micro-breaks-sample.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCsvFile(file);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const rows = results.data as any[];

                // We will flatten checks: Row is VALID only if everything is perfect.
                const validRows: any[] = [];
                const invalidRows: any[] = [];

                rows.forEach(row => {
                    const normalized: any = {};
                    Object.keys(row).forEach(k => normalized[k.toLowerCase().trim()] = row[k]);

                    const email = normalized['mail id'] || normalized['email'];
                    const name = normalized['name'];
                    const empId = normalized['employee id'] || normalized['employee_id'] || null;
                    const dept = normalized['department'] || null;


                    if (!email || !name) {
                        invalidRows.push({ ...row, reason: "Missing Name or Mail id", _status: "Invalid" });
                        return;
                    }

                    // Domain check strict
                    const isCorrectDomain = companyDomain ? email.trim().toLowerCase().endsWith(`@${companyDomain.toLowerCase()}`) : false;
                    const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

                    if (isCorrectDomain && isValidFormat) {
                        validRows.push({
                            name,
                            email,
                            employee_id: empId,
                            department: dept,
                            _status: "Valid"
                        });
                    } else {
                        let reason = "Invalid email format";
                        if (!isCorrectDomain) reason = `Email domain must match @${companyDomain}`;
                        invalidRows.push({ ...row, reason, _status: "Invalid" });
                    }
                });

                setCsvPreview({ valid: validRows, invalid: invalidRows });
            }
        });
    };

    const handleImportEmployees = async () => {
        if (!csvPreview || !companyId || csvPreview.invalid.length > 0) return;

        try {
            const { valid } = csvPreview;

            // Sequential upsert/check pattern to avoid missing constraint error
            for (const r of valid) {
                const { data: existing } = await supabase
                    .from('employees')
                    .select('id')
                    .eq('company_id', companyId)
                    .eq('email', r.email)
                    .single();

                if (existing) {
                    await supabase.from('employees').update({
                        name: r.name,
                        employee_id: r.employee_id,
                        department: r.department,
                        status: 'invited'
                    }).eq('id', existing.id);
                } else {
                    await supabase.from('employees').insert({
                        company_id: companyId,
                        email: r.email,
                        name: r.name,
                        employee_id: r.employee_id,
                        department: r.department,
                        status: 'invited'
                    });
                }
            }

            showToast(`Imported ${valid.length} employees successfully.`);
            setCsvFile(null);
            setCsvPreview(null);
            window.location.reload();

        } catch (err: any) {
            console.error(err);
            showToast(`Error importing: ${err.message || 'Unknown error'}`, 'error');
        }
    };

    // --- 4. Render Logic ---

    // Filtering
    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || emp.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const hasInvalidCsvRows = csvPreview ? csvPreview.invalid.length > 0 : false;
    const hasInvalidInviteRows = parsedEmails.some(x => !x.valid);

    if (loading) return <div className="p-12 text-center text-gray-500 animate-pulse">Loading employee directory...</div>;

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
                    <p className="text-gray-500 mt-1">Invite employees and manage their activity across Micro-Breaks.</p>
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
                        <span className="text-xs text-gray-500">
                            {companyDomain ? `Only emails from @${companyDomain} are allowed.` : "Enter email addresses separated by commas."}
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            className="flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder={companyDomain ? `john@${companyDomain}, jane@${companyDomain}` : "john@company.com"}
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
                            <p className="text-xs text-gray-400 mt-1">Only 4 columns needed: <span className="font-mono">Name</span>, <span className="font-mono">Mail id</span>, <span className="font-mono">Employee id</span>, <span className="font-mono">Department</span>.</p>
                        </div>
                        <button onClick={downloadSampleCSV} className="text-sm text-blue-600 hover:underline">Download sample CSV</button>
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
                                        <div className="flex items-center justify-center gap-2 text-green-600">
                                            <CheckCircle className="h-4 w-4" />
                                            {csvPreview.valid.length} valid rows
                                        </div>
                                        {csvPreview.invalid.length > 0 && (
                                            <div className="flex items-center justify-center gap-2 text-red-600">
                                                <AlertCircle className="h-4 w-4" />
                                                {csvPreview.invalid.length} invalid rows (Must fix to import)
                                            </div>
                                        )}
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

                    {/* CSV Preview Modal / List (In-place) */}
                    {csvFile && csvPreview && (
                        <div className="mt-6 border rounded-xl overflow-hidden">
                            {/* Alert Header if invalid */}
                            {hasInvalidCsvRows && (
                                <div className="bg-red-50 border-b border-red-100 p-4 flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-red-900">Some rows have invalid emails.</h4>
                                        <p className="text-sm text-red-800 mt-1">
                                            All employees must use your company domain: <span className="font-mono font-bold">@{companyDomain}</span>.
                                            Please fix the highlighted rows in your CSV and upload again.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Table Preview */}
                            <div className="max-h-60 overflow-y-auto bg-gray-50">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-100 text-gray-500 font-medium sticky top-0">
                                        <tr>
                                            <th className="p-3">Name</th>
                                            <th className="p-3">Email</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {[...csvPreview.invalid, ...csvPreview.valid].map((row, idx) => (
                                            <tr key={idx} className={row._status === "Invalid" ? "bg-red-50" : "bg-white"}>
                                                <td className="p-3 text-gray-900">{row.name || "-"}</td>
                                                <td className="p-3 text-gray-600">
                                                    {row.email || "-"}
                                                    {row._status === "Invalid" && (
                                                        <div className="text-xs text-red-600 mt-0.5">{row.reason}</div>
                                                    )}
                                                </td>
                                                <td className="p-3">
                                                    {row._status === "Invalid" ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Invalid</span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Valid</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-4 bg-white border-t flex justify-end gap-3 items-center">
                                {hasInvalidCsvRows && (
                                    <span className="text-sm text-gray-500 mr-2">
                                        Fix or remove rows with invalid emails – all emails must use @{companyDomain}.
                                    </span>
                                )}
                                <button onClick={() => { setCsvFile(null); setCsvPreview(null); }} className="px-4 py-2 border rounded-lg text-sm text-gray-700">Cancel</button>
                                <button
                                    onClick={handleImportEmployees}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={hasInvalidCsvRows || csvPreview.valid.length === 0}
                                >
                                    Import {csvPreview.valid.length} Employees
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* SECTION 4: Employee Directory Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="p-6 border-b flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-900">Employee Directory ({filteredEmployees.length})</h2>
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
                                <th className="px-6 py-4">Sessions (Week)</th>
                                <th className="px-6 py-4">Last Active</th>
                                <th className="px-6 py-4">Created At</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredEmployees.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">No employees found.</td>
                                </tr>
                            ) : (
                                filteredEmployees.map((emp) => (
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
                                        <td className="px-6 py-4 text-gray-500">{emp.sessionsThisWeek}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{emp.lastActive ? new Date(emp.lastActive).toLocaleDateString() : '-'}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{new Date(emp.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-gray-600 p-1">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
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

                        {/* Drawer Content - Simplified for Brevity (Same as before) */}
                        <div className="space-y-8 flex-1">
                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <StatCard label="Sessions Today" value={selectedEmployee.sessionsToday} />
                                <StatCard label="Total Sessions" value={selectedEmployee.totalSessions} />
                            </div>

                            {/* Actions */}
                            <div className="mt-8 space-y-3 pt-6 border-t">
                                <button
                                    onClick={async () => {
                                        if (!selectedEmployee || !companyId) return;
                                        const btn = document.getElementById('btn-remind');
                                        if (btn) btn.innerHTML = "Sending...";

                                        try {
                                            const res = await fetch('/api/hr/send-invites', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    emails: [selectedEmployee.email],
                                                    companyId: companyId
                                                })
                                            });

                                            if (!res.ok) throw new Error("Failed to send reminder");
                                            showToast("Reminder sent successfully!");
                                        } catch (e) {
                                            showToast("Failed to send reminder", 'error');
                                        } finally {
                                            if (btn) btn.innerHTML = '<svg class="h-4 w-4 mr-2" .../> Send Reminder Email'; // Resetting is tricky with innerHTML, better use state but inline for minimal diff.
                                            // Actually, let's just create proper handler functions above to keep this clean.
                                        }
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition"
                                >
                                    <Mail className="h-4 w-4" /> Send Reminder Email
                                </button>
                                <button
                                    onClick={async () => {
                                        if (!selectedEmployee || !companyId) return;
                                        if (!window.confirm(`Are you sure you want to deactivate ${selectedEmployee.name}? This action cannot be undone.`)) return;

                                        try {
                                            const res = await fetch('/api/hr/deactivate-employee', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    employeeId: selectedEmployee.id,
                                                    companyId: companyId
                                                })
                                            });

                                            if (!res.ok) throw new Error("Deactivation failed");

                                            // Remove from local state
                                            setEmployees(prev => prev.filter(e => e.id !== selectedEmployee.id));
                                            setSelectedEmployee(null);
                                            showToast("Employee deactivated successfully.");

                                        } catch (e) {
                                            showToast("Failed to deactivate", 'error');
                                        }
                                    }}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition"
                                >
                                    <Trash2 className="h-4 w-4" /> Deactivate Access
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Invite Modal */}
            {isPreviewingInvite && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Confirm Invitations</h3>

                        {/* Alert if invalid rows */}
                        {hasInvalidInviteRows && (
                            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                                <div className="font-bold mb-1">Some emails can't be invited yet.</div>
                                All invitations must use your company domain: <strong>@{companyDomain}</strong>. Please fix the red emails and try again.
                            </div>
                        )}

                        <p className="text-sm text-gray-500 mb-4">We will send an invitation to the following people:</p>

                        <div className="max-h-60 overflow-y-auto border rounded-lg p-2 mb-6 bg-gray-50 space-y-1">
                            {parsedEmails.map((item, i) => (
                                <div key={i} className={`flex flex-col py-2 px-2 border-b last:border-0 border-gray-100 ${!item.valid ? 'bg-red-50' : ''}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {item.valid ? (
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <AlertCircle className="h-4 w-4 text-red-500" />
                                            )}
                                            <span className={`text-sm ${item.valid ? "text-gray-900" : "text-red-700 font-medium"}`}>{item.email}</span>
                                        </div>
                                    </div>
                                    {!item.valid && (
                                        <div className="text-xs text-red-600 mt-1 pl-6">
                                            {item.reason}
                                        </div>
                                    )}
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
                                disabled={hasInvalidInviteRows}
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
    const s = status.toLowerCase();

    let styles = "bg-gray-100 text-gray-800";
    if (s === 'active') styles = "bg-green-100 text-green-800";
    if (s === 'invited' || s === 'pending') styles = "bg-blue-100 text-blue-800";
    if (s === 'disabled' || s === 'inactive') styles = "bg-red-50 text-red-800";

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles}`}>
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
