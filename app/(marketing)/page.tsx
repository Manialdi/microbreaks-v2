
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Activity, Smile, BarChart3, Heart, Zap, Users, Globe, Settings, Bell, LineChart, Clock, Move, LayoutDashboard } from "lucide-react"

export default function LandingPage() {
    return (
        <div className="bg-gradient-to-b from-blue-50/50 to-white">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 lg:py-32">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    {/* Left Column: Text Content */}
                    <div className="flex flex-col space-y-8 max-w-2xl text-left">
                        <div className="space-y-4">
                            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                                Micro-breaks that build healthier teams <span className="text-blue-600">automatically</span>
                            </h1>
                            <p className="text-lg lg:text-xl text-slate-600 leading-relaxed max-w-md">
                                Micro Breaks delivers science-backed 2-minute breaks through gentle reminders employees love, with dashboards HR teams trust.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/login" className="inline-flex justify-center items-center px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95 text-base">
                                Start free for your team
                            </Link>
                            <Link href="#how-it-works" className="inline-flex justify-center items-center px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 text-base">
                                See how it works
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
                            <div className="flex items-center gap-3 text-slate-700">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <Activity size={20} />
                                </div>
                                <span className="text-sm font-medium">Reduce pain & fatigue</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700">
                                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                    <Smile size={20} />
                                </div>
                                <span className="text-sm font-medium">Boost focus & mood</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-700">
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                    <BarChart3 size={20} />
                                </div>
                                <span className="text-sm font-medium">Give HR real insights</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Hero Image */}
                    <div className="relative lg:h-[600px] w-full flex items-center justify-center">
                        <div className="relative w-full aspect-square lg:aspect-auto h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-white">
                            <Image
                                src="/hero-dashboard.png"
                                alt="Micro Breaks Dashboard Interface"
                                fill
                                className="object-cover object-left-top"
                                priority
                            />
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-200/20 blur-3xl rounded-full pointer-events-none" />
                    </div>
                </div>
            </section>

            {/* Problems & Benefits Section */}
            <section className="bg-white py-24 lg:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                            Your team sits all day. <br className="hidden md:block" />
                            Their bodies weren’t designed for it.
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Prolonged sitting leads to stiffness, eye strain, and burnout.
                            Micro Breaks introduces simple, science-backed habits throughout the day—without requiring another heavy wellness program.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Benefit 1 */}
                        <div className="p-8 rounded-2xl bg-blue-50/50 border border-blue-100 hover:border-blue-200 hover:shadow-sm transition-all">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <Heart size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Less pain, more comfort</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Gentle micro stretches reduce neck, shoulder, and back strain.
                            </p>
                        </div>

                        {/* Benefit 2 */}
                        <div className="p-8 rounded-2xl bg-amber-50/50 border border-amber-100 hover:border-amber-200 hover:shadow-sm transition-all">
                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Sharper focus, better work</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Short breaks improve attention and mental clarity.
                            </p>
                        </div>

                        {/* Benefit 3 */}
                        <div className="p-8 rounded-2xl bg-green-50/50 border border-green-100 hover:border-green-200 hover:shadow-sm transition-all">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Healthier culture, happier teams</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Build trust and engagement through wellbeing.
                            </p>
                        </div>

                        {/* Benefit 4 */}
                        <div className="p-8 rounded-2xl bg-indigo-50/50 border border-indigo-100 hover:border-indigo-200 hover:shadow-sm transition-all">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                                <Globe size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Wellness that scales</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Works across locations, teams, and time zones.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="bg-slate-50 py-24 lg:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">How Micro Breaks Works</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-3 mb-6 tracking-tight">
                            Tiny breaks, big impact — in three simple steps.
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[2.5rem] left-1/6 right-1/6 h-0.5 bg-slate-200 -z-10" />

                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-8 relative z-10">
                                <Settings size={32} className="text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">1. Set up your team</h3>
                            <p className="text-slate-600 leading-relaxed">
                                HR or team leads invite employees, set default break frequency, and choose the initial exercise sets.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-8 relative z-10">
                                <Bell size={32} className="text-amber-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">2. Employees get gentle reminders</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Friendly, non-intrusive nudges on Chrome or mobile guide employees to take quick 2-minute breaks.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-8 relative z-10">
                                <LineChart size={32} className="text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">3. Track usage & wellbeing</h3>
                            <p className="text-slate-600 leading-relaxed">
                                HR sees participation, trends, and wellness signals to measure impact and adjust cadence.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-white py-24 lg:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                            Everything you need to build better workday habits.
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature Card 1 */}
                        <div className="group p-8 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Clock size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Break Reminders</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Reminders adapt to your team’s rhythm. Set default schedules or let employees customize. Subtle, respectful, never disruptive.
                            </p>
                        </div>

                        {/* Feature Card 2 */}
                        <div className="group p-8 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                <Move size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">2-Minute Guided Exercises</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Simple stretches and resets designed for eyes, neck, shoulders, wrists, and posture. No equipment. No learning curve.
                            </p>
                        </div>

                        {/* Feature Card 3 */}
                        <div className="group p-8 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <LayoutDashboard size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">HR Wellness Dashboard</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Understand adoption, participation, and wellbeing trends across teams. Spot burnout risk early with data-backed insights.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}




