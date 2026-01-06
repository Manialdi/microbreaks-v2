"use client";

import { useState, useEffect } from "react";
import { Upload, X, Save, Clock, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
    // 1. Reminder Settings
    const [workInterval, setWorkInterval] = useState(60);
    const [breakDuration, setBreakDuration] = useState(2);
    const [startHour, setStartHour] = useState(9);
    const [endHour, setEndHour] = useState(17);
    const [workDays, setWorkDays] = useState<number[]>([1, 2, 3, 4, 5]);

    // 2. Company Settings
    const [companyName, setCompanyName] = useState("");
    const [logo, setLogo] = useState<File | null>(null);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [industry, setIndustry] = useState("");

    // 3. HR Profile Settings
    const [hrName, setHrName] = useState("");
    const [hrEmail, setHrEmail] = useState("");
    const [timezone, setTimezone] = useState("UTC");
    const [weeklyDigest, setWeeklyDigest] = useState(true);

    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const supabase = createClient();

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Load Data
    useEffect(() => {
        async function loadSettings() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch Profile & Company
            const { data: profile } = await supabase.from('profiles').select('*, companies(*)').eq('id', user.id).single();
            if (profile) {
                setHrName(profile.full_name || "");
                setHrEmail(user.email || "");
                setWeeklyDigest(profile.weekly_digest_enabled || false);

                if (profile.companies) {
                    const company = Array.isArray(profile.companies) ? profile.companies[0] : profile.companies;
                    setCompanyName(company.name);
                    setIndustry(company.industry || "");
                    setLogoUrl(company.logo_url);

                    // Fetch Company Settings
                    const { data: settings } = await supabase
                        .from('company_settings')
                        .select('*')
                        .eq('company_id', company.id)
                        .single();

                    if (settings) {
                        setWorkInterval(settings.work_interval_minutes || 60);
                        setBreakDuration(settings.break_duration_minutes || 2);
                        setStartHour(settings.start_hour ?? 9);
                        setEndHour(settings.end_hour ?? 17);
                        if (settings.work_days && settings.work_days.length > 0) {
                            setWorkDays(settings.work_days);
                        }
                    }
                }
            }

            setLoading(false);
        }
        loadSettings();
    }, []);


    // --- Handlers ---

    const handleSaveReminder = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
        if (!profile?.company_id) return showToast("No company found", 'error');

        // Upsert Settings
        const { error } = await supabase
            .from('company_settings')
            .upsert({
                company_id: profile.company_id,
                work_interval_minutes: workInterval,
                break_duration_minutes: breakDuration,
                start_hour: startHour,
                end_hour: endHour,
                work_days: workDays
            });

        if (error) {
            console.error(error);
            showToast("Failed to save settings", 'error');
        } else {
            showToast("Reminder preferences updated. Employees will sync on next restart.");
        }
    };

    const handleSaveCompany = async () => {
        if (!companyName) return showToast("Company name is required", 'error');

        const { data: { user } } = await supabase.auth.getUser();
        const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user?.id).single();

        if (profile?.company_id) {
            const { error } = await supabase
                .from('companies')
                .update({ name: companyName, industry })
                .eq('id', profile.company_id);

            if (error) showToast("Failed to update company settings", 'error');
            else showToast("Company settings updated successfully.");
        }
    };

    const handleSaveProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('profiles')
            .update({ full_name: hrName, weekly_digest_enabled: weeklyDigest })
            .eq('id', user.id);

        if (error) showToast("Failed to update profile", 'error');
        else showToast("Profile updated successfully.");
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 relative pb-20">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium z-50 animate-fade-in-up ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your company preferences, reminder settings, and profile.</p>
            </div>

            {/* SECTION 1: Reminder Settings (Top Priority) */}
            <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col gap-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Reminder Settings</h2>
                    <p className="text-sm text-gray-500 mb-4 border-b pb-2"> These defaults will apply to all employees unless they override them.</p>

                    <div className="space-y-6 max-w-lg">

                        {/* 1. Work Days */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-2">Work Days</label>
                            <div className="flex gap-2">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            const newDays = workDays.includes(idx)
                                                ? workDays.filter(d => d !== idx)
                                                : [...workDays, idx].sort();
                                            setWorkDays(newDays);
                                        }}
                                        className={`w-10 h-10 rounded-full text-sm font-bold transition-colors ${workDays.includes(idx)
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Work Hours */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-2 flex items-center gap-2"><Clock className="h-4 w-4 text-gray-400" /> Workday Start</label>
                                <select
                                    value={startHour}
                                    onChange={(e) => setStartHour(parseInt(e.target.value))}
                                    className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                >
                                    {Array.from({ length: 24 }).map((_, i) => (
                                        <option key={i} value={i}>{i}:00</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-2 flex items-center gap-2"><Clock className="h-4 w-4 text-gray-400" /> Workday End</label>
                                <select
                                    value={endHour}
                                    onChange={(e) => setEndHour(parseInt(e.target.value))}
                                    className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                >
                                    {Array.from({ length: 24 }).map((_, i) => (
                                        <option key={i} value={i}>{i}:00</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* 3. Duration */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-2">Micro-Break Duration</label>
                            <div className="flex gap-3">
                                {[2, 5].map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => setBreakDuration(m)}
                                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all border flex items-center justify-center gap-2 ${breakDuration === m
                                            ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-500'
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {m} mins
                                        {breakDuration === m && (
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 4. Frequency */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-2">Frequency (mins)</label>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <input
                                    type="range"
                                    min="0"
                                    max="5"
                                    step="1"
                                    value={[15, 30, 45, 60, 90, 120].indexOf(workInterval) !== -1
                                        ? [15, 30, 45, 60, 90, 120].indexOf(workInterval)
                                        : 3}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        const options = [15, 30, 45, 60, 90, 120];
                                        setWorkInterval(options[val]);
                                    }}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between text-xs text-gray-500 font-bold uppercase mt-3 px-1">
                                    <span>15</span>
                                    <span>30</span>
                                    <span>45</span>
                                    <span>60</span>
                                    <span>90</span>
                                    <span>120</span>
                                </div>
                            </div>
                            <p className="text-xs text-center mt-2 text-gray-500">Break every <span className="font-bold text-gray-900">{workInterval} minutes</span></p>
                        </div>

                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <button
                        onClick={handleSaveReminder}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" /> Save Reminder Defaults
                    </button>
                </div>
            </div>

            {/* SECTION 2: Company Settings */}
            <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col gap-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Company Settings</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* A. Company Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Company Name</label>
                            <input
                                type="text"
                                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Acme Corporation"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>

                        {/* C. Industry */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Industry <span className="text-gray-400 font-normal">(Optional)</span></label>
                            <select
                                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                            >
                                <option value="">Select Industry</option>
                                <option value="Technology">Technology</option>
                                <option value="Finance">Finance</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Manufacturing">Manufacturing</option>
                                <option value="Retail">Retail</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* B. Company Logo */}
                    <div className="mt-6 space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-baseline gap-2">
                            Company Logo <span className="text-xs text-gray-500 italic font-normal">This logo will appear on the Chrome extension.</span>
                        </label>
                        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition relative">
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/svg+xml"
                                onChange={(e) => setLogo(e.target.files?.[0] || null)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {logo || logoUrl ? (
                                <div className="relative">
                                    <img src={logo ? URL.createObjectURL(logo) : logoUrl!} alt="Preview" className="h-16 w-auto object-contain mb-2" />
                                    <p className="text-sm text-gray-900 font-medium">{logo?.name || "Current Logo"}</p>
                                    <button
                                        onClick={(e) => { e.preventDefault(); setLogo(null); setLogoUrl(null); }}
                                        className="text-xs text-red-600 hover:underline mt-1 relative z-10"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                    <p className="text-sm font-medium text-gray-900">Upload Logo</p>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG up to 2MB</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <button
                        onClick={handleSaveCompany}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" /> Save Company Settings
                    </button>
                </div>
            </div>

            {/* SECTION 3: HR Profile Settings */}
            <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col gap-6">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">HR Profile Settings</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* A. Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Your Name</label>
                            <input
                                type="text"
                                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="John Doe"
                                value={hrName}
                                onChange={(e) => setHrName(e.target.value)}
                            />
                        </div>

                        {/* B. Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Email</label>
                            <input
                                type="email"
                                disabled
                                className="w-full border p-3 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                                value={hrEmail}
                            />
                            <p className="text-xs text-gray-500">Email cannot be changed. Contact support to request an update.</p>
                        </div>

                        {/* C. Timezone */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Timezone</label>
                            <select
                                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={timezone}
                                onChange={(e) => setTimezone(e.target.value)}
                            >
                                <option value="UTC">UTC (Coordinated Universal Time)</option>
                                <option value="EST">EST (Eastern Standard Time)</option>
                                <option value="PST">PST (Pacific Standard Time)</option>
                                <option value="CST">CST (Central Standard Time)</option>
                                <option value="IST">IST (India Standard Time)</option>
                                <option value="CET">CET (Central European Time)</option>
                            </select>
                        </div>
                    </div>

                    {/* D. Notification Preferences */}
                    <div className="mt-6 pt-4 border-t">
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="digest"
                                checked={weeklyDigest}
                                onChange={(e) => setWeeklyDigest(e.target.checked)}
                                className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <div>
                                <label htmlFor="digest" className="text-sm font-medium text-gray-900 block">Receive weekly engagement digest</label>
                                <p className="text-xs text-gray-500">A summary of company activity delivered every Monday.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <button
                        onClick={handleSaveProfile}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" /> Save Profile Settings
                    </button>
                </div>
            </div>

        </div>
    );
}
