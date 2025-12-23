import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Play, LogOut, Clock, Calendar, CheckCircle, Save, Lock, AlertTriangle, Flame, Activity } from 'lucide-react';

export default function PersonalHome({ onStartBreak, user }: { onStartBreak: () => void, user: any }) {
    // Current active settings (truth)
    const [settings, setSettings] = useState({
        work_interval_minutes: 30,
        start_hour: 9,
        end_hour: 17,
        work_days: [1, 2, 3, 4, 5]
    });

    // Draft settings for form inputs (manual save)
    const [draftSettings, setDraftSettings] = useState(settings);
    const [isSaved, setIsSaved] = useState(false);

    const [stats, setStats] = useState({ total_sessions: 0, total_seconds: 0, history: [] as string[] });
    const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

    // Sync draft with real settings on load
    useEffect(() => {
        setDraftSettings(settings);
    }, [settings]);

    // Helper: Calculate Streak (Improved Logic)
    const calculateStreak = (history: string[]) => {
        if (!history || history.length === 0) return 0;

        const dates = history.map(d => new Date(d).toDateString());
        const uniqueDates = [...new Set(dates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

        if (uniqueDates.length === 0) return 0;

        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        // Streak is active if last break was today or yesterday
        if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
            return 0;
        }

        let streak = 1;
        let currentDate = new Date(uniqueDates[0]);

        for (let i = 1; i < uniqueDates.length; i++) {
            const prevDate = new Date(uniqueDates[i]);
            const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                streak++;
                currentDate = prevDate;
            } else {
                break;
            }
        }
        return streak;
    };

    const getTodayBreaks = (history: string[]) => {
        if (!history) return 0;
        const today = new Date().toDateString();
        return history.filter(d => new Date(d).toDateString() === today).length;
    };

    // Load Data
    useEffect(() => {
        // supabase.auth.getUser() handled by parent

        chrome.storage.local.get(['settings', 'stats', 'installDate'], (res) => {
            if (res.settings) {
                setSettings(res.settings as any);
                setDraftSettings(res.settings as any); // Initialize draft
            }
            if (res.stats) setStats(res.stats as any);

            if (res.installDate) {
                const now = Date.now();
                const diff = now - (res.installDate as number);
                const daysUsed = diff / (1000 * 60 * 60 * 24);
                setDaysRemaining(Math.max(0, Math.ceil(14 - daysUsed)));
            } else {
                setDaysRemaining(14);
            }
        });

        const listener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
            if (areaName === 'local') {
                if (changes.stats?.newValue) setStats(changes.stats.newValue as any);
                if (changes.settings?.newValue) {
                    setSettings(changes.settings.newValue as any);
                    // Do NOT auto-update draft from background changes to avoid overwriting user edits in progress
                }
            }
        };
        chrome.storage.onChanged.addListener(listener);
        return () => chrome.storage.onChanged.removeListener(listener);
    }, []);

    // Manual Save Function
    const saveSettings = () => {
        setSettings(draftSettings);
        chrome.storage.local.set({ settings: draftSettings });
        chrome.runtime.sendMessage({ action: 'UPDATE_ALARMS', settings: draftSettings });

        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const updateDraft = (key: string, value: any) => {
        setDraftSettings(prev => ({ ...prev, [key]: value }));
        setIsSaved(false);
    };

    const toggleDay = (dayIndex: number) => {
        const currentDays = draftSettings.work_days || [];
        const newDays = currentDays.includes(dayIndex)
            ? currentDays.filter((d: number) => d !== dayIndex)
            : [...currentDays, dayIndex].sort();
        updateDraft('work_days', newDays);
    };



    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const isTrialExpired = daysRemaining !== null && daysRemaining <= 0;
    const isPro = false;
    const isLocked = isTrialExpired && !isPro;

    return (
        <div className="h-full bg-gray-50 flex flex-col relative overflow-hidden text-gray-800 font-sans">
            {/* Header */}
            <div className="relative z-10 flex justify-between items-center p-6 pb-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                        <span className="font-bold">M</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight leading-none">My Health</h1>
                        {daysRemaining !== null && !isLocked && (
                            <span className="text-[10px] font-medium bg-white/20 px-1.5 py-0.5 rounded text-white/90">
                                {daysRemaining} Days Left
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={handleLogout} className="p-2 hover:bg-white/20 rounded-full transition-all text-white/90 hover:text-white" title="Log Out">
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 pb-20">

                {/* Trial Expired Alert */}
                {isLocked && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-red-700 font-bold">
                            <AlertTriangle size={18} />
                            <span>Trial Expired</span>
                        </div>
                        <p className="text-xs text-red-600 leading-relaxed">
                            Your 14-day free trial has ended. To continue using MicroBreaks, please upgrade to the Lifetime plan.
                        </p>
                    </div>
                )}

                {/* Start Button */}
                <button
                    onClick={isLocked ? undefined : onStartBreak}
                    disabled={isLocked}
                    className={`w-full group relative overflow-hidden text-white shadow-lg py-4 rounded-2xl font-bold transition transform flex items-center justify-center gap-2 
                    ${isLocked
                            ? 'bg-gray-400 cursor-not-allowed grayscale'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/20 active:scale-[0.98] cursor-pointer'}`}
                >
                    {isLocked ? <Lock className="h-5 w-5" /> : <Play className="h-5 w-5 fill-white" />}
                    <span>{isLocked ? 'Unlock to Start' : 'Start Micro-break'}</span>
                </button>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1 flex items-center justify-center gap-1">
                            <Activity size={12} /> Today's Breaks
                        </p>
                        <div className="text-2xl font-black text-gray-800">{getTodayBreaks(stats.history)}</div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1 flex items-center justify-center gap-1">
                            <Flame size={12} className="text-orange-500" /> Current Streak
                        </p>
                        <div className="text-2xl font-black text-gray-800">{calculateStreak(stats.history)} <span className="text-xs font-medium text-gray-400">days</span></div>
                    </div>
                </div>

                {/* Schedule Card (Manual Save) */}
                <div className={`bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transition-opacity ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}>
                    <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar size={16} /> Schedule
                    </h3>

                    {/* Days */}
                    <div className="flex justify-between mb-4">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                            <button
                                key={idx}
                                onClick={() => toggleDay(idx)}
                                className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${draftSettings.work_days?.includes(idx)
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                    }`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>

                    {/* Hours */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Start</label>
                            <select
                                value={draftSettings.start_hour}
                                onChange={(e) => updateDraft('start_hour', parseInt(e.target.value))}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg text-sm px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {Array.from({ length: 24 }).map((_, i) => (
                                    <option key={i} value={i}>{i}:00</option>
                                ))}
                            </select>
                        </div>
                        <div className="text-gray-300">-</div>
                        <div className="flex-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">End</label>
                            <select
                                value={draftSettings.end_hour}
                                onChange={(e) => updateDraft('end_hour', parseInt(e.target.value))}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg text-sm px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {Array.from({ length: 24 }).map((_, i) => (
                                    <option key={i} value={i}>{i}:00</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Clock size={16} /> Frequency
                    </h3>
                    <div className="flex justify-between gap-2 mb-4">
                        {[15, 30, 45, 60].map((m) => (
                            <button
                                key={m}
                                onClick={() => updateDraft('work_interval_minutes', m)}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${draftSettings.work_interval_minutes === m
                                    ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500 ring-offset-1'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {m}m
                            </button>
                        ))}
                    </div>

                    {/* NEW: Save Button for Frequency */}
                    <button
                        onClick={saveSettings}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${isSaved
                            ? 'bg-green-100 text-green-700 ring-2 ring-green-500/20'
                            : 'bg-slate-800 text-white hover:bg-slate-900 shadow-lg shadow-slate-500/20 active:scale-[0.98]'
                            }`}
                    >
                        {isSaved ? <CheckCircle size={14} /> : <Save size={14} />}
                        {isSaved ? 'Schedule Saved!' : 'Save Schedule'}
                    </button>
                </div>

                {/* Paywall / Upgrade */}
                <div className={`bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100 p-5 rounded-2xl ${isLocked ? 'ring-2 ring-orange-400 shadow-xl' : ''}`}>
                    <h4 className="text-base font-bold text-orange-900 mb-1">
                        {isLocked ? 'Unlock Lifetime Access' : 'Full Access (Lifetime)'}
                    </h4>
                    <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-2xl font-black text-orange-600">$49</span>
                        <span className="text-xs text-orange-700/70 font-medium">/ once</span>
                    </div>
                    <ul className="space-y-1 mb-4">
                        {['Unlimited Breaks', 'Advanced Scheduler', 'Cloud Sync'].map(feat => (
                            <li key={feat} className="flex items-center gap-1.5 text-xs text-orange-800/80 font-medium">
                                <CheckCircle size={10} className="text-orange-500" /> {feat}
                            </li>
                        ))}
                    </ul>
                    <a
                        href="https://www.micro-breaks.com/individual"
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-all text-center shadow-lg shadow-orange-500/20"
                    >
                        Get Lifetime Access
                    </a>
                </div>

            </div>
        </div>
    );
}
