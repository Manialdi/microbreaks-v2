import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Play, LogOut, Clock, Calendar, CheckCircle, Save, Flame, Activity, HelpCircle } from 'lucide-react';

export default function Dashboard({ onStartBreak }: { onStartBreak: () => void }) {
    const [user, setUser] = useState<any>(null);
    const [settings, setSettings] = useState({
        work_interval_minutes: 60,
        break_duration_minutes: 2,
        start_hour: 9,
        end_hour: 17,
        work_days: [1, 2, 3, 4, 5],
        user_override: false
    });

    // Draft settings for form inputs
    const [draftSettings, setDraftSettings] = useState(settings);
    const [isSaved, setIsSaved] = useState(false);

    // Stats State
    const [stats, setStats] = useState({ current: 0, streak: 0 });

    const SLOGANS = [
        "Recharge, Refresh, Refocus.",
        "Your well-being comes first.",
        "Wellness built into your workflow.",
        "Small breaks, big impact.",
        "Invest in yourself, one break at a time.",
        "Stay active, stay inspired.",
        "Because your health matters."
    ];
    const [slogan] = useState(() => SLOGANS[Math.floor(Math.random() * SLOGANS.length)]);

    // 1. Initialize User & Stats
    useEffect(() => {
        const initUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                // Trigger Sync on Mount (Force check for new user/company defaults)
                chrome.runtime.sendMessage({ action: 'SYNC_SETTINGS' });

                // Fetch Employee ID & Stats
                const { data: emp } = await supabase
                    .from('employees')
                    .select('id')
                    .eq('auth_user_id', user.id)
                    .single();

                if (emp) {
                    fetchStats(emp.id);
                }
            }
        };
        initUser();

        // Load Settings from Storage
        chrome.storage.local.get(['settings'], (res) => {
            if (res.settings) {
                const saved = res.settings as any;
                const merged = { ...settings, ...saved };
                if (!merged.break_duration_minutes) merged.break_duration_minutes = 2;

                // Ensure work_days are numbers
                if (merged.work_days && Array.isArray(merged.work_days)) {
                    merged.work_days = merged.work_days.map((d: any) => Number(d));
                }

                // Enforce default M-F if invalid/empty
                if (!merged.work_days || merged.work_days.length === 0) {
                    merged.work_days = [1, 2, 3, 4, 5];
                }
                setSettings(merged);
                setDraftSettings(merged);
            }
        });

        // Listen for Settings Changes
        const listener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
            if (areaName === 'local' && changes.settings?.newValue) {
                setSettings(changes.settings.newValue as any);
                setDraftSettings(changes.settings.newValue as any);
            }
        };
        chrome.storage.onChanged.addListener(listener);
        return () => chrome.storage.onChanged.removeListener(listener);
    }, []);

    // 2. Fetch Stats Logic
    const fetchStats = async (empId: string) => {
        try {
            const { data: logs } = await supabase
                .from('break_logs')
                .select('completed_at')
                .eq('employee_id', empId)
                .order('completed_at', { ascending: false });

            if (!logs) return;

            // Sessions Today
            const todayStr = new Date().toISOString().split('T')[0];
            const todayCount = logs.filter(l => l.completed_at.startsWith(todayStr)).length;

            // Streak Calculation
            const dates = new Set(logs.map(l => l.completed_at.split('T')[0]));
            const uniqueDates = [...dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

            let streak = 0;
            if (uniqueDates.length > 0) {
                const today = new Date().toDateString();
                const yesterday = new Date(Date.now() - 86400000).toDateString();
                const lastDate = new Date(uniqueDates[0]).toDateString();

                // If last break was today or yesterday, streak is alive
                if (lastDate === today || lastDate === yesterday) {
                    streak = 1;
                    let currentDate = new Date(uniqueDates[0]);
                    for (let i = 1; i < uniqueDates.length; i++) {
                        const prevDate = new Date(uniqueDates[i]);
                        const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
                        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                        if (diffDays === 1) {
                            streak++;
                            currentDate = prevDate;
                        } else break;
                    }
                }
            }

            setStats({ current: todayCount, streak });
        } catch (e) {
            console.error("Failed to fetch stats", e);
        }
    };

    // 3. UI Helpers
    const updateDraft = (key: string, value: any) => {
        // If user manually changes something, mark as override
        setDraftSettings(prev => ({ ...prev, [key]: value, user_override: true }));
        setIsSaved(false);
    };

    const toggleDay = (dayIndex: number) => {
        const currentDays = draftSettings.work_days || [];
        const newDays = currentDays.includes(dayIndex)
            ? currentDays.filter((d: number) => d !== dayIndex)
            : [...currentDays, dayIndex].sort();
        updateDraft('work_days', newDays);
    };

    const saveSettings = () => {
        // Respect the current override state (false if they just clicked 'Use Company Settings')
        const newSettings = {
            ...draftSettings,
            userId: user?.id,
            // If they clicked "Use Company Settings" (false), it stays false.
            // If they edited something (true), it stays true.
            user_override: draftSettings.user_override
        };

        setSettings(newSettings);
        chrome.storage.local.set({ settings: newSettings });
        chrome.runtime.sendMessage({ action: 'UPDATE_ALARMS', settings: newSettings });

        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        // Force reload usually handled by parent listening to auth state
    };

    return (
        <div className="h-full bg-gray-50 flex flex-col relative overflow-hidden text-gray-800 font-sans">
            {/* Header */}
            <div className="relative z-10 flex justify-between items-center p-6 pb-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center overflow-hidden">
                        {/* Use simple text or generic icon if assets missing */}
                        <span className="font-bold text-lg">M</span>
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                        <h1 className="text-lg font-bold tracking-tight leading-none">
                            Dashboard - {user?.email ? (user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1)) : 'User'}
                        </h1>
                        <span className="text-[10px] font-medium bg-white/20 px-1.5 py-0.5 rounded text-white/90 w-fit">
                            Company Plan
                        </span>
                        <p className="text-[10px] text-blue-100 italic opacity-80 leading-none">"{slogan}"</p>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <button onClick={handleLogout} className="flex items-center gap-1.5 p-1 hover:bg-white/10 rounded-lg transition-all text-white/90 hover:text-white group" title="Log Out">
                        <span className="text-[10px] text-blue-100 italic opacity-80 group-hover:opacity-100 transition-opacity">Logout</span>
                        <LogOut className="h-3.5 w-3.5" />
                    </button>

                    <a
                        href="https://youtu.be/47vmfKzNEGI"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] text-blue-100 hover:text-white transition-colors opacity-80 hover:opacity-100 pr-1 py-0.5"
                    >
                        <Play size={10} className="fill-current" />
                        Watch Guide
                    </a>

                    <a
                        href="#"
                        className="flex items-center gap-1 text-[10px] text-blue-100 hover:text-white transition-colors opacity-80 hover:opacity-100 pr-1 py-0.5"
                    >
                        <HelpCircle size={12} />
                        Help
                    </a>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-20 scrollbar-hide">

                {/* Start Button */}
                <button
                    onClick={onStartBreak}
                    className="w-full group relative overflow-hidden text-white shadow-lg py-4 rounded-2xl font-bold transition transform flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-blue-500/20 active:scale-[0.98] cursor-pointer"
                >
                    <Play className="h-5 w-5 fill-white" />
                    <span>Start Micro-break</span>
                </button>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 flex items-center justify-center gap-1">
                            <Activity size={10} /> Today's Breaks
                        </p>
                        <div className="text-base font-black text-gray-800">{stats.current}</div>
                        <p className="text-[9px] text-gray-400 mt-0.5 font-medium">Keep moving!</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-gray-100 text-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1 flex items-center justify-center gap-1">
                            <Flame size={10} className="text-orange-500" /> Streak
                        </p>
                        <div className="text-base font-black text-gray-800">{stats.streak} <span className="text-[9px] font-medium text-gray-400">days</span></div>
                        <p className="text-[9px] text-gray-400 mt-0.5 font-medium">Consistency matters</p>
                    </div>
                </div>

                {/* HR Settings Card */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                            <Calendar size={14} /> Customize Schedule
                        </h3>

                        <button
                            onClick={() => {
                                // If currently overriding (no green dot), revert to company defaults
                                if (draftSettings.user_override) {
                                    // 1. Mark as NOT overriding
                                    const newSettings = { ...draftSettings, user_override: false };

                                    // 2. Save this state so Background knows we want defaults
                                    chrome.storage.local.set({ settings: newSettings });

                                    // 3. Trigger sync - Background will see override:false and fetch Company Settings
                                    // The storage listener will then update our UI with those new values
                                    chrome.runtime.sendMessage({ action: 'SYNC_SETTINGS' });
                                }
                            }}
                            className="flex items-center gap-1.5 cursor-pointer group"
                            title={draftSettings.user_override ? "Click to use Company Settings" : "Using Company Settings"}
                        >
                            <span className="text-[9px] font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                                Use Company Settings
                            </span>
                            <div className={`w-2.5 h-2.5 rounded-full border transition-all ${!draftSettings.user_override
                                ? 'bg-green-500 border-green-500 shadow-[0_0_4px_rgba(34,197,94,0.4)]'
                                : 'bg-transparent border-gray-300 group-hover:border-green-400'
                                }`} />
                        </button>
                    </div>

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
                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Start</label>
                            <select
                                value={draftSettings.start_hour}
                                onChange={(e) => updateDraft('start_hour', parseInt(e.target.value))}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {Array.from({ length: 24 }).map((_, i) => (
                                    <option key={i} value={i}>{i}:00</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <h3 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Clock size={14} /> Micro-Break Duration
                    </h3>
                    <div className="flex justify-between gap-2 mb-3">
                        {[2, 5].map((m) => (
                            <button
                                key={m}
                                onClick={() => updateDraft('break_duration_minutes', m)}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${draftSettings.break_duration_minutes === m
                                    ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-500 shadow-sm'
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {m} mins
                                {draftSettings.break_duration_minutes === m && (
                                    <CheckCircle size={14} className="text-emerald-500" />
                                )}
                            </button>
                        ))}
                    </div>

                    <h3 className="text-xs font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <Clock size={14} /> Frequency (mins)
                    </h3>
                    <div className="mb-3">
                        <input
                            type="range"
                            min="0"
                            max="5"
                            step="1"
                            value={[15, 30, 45, 60, 90, 120].indexOf(draftSettings.work_interval_minutes) !== -1
                                ? [15, 30, 45, 60, 90, 120].indexOf(draftSettings.work_interval_minutes)
                                : 3}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                const options = [15, 30, 45, 60, 90, 120];
                                updateDraft('work_interval_minutes', options[val]);
                            }}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase mt-2 px-1">
                            <span>15</span>
                            <span>30</span>
                            <span>45</span>
                            <span>60</span>
                            <span>90</span>
                            <span>120</span>
                        </div>
                    </div>

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

            </div>
        </div >
    );
}
