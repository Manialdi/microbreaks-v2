
"use client";

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Activity, Smile, BarChart3, Heart, Zap, Users, Globe, Settings, Bell, LineChart, Clock, Move, LayoutDashboard, CheckCircle, Check, Download } from "lucide-react"
import { FaqSection } from "@/components/landing/FaqSection"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
    const router = useRouter();

    useEffect(() => {
        // Safety Redirect for Auth Tokens (if Supabase redirects to root)
        if (typeof window !== 'undefined' && window.location.hash) {
            const hash = window.location.hash;
            if (hash.includes('type=recovery') || hash.includes('access_token')) {
                // If it looks like an employee invite token, send them to onboarding
                // We preserve the hash so the onboarding page can consume it
                router.replace(`/employee/onboarding${hash}`);
            }
        }
    }, [router]);

    return (
        <div className="bg-gradient-to-b from-blue-50/50 to-white">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 lg:py-32">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    {/* Left Column: Text Content */}
                    <div className="lg:col-span-7 flex flex-col space-y-8 max-w-2xl text-left">
                        <div className="space-y-4">
                            <h1 className="text-4xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                                Micro-breaks your team will actually <span className="text-blue-600">use</span>
                            </h1>
                            <p className="text-lg lg:text-xl text-slate-600 leading-relaxed max-w-lg">
                                Micro Breaks delivers science-backed 2-minute breaks through gentle reminders employees love - all powered by a simple Chrome extension - with an HR analytics dashboard teams trust.
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

                        <div className="flex flex-col gap-4 pt-8 border-t border-slate-100">
                            <div className="flex items-start gap-4 text-slate-700">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-1 shrink-0">
                                    <Activity size={20} />
                                </div>
                                <div>
                                    <span className="block font-bold text-slate-900">Reduce pain & fatigue</span>
                                    <span className="text-sm text-slate-600">Quick resets for neck, shoulders, wrists, and posture</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 text-slate-700">
                                <div className="p-2 bg-green-100 rounded-lg text-green-600 mt-1 shrink-0">
                                    <Smile size={20} />
                                </div>
                                <div>
                                    <span className="block font-bold text-slate-900">Boost focus & mood</span>
                                    <span className="text-sm text-slate-600">2-minute breaks proven to restore attention</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 text-slate-700">
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600 mt-1 shrink-0">
                                    <BarChart3 size={20} />
                                </div>
                                <div>
                                    <span className="block font-bold text-slate-900">Give HR real insights</span>
                                    <span className="text-sm text-slate-600">Track participation & wellbeing trends</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Hero Image */}
                    <div className="lg:col-span-5 relative lg:h-[600px] w-full flex items-center justify-center">
                        <div className="relative w-full aspect-square lg:aspect-auto h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-white flex items-center justify-center bg-slate-50">
                            <Image
                                src="/images/extension-preview-new.png"
                                alt="Micro Breaks Extension Interface"
                                fill
                                className="object-contain"
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

            {/* How Micro Breaks Works Section */}
            <section id="how-it-works" className="bg-slate-50 py-24 lg:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">HOW MICRO BREAKS WORKS</span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mt-3 mb-6 tracking-tight">
                            Tiny breaks, big impact — in one simple flow.
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-8">
                        {/* Step 1 */}
                        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-center group">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Users size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">1. Set up your team</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                HR or team leads add employees, set default break frequency, and choose the right exercise categories for the company.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-center group">
                            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                <Download size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">2. Employees install the Chrome extension</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Each employee receives an email invite with a link to download the Micro Breaks Chrome extension and log in using their company credentials.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-center group">
                            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <Bell size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">3. Employees get smart, non-intrusive nudges</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Once logged in, employees receive gentle reminders on Chrome to take quick 2-minute breaks - subtle, respectful, never disruptive. Employees can snooze the reminders.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-center group">
                            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <Activity size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">4. Do simple 2-minute guided exercises</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Micro-stretches for eyes, neck, shoulders, wrists, back, and posture. No equipment, no learning curve — just quick resets at the desk.
                            </p>
                        </div>

                        {/* Step 5 */}
                        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-center group">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <BarChart3 size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">5. Track team wellbeing with the HR Dashboard</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                HR sees participation, engagement patterns, and early burnout signals. Data-backed insights help measure impact and improve wellness initiatives.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Built for HR Section */}
            <section className="bg-slate-50 py-24 lg:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                            Built for HR, loved by employees.
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* For HR & People Teams */}
                        <div className="p-8 rounded-2xl bg-white border border-slate-200">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">For HR & People Teams</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle size={20} className="text-blue-600 mt-1 shrink-0" />
                                    <span className="text-slate-600 text-sm">Launch a wellness initiative in days</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle size={20} className="text-blue-600 mt-1 shrink-0" />
                                    <span className="text-slate-600 text-sm">See real participation, not vanity metrics</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle size={20} className="text-blue-600 mt-1 shrink-0" />
                                    <span className="text-slate-600 text-sm">Support wellbeing with zero admin overhead</span>
                                </li>
                            </ul>
                        </div>

                        {/* For People Leaders */}
                        <div className="p-8 rounded-2xl bg-white border border-slate-200">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">For People Leaders</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle size={20} className="text-amber-600 mt-1 shrink-0" />
                                    <span className="text-slate-600 text-sm">Reduce burnout risk across your team</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle size={20} className="text-amber-600 mt-1 shrink-0" />
                                    <span className="text-slate-600 text-sm">Encourage healthy habits during long workdays</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle size={20} className="text-amber-600 mt-1 shrink-0" />
                                    <span className="text-slate-600 text-sm">Build a culture of care and sustainability</span>
                                </li>
                            </ul>
                        </div>

                        {/* For Employees */}
                        <div className="p-8 rounded-2xl bg-white border border-slate-200">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">For Employees</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <CheckCircle size={20} className="text-green-600 mt-1 shrink-0" />
                                    <span className="text-slate-600 text-sm">Reduce stiffness and fatigue</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle size={20} className="text-green-600 mt-1 shrink-0" />
                                    <span className="text-slate-600 text-sm">Feel better throughout the day with small habits</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle size={20} className="text-green-600 mt-1 shrink-0" />
                                    <span className="text-slate-600 text-sm">No pressure or guilt — just gentle nudges</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Teaser Section */}
            <section className="bg-white py-24 lg:py-32">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                            Start small. Grow as your team does.
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Micro Breaks is designed to be easy to try, simple to roll out, and affordable to scale.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Card */}
                        <div className="p-8 rounded-2xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-lg transition-all relative">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Free</h3>
                            <p className="text-slate-500 mb-8">Perfect for small teams and pilots</p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-slate-700">
                                    <Check size={18} className="text-blue-600" />
                                    <span>Up to 10 employees</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <Check size={18} className="text-blue-600" />
                                    <span>Core reminders</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <Check size={18} className="text-blue-600" />
                                    <span>Starter exercise library</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <Check size={18} className="text-blue-600" />
                                    <span>Basic usage insights</span>
                                </li>
                            </ul>

                            <Link href="/login" className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                                Start Free
                            </Link>
                        </div>

                        {/* Pro Card */}
                        <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:shadow-lg transition-all relative">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Pro</h3>
                            <p className="text-slate-500 mb-8">For growing teams and companies</p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-slate-700">
                                    <Check size={18} className="text-slate-900" />
                                    <span>Unlimited employees</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <Check size={18} className="text-slate-900" />
                                    <span>Full exercise library</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <Check size={18} className="text-slate-900" />
                                    <span>Advanced HR analytics</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-700">
                                    <Check size={18} className="text-slate-900" />
                                    <span>Priority support</span>
                                </li>
                            </ul>

                            <Link href="mailto:sales@micro-breaks.com" className="block w-full text-center px-6 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition-colors">
                                Talk to us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <FaqSection />
        </div>
    )
}



