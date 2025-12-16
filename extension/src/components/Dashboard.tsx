import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Flame, Play, LogOut } from 'lucide-react';

export default function Dashboard({ onStartBreak }: { onStartBreak: () => void }) {
    const [nextBreak] = useState(30); // Mock
    const [frequency, setFrequency] = useState('30');
    const [theme, setTheme] = useState('nature');
    const [workStart, setWorkStart] = useState('09:00');
    const [workEnd, setWorkEnd] = useState('17:00');
    const [stats] = useState({ goal: 4, current: 0, streak: 5 });
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) setUserEmail(data.user.email || '');
        });

        // In reality, we sync these from chrome.storage
        chrome.storage.local.get(['frequency', 'workStart', 'workEnd'], (res: { [key: string]: any }) => {
            if (res.frequency) setFrequency(String(res.frequency));
        });
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        // App.tsx handles state update
    };

    const saveSettings = (key: string, value: any) => {
        chrome.storage.local.set({ [key]: value });
    };

    const getThemeColors = () => {
        switch (theme) {
            case 'ocean': return 'from-blue-500 to-cyan-500';
            case 'sunset': return 'from-orange-500 to-rose-500';
            default: return 'from-emerald-500 to-teal-500'; // nature
        }
    }

    const gradient = getThemeColors();

    return (
        <div className="h-full bg-gray-50 flex flex-col relative overflow-hidden text-gray-800 font-sans">
            {/* Decorative Background Blob */}
            <div className={`absolute top-[-10%] left-[-10%] w-[120%] h-[40%] bg-gradient-to-br ${gradient} rounded-b-[3rem] shadow-xl z-0`} />

            {/* Header */}
            <div className="relative z-10 flex justify-between items-center p-6 text-white">
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

            <div className="relative z-10 flex-1 overflow-y-auto px-6 pb-24 space-y-6">

                {/* Timer Card */}
                <div className="bg-white rounded-3xl p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] text-center transform transition-all hover:scale-[1.02]">
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Next break in</p>
                    <div className={`text-7xl font-black bg-gradient-to-br ${gradient} bg-clip-text text-transparent flex justify-center items-baseline`}>
                        {nextBreak}<span className="text-2xl font-bold opacity-30 ml-2 text-gray-400">min</span>
                    </div>
                    <div className="mt-4 flex justify-center">
                        <div className="h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${gradient} w-2/3 rounded-full`} />
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Daily Goal</p>
                        <div className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            {stats.current} <span className="text-gray-300">/</span> {stats.goal}
                        </div>
                        <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${gradient} rounded-full`} style={{ width: `${(stats.current / stats.goal) * 100}%` }} />
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

                {/* Settings Section */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 ml-1">Focus Settings</h3>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-gray-500 uppercase">Frequency</label>
                            <select
                                value={frequency}
                                onChange={(e) => { setFrequency(e.target.value); saveSettings('frequency', e.target.value); }}
                                className="bg-gray-50 border-none text-sm font-bold text-gray-700 rounded-lg p-2 focus:ring-0 cursor-pointer hover:bg-gray-100 transition"
                            >
                                <option value="15">15 mins</option>
                                <option value="30">30 mins</option>
                                <option value="45">45 mins</option>
                                <option value="60">60 mins</option>
                            </select>
                        </div>
                        <hr className="border-gray-50" />
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-gray-500 uppercase">Theme</label>
                            <select
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                className="bg-gray-50 border-none text-sm font-bold text-gray-700 rounded-lg p-2 focus:ring-0 cursor-pointer hover:bg-gray-100 transition"
                            >
                                <option value="nature">Nature</option>
                                <option value="ocean">Ocean</option>
                                <option value="sunset">Sunset</option>
                            </select>
                        </div>
                        <hr className="border-gray-50" />
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Work Hours</label>
                            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl">
                                <input
                                    type="time"
                                    value={workStart}
                                    onChange={(e) => setWorkStart(e.target.value)}
                                    className="flex-1 bg-transparent border-none text-center text-sm font-bold text-gray-700 focus:ring-0 py-1"
                                />
                                <span className="text-gray-300 text-xs">to</span>
                                <input
                                    type="time"
                                    value={workEnd}
                                    onChange={(e) => setWorkEnd(e.target.value)}
                                    className="flex-1 bg-transparent border-none text-center text-sm font-bold text-gray-700 focus:ring-0 py-1"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/80 to-transparent z-20">
                <button
                    onClick={onStartBreak}
                    className={`w-full group relative overflow-hidden bg-gradient-to-r ${gradient} text-white shadow-xl shadow-emerald-500/20 py-4 rounded-2xl font-bold transition transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer pointer-events-auto`}
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <Play className="h-5 w-5 fill-white relative z-10" />
                    <span className="relative z-10">Take a Break Now</span>
                </button>
            </div>
        </div>
    );
}

