import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Flame, Play, LogOut, Clock, Calendar, Moon, Sun } from 'lucide-react';

// Helper: 18:00:00 -> 6:00 PM
const formatTime = (timeStr: string) => {
    if (!timeStr) return '--:--';
    const [h, m] = timeStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hours = h % 12 || 12;
    const minutes = m < 10 ? `0${m}` : m;
    return `${hours}:${minutes} ${period}`;
};

export default function Dashboard({ onStartBreak }: { onStartBreak: () => void }) {
    const [nextBreak, setNextBreak] = useState<number | string>('--');
    const [statusMessage, setStatusMessage] = useState('Next break in');
    const [frequency, setFrequency] = useState(60);
    const [workStart, setWorkStart] = useState('09:00:00');
    const [workEnd, setWorkEnd] = useState('17:00:00');
    const [stats, setStats] = useState({ goal: 8, current: 0, streak: 5 });
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        // 1. Fetch User
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) setUserEmail(data.user.email || '');
        });

        const updateStateFromSettings = (settings: any) => {
            if (!settings) return;

            // Map Integers (9, 17) to Strings ("09:00:00", "17:00:00")
            const sHour = settings.start_hour !== undefined ? settings.start_hour : 9;
            const eHour = settings.end_hour !== undefined ? settings.end_hour : 17;

            const newStart = `${sHour.toString().padStart(2, '0')}:00:00`;
            const newEnd = `${eHour.toString().padStart(2, '0')}:00:00`;

            setFrequency(settings.work_interval_minutes || 60);
            setWorkStart(newStart);
            setWorkEnd(newEnd);
            calculateGoal(newStart, newEnd, settings.work_interval_minutes);
        };

        // 2. Initial Read
        chrome.storage.local.get(['settings'], (res) => {
            if (res.settings) {
                updateStateFromSettings(res.settings);
            }
        });

        // 3. Update Listener
        const storageListener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
            if (areaName === 'local' && changes.settings?.newValue) {
                updateStateFromSettings(changes.settings.newValue);
            }
        };
        chrome.storage.onChanged.addListener(storageListener);

        return () => {
            chrome.storage.onChanged.removeListener(storageListener);
        };
    }, []);

    // 4. Timer Logic (Separate Effect to depend on workStart/End)
    useEffect(() => {
        const checkStatus = () => {
            const now = new Date();
            const currentMins = now.getHours() * 60 + now.getMinutes();

            // Parse Work Hours
            const [sh, sm] = workStart.split(':').map(Number);
            const [eh, em] = workEnd.split(':').map(Number);
            const startMins = sh * 60 + sm;
            const endMins = eh * 60 + em;

            const isOvernight = startMins > endMins;
            let isWorking = false;
            let isBeforeStart = false;
            let isAfterEnd = false;

            if (isOvernight) {
                // Overnight Shift (e.g. 18:00 to 02:00)
                // Working if: >= 18:00 OR < 02:00
                isWorking = currentMins >= startMins || currentMins < endMins;

                // Keep "Before Start" simple: if between end and start
                if (!isWorking) {
                    // Ideally check which one is closer, but simple logic:
                    setStatusMessage(`See you tomorrow! 🌙`);
                }
            } else {
                // Standard Day (e.g. 09:00 to 17:00)
                isWorking = currentMins >= startMins && currentMins < endMins;
                isBeforeStart = currentMins < startMins;
                isAfterEnd = currentMins >= endMins;
            }

            if (isWorking) {
                // During Work - Check Alarm
                setStatusMessage('Next break in');
                chrome.alarms.get('MICROBREAK_ALARM', (alarm) => {
                    if (alarm) {
                        // Check if alarm is strictly for today's session
                        // Complex for overnight: check if alarm > "end time relative to now"
                        // Simplified: Just show the countdown if it exists.
                        const diffMs = alarm.scheduledTime - Date.now();
                        const diffMins = Math.ceil(diffMs / 60000);
                        setNextBreak(diffMins > 0 ? diffMins : 0);
                    } else {
                        // Fallback
                        setNextBreak(frequency);
                    }
                });
            } else {
                // Not Working
                setNextBreak('--');
                if (isBeforeStart) {
                    setStatusMessage(`Starts at ${formatTime(workStart)} ☀️`);
                } else {
                    setStatusMessage('See you tomorrow! 🌙');
                }
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 30000); // Check every 30s
        return () => clearInterval(interval);

    }, [workStart, workEnd, frequency]);

    const calculateGoal = (start: string, end: string, freq: number) => {
        if (!start || !end || !freq) return;
        const [sh, sm] = start.split(':').map(Number);
        const [eh, em] = end.split(':').map(Number);
        const startMins = sh * 60 + sm;
        const endMins = eh * 60 + em;
        const durationMins = endMins - startMins;
        if (durationMins > 0) {
            setStats(prev => ({ ...prev, goal: Math.floor(durationMins / freq) }));
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className="h-full bg-gray-50 flex flex-col relative overflow-hidden text-gray-800 font-sans">
            {/* Header */}
            <div className="relative z-10 flex justify-between items-center p-6 pb-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                        <span className="font-bold">M</span>
                    </div>
                    <h1 className="text-lg font-bold tracking-tight">Microbreaks</h1>
                </div>
                <button onClick={handleLogout} className="p-2 hover:bg-white/20 rounded-full transition-all text-white/90 hover:text-white" title="Log Out">
                    <LogOut className="h-4 w-4" />
                </button>
            </div>

            <div className="relative z-0 flex-1 overflow-y-auto px-6 py-6 space-y-6">

                {/* 1. Take a Break Now (Top) */}
                <button
                    onClick={onStartBreak}
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 py-4 rounded-2xl font-bold transition transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <Play className="h-5 w-5 fill-white relative z-10" />
                    <span className="relative z-10">Take a Break Now</span>
                </button>

                {/* 2. Timer Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center min-h-[160px]">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">{statusMessage}</p>

                    {nextBreak !== '--' ? (
                        <>
                            <div className="text-7xl font-black text-gray-800 flex justify-center items-baseline">
                                {nextBreak}<span className="text-2xl font-bold ml-2 text-gray-300">min</span>
                            </div>
                            <div className="mt-2 flex justify-center text-xs text-gray-400">
                                Based on {frequency}m frequency
                            </div>
                        </>
                    ) : (
                        <div className="py-2">
                            {statusMessage.includes('tomorrow') ?
                                <Moon className="h-10 w-10 text-indigo-400 mx-auto" /> :
                                <Sun className="h-10 w-10 text-amber-400 mx-auto" />
                            }
                            <p className="text-sm text-gray-500 mt-2 font-medium">Relax and recharge.</p>
                        </div>
                    )}
                </div>

                {/* 3. Stats Row (Side by Side) */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Daily Goal</p>
                        <div className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            {stats.current} <span className="text-gray-300">/</span> {stats.goal}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Streak</p>
                        <div className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            {stats.streak} <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">days on fire!</p>
                    </div>
                </div>

                {/* 4. Settings Section (Read-Only) */}
                <div className="border-t border-gray-100 pt-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Focus Settings (Managed by HR)</h3>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4 opacity-80">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                <Clock className="h-3 w-3" /> Frequency
                            </label>
                            <span className="text-sm font-bold text-gray-800 bg-gray-50 px-3 py-1 rounded-lg">
                                {frequency} mins
                            </span>
                        </div>
                        <hr className="border-gray-50" />
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                <Calendar className="h-3 w-3" /> Work Hours
                            </label>
                            <span className="text-sm font-bold text-gray-800 bg-gray-50 px-3 py-1 rounded-lg">
                                {formatTime(workStart)} - {formatTime(workEnd)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
