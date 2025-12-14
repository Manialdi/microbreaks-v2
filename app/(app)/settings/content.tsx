"use client";

import { useState, useEffect } from "react";
import { Upload, X, Save, Clock, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
    // 1. Reminder Settings
    const [breakFrequency, setBreakFrequency] = useState("60");
    const [workStart, setWorkStart] = useState("09:00");
    const [workEnd, setWorkEnd] = useState("18:00");
    const [rotationType, setRotationType] = useState("random");
    const [fixedCategory, setFixedCategory] = useState("neck");
    const [pauseWeekends, setPauseWeekends] = useState(true);
    const [pauseHolidays, setPauseHolidays] = useState(true);

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
                setHrEmail(user.email || ""); // Read-only from auth
                setWeeklyDigest(profile.weekly_digest_enabled || false);
                // Timezone could be added to profile in future schema

                if (profile.companies) {
                    setCompanyName(profile.companies.name);
                    setIndustry(profile.companies.industry || "");
                    setLogoUrl(profile.companies.logo_url);
                }
            }

            setLoading(false);
        }
        loadSettings();
    }, []);


    // --- Handlers ---

    const handleSaveReminder = async () => {
        // Logic to save to `reminder_settings` table (needs to be created in DB)
        // For now just toast
        showToast("Reminder preferences updated.");
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
                    <p className="text-sm text-gray-500 mb-4 border-b pb-2">These defaults will apply to all employees unless they override them.</p>

                    <div className="space-y-6">
                        {/* A. Frequency */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Default Break Frequency</label>
                            <select
                                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white max-w-sm"
                                value={breakFrequency}
                                onChange={(e) => setBreakFrequency(e.target.value)}
                            >
                                <option value="30">Every 30 minutes</option>
                                <option value="45">Every 45 minutes</option>
                                <option value="60">Every 60 minutes</option>
                            </select>
                        </div>

                        {/* B. Workday */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-400" /> Workday Start
                                </label>
                                <input
                                    type="time"
                                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={workStart}
                                    onChange={(e) => setWorkStart(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-400" /> Workday End
                                </label>
                                <input
                                    type="time"
                                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={workEnd}
                                    onChange={(e) => setWorkEnd(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* C. Rotation */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 block">Exercise Category Rotation</label>
                            <div className="flex flex-col sm:flex-row gap-4 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="rotation"
                                        value="random"
                                        checked={rotationType === 'random'}
                                        onChange={() => setRotationType('random')}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-900">Randomized (Default)</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="rotation"
                                        value="fixed"
                                        checked={rotationType === 'fixed'}
                                        onChange={() => setRotationType('fixed')}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-900">Fixed Category</span>
                                </label>
                            </div>

                            {rotationType === 'fixed' && (
                                <select
                                    className="mt-2 w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white max-w-sm animate-fade-in"
                                    value={fixedCategory}
                                    onChange={(e) => setFixedCategory(e.target.value)}
                                >
                                    <option value="neck">Neck mobility</option>
                                    <option value="wrist">Wrist mobility</option>
                                    <option value="eye">Eye relaxation</option>
                                    <option value="posture">Posture</option>
                                    <option value="breathing">Breathing</option>
                                </select>
                            )}
                        </div>

                        {/* D. Auto-Pausing */}
                        <div className="space-y-4 pt-2">
                            <label className="text-sm font-semibold text-gray-700 block">Auto-Pausing Options</label>

                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="weekends"
                                    checked={pauseWeekends}
                                    onChange={(e) => setPauseWeekends(e.target.checked)}
                                    className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <div>
                                    <label htmlFor="weekends" className="text-sm font-medium text-gray-900 block">Auto-pause on weekends</label>
                                    <p className="text-xs text-gray-500">No reminders on Saturday and Sunday.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    id="holidays"
                                    checked={pauseHolidays}
                                    onChange={(e) => setPauseHolidays(e.target.checked)}
                                    className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <div>
                                    <label htmlFor="holidays" className="text-sm font-medium text-gray-900 block">Auto-pause on public holidays</label>
                                    <button className="text-xs text-blue-600 hover:underline mt-0.5 flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> Manage holiday calendar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <button
                        onClick={handleSaveReminder}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" /> Save Reminder Settings
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
