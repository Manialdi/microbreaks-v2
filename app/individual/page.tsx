"use client";

import Link from "next/link";
import {
    Download,
    Sparkles,
    Settings,
    Bell,
    PlayCircle,
    Zap,
    Activity,
    Smile,
    Feather,
    Repeat,
    ArrowRight
} from "lucide-react";

export default function IndividualPage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-24 pb-16 lg:pt-36 lg:pb-32 overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                        {/* Left: Text Content */}
                        <div className="text-center lg:text-left order-last lg:order-first">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-6">
                                <Sparkles size={14} /> New: Lifetime Personal Plan
                            </span>
                            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                                Build a Healthier Workday <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">One Break at a Time</span>
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                Micro-Breaks fits into your workday with timely reminders and quick guided exercises - no thinking, no planning.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link href="https://chromewebstore.google.com/detail/microbreaks-personal/gmdpcildfnehopafflccogmhmichoppa" target="_blank" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 ring-4 ring-transparent hover:ring-blue-100">
                                    <Download size={20} className="mr-2" /> Download Now
                                </Link>
                                {/* Secondary CTA removed as requested */}
                            </div>
                            <p className="text-xs text-slate-400 mt-4 font-medium uppercase tracking-wide">
                                Chrome Extension • Free Trial for 7 Days
                            </p>
                        </div>

                        {/* Right: Video Demo */}
                        <div className="relative order-first lg:order-last">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 aspect-video transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                <video
                                    src="/videos/chin-tucks-v1.webm"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover opacity-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                                <div className="absolute bottom-4 left-4 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                                    Exercise Demo: Chin Tucks
                                </div>
                            </div>
                            {/* Decorative Blob */}
                            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 blur-3xl rounded-full"></div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Problem / Solution Split Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-0 border border-slate-200 rounded-3xl overflow-hidden shadow-xl">

                        {/* Side A: The Desk Trap */}
                        <div className="bg-slate-50 p-10 md:p-16 flex flex-col justify-center">
                            <div className="w-12 h-12 bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center mb-6">
                                <Activity size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4">The Desk Trap</h3>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                Sitting for hours locks your body up. Stiffness, fading focus, and eye fatigue aren't just annoying - they kill your productivity.
                            </p>
                        </div>

                        {/* Side B: The Solution */}
                        <div className="bg-blue-600 p-10 md:p-16 flex flex-col justify-center text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/20 text-white rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                                    <Sparkles size={24} />
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4">The Micro-break Fix</h3>
                                <p className="text-blue-100 text-lg leading-relaxed">
                                    Smart, science-backed pauses. A quick stretch or deep breath resets your posture and mind in just 120 seconds.
                                </p>
                            </div>
                            {/* Texture */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        </div>

                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-slate-50 border-y border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                            Simple wellness in 5 steps
                        </h2>
                    </div>

                    <div className="relative max-w-5xl mx-auto">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-200 -z-0"></div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                            {/* Step 1 */}
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center shadow-sm mb-6">
                                    <Download size={32} className="text-blue-600" />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1">Install Extension</h4>
                                <span className="text-sm text-slate-500">Add to browser</span>
                            </div>

                            {/* Step 2 */}
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center shadow-sm mb-6">
                                    <Settings size={32} className="text-blue-600" />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1">Set Schedule</h4>
                                <span className="text-sm text-slate-500">Customize your routine</span>
                            </div>

                            {/* Step 3 */}
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center shadow-sm mb-6">
                                    <Bell size={32} className="text-blue-600" />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1">Get Nudges</h4>
                                <span className="text-sm text-slate-500">Gentle reminders</span>
                            </div>

                            {/* Step 4 */}
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center shadow-sm mb-6">
                                    <PlayCircle size={32} className="text-blue-600" />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1">Take a Break</h4>
                                <span className="text-sm text-slate-500">Guided exercises</span>
                            </div>

                            {/* Step 5 */}
                            <div className="relative z-10 flex flex-col items-center text-center col-span-2 md:col-span-1">
                                <div className="w-24 h-24 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center shadow-sm mb-6">
                                    <Smile size={32} className="text-blue-600" />
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1">Feel Good</h4>
                                <span className="text-sm text-slate-500">Return focused</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Grid Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Outcomes</span>
                        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mt-2">
                            Why you'll love it
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Benefit 1 */}
                        <div className="p-8 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 group">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Activity size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Undo The Desk Damage</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Release tension in your neck, back, and shoulders with simple daily movements.
                            </p>
                        </div>

                        {/* Benefit 2 */}
                        <div className="p-8 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 group">
                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Recharge Your Brain</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Short breaks prevent burnout and keep your concentration sharp until 5 PM.
                            </p>
                        </div>

                        {/* Benefit 3 */}
                        <div className="p-8 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 group">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Feather size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Non-Intrusive Design</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Nudges appear at natural pauses. Snooze with one click if you're in the zone.
                            </p>
                        </div>

                        {/* Benefit 4 */}
                        <div className="p-8 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100 group">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Repeat size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Wellness on Autopilot</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Turn healthy movement into a routine you don't even have to think about.
                            </p>
                        </div>
                    </div>

                    {/* Final CTA */}
                    <div className="mt-16 text-center">
                        <Link href="/individual/pricing" className="inline-flex items-center text-blue-600 font-bold hover:text-blue-800 transition-colors text-lg group">
                            See Pricing Options <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
