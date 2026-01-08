import Link from "next/link";
import { Check, Heart, Users, Globe, Briefcase, Zap, ArrowRight, Shield, Award, Clock } from "lucide-react";

export default function SolutionsPage() {
    return (
        <div className="bg-white">
            {/* 1) HERO SECTION */}
            <section className="py-6 md:py-8 bg-gradient-to-b from-slate-50 to-white text-center container mx-auto px-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                    Wellness That Works - <span className="text-blue-600">For Everyone</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-3 leading-relaxed">
                    Micro-Breaks helps organizations reduce fatigue, improve focus, and support healthier workdays through simple, science-backed micro-breaks.
                </p>
                <p className="text-sm font-medium text-slate-500 mb-8 tracking-wide uppercase">
                    Built for HR teams, people leaders, employees, and remote-first organizations.
                </p>
                <div className="flex justify-center">
                    <Link href="/hr/signup" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-2 text-base">
                        Start Free Trial <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>

            {/* 2) SOLUTION NAVIGATION (TEXT ONLY) */}
            <div className="border-b border-slate-200 sticky top-20 bg-white/95 backdrop-blur z-40">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-6 md:gap-12 py-5 overflow-x-auto">
                        <a href="#hr" className="text-slate-600 hover:text-blue-600 font-semibold whitespace-nowrap transition-colors">For HR Teams</a>
                        <a href="#leaders" className="text-slate-600 hover:text-blue-600 font-semibold whitespace-nowrap transition-colors">For People Leaders</a>
                        <a href="#employees" className="text-slate-600 hover:text-blue-600 font-semibold whitespace-nowrap transition-colors">For Employees</a>
                        <a href="#remote" className="text-slate-600 hover:text-blue-600 font-semibold whitespace-nowrap transition-colors">For Remote Teams</a>
                    </div>
                </div>
            </div>

            {/* 3) FOR HR TEAMS */}
            <section id="hr" className="py-24 container mx-auto px-4 scroll-mt-28">
                <div className="max-w-4xl mx-auto">
                    <span className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-2 block">For HR Teams</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Retention Through Everyday Care</h2>

                    <div className="grid md:grid-cols-5 gap-12">
                        <div className="md:col-span-3">
                            <p className="text-lg text-slate-700 leading-relaxed mb-8">
                                Wellness initiatives often fail when they are complex, intrusive, or difficult to sustain.
                                Micro-Breaks gives HR teams a lightweight way to demonstrate ongoing care for employee well-being - without increasing administrative overhead.
                            </p>

                            <h3 className="font-bold text-slate-900 mb-4 text-lg">Operational Value</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-slate-700 items-start">
                                    <div className="p-1 bg-blue-100 rounded text-blue-600 mt-1 shrink-0"><Check className="w-3 h-3" /></div>
                                    <span>Simple company-wide onboarding</span>
                                </li>
                                <li className="flex gap-3 text-slate-700 items-start">
                                    <div className="p-1 bg-blue-100 rounded text-blue-600 mt-1 shrink-0"><Check className="w-3 h-3" /></div>
                                    <span>Privacy-first, non-medical wellness approach</span>
                                </li>
                                <li className="flex gap-3 text-slate-700 items-start">
                                    <div className="p-1 bg-blue-100 rounded text-blue-600 mt-1 shrink-0"><Check className="w-3 h-3" /></div>
                                    <span>Clear engagement visibility without individual surveillance</span>
                                </li>
                            </ul>
                        </div>
                        <div className="md:col-span-2 bg-blue-50/50 p-8 rounded-2xl border border-blue-100">
                            <h3 className="font-bold text-slate-900 mb-4 text-lg">Key Outcomes</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-slate-700 items-start">
                                    <Briefcase className="w-5 h-5 text-blue-600 shrink-0" />
                                    <span className="text-sm">Encourage healthier daily work habits at scale</span>
                                </li>
                                <li className="flex gap-3 text-slate-700 items-start">
                                    <Users className="w-5 h-5 text-blue-600 shrink-0" />
                                    <span className="text-sm">Increase participation compared to one-time wellness programs</span>
                                </li>
                                <li className="flex gap-3 text-slate-700 items-start">
                                    <Heart className="w-5 h-5 text-blue-600 shrink-0" />
                                    <span className="text-sm">Support retention through visible, consistent care</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4"><div className="border-t border-slate-100 max-w-5xl mx-auto"></div></div>

            {/* 4) FOR PEOPLE LEADERS */}
            <section id="leaders" className="py-24 container mx-auto px-4 scroll-mt-28">
                <div className="max-w-4xl mx-auto">
                    <span className="text-purple-600 font-bold tracking-wide uppercase text-sm mb-2 block">For People Leaders</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Sustain Team Energy and Focus</h2>

                    <div className="grid md:grid-cols-5 gap-12">
                        <div className="md:col-span-3">
                            <p className="text-lg text-slate-700 leading-relaxed mb-8">
                                Energy dips, physical discomfort, and mental fatigue quietly affect performance.
                                Micro-Breaks helps teams stay refreshed throughout the workday without disrupting deep work.
                            </p>

                            <h3 className="font-bold text-slate-900 mb-4 text-lg">Leader Experience</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-slate-700 items-start">
                                    <div className="p-1 bg-purple-100 rounded text-purple-600 mt-1 shrink-0"><Check className="w-3 h-3" /></div>
                                    <span>No performance tracking</span>
                                </li>
                                <li className="flex gap-3 text-slate-700 items-start">
                                    <div className="p-1 bg-purple-100 rounded text-purple-600 mt-1 shrink-0"><Check className="w-3 h-3" /></div>
                                    <span>No constant reminders from managers</span>
                                </li>
                                <li className="flex gap-3 text-slate-700 items-start">
                                    <div className="p-1 bg-purple-100 rounded text-purple-600 mt-1 shrink-0"><Check className="w-3 h-3" /></div>
                                    <span>Works quietly in the background</span>
                                </li>
                            </ul>
                        </div>
                        <div className="md:col-span-2 bg-purple-50/30 p-8 rounded-2xl border border-purple-100">
                            <h3 className="font-bold text-slate-900 mb-4 text-lg">Key Outcomes</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-slate-700 items-start">
                                    <Zap className="w-5 h-5 text-purple-600 shrink-0" />
                                    <span className="text-sm">Reduce afternoon fatigue</span>
                                </li>
                                <li className="flex gap-3 text-slate-700 items-start">
                                    <Award className="w-5 h-5 text-purple-600 shrink-0" />
                                    <span className="text-sm">Support focus during long desk-based work</span>
                                </li>
                                <li className="flex gap-3 text-slate-700 items-start">
                                    <Shield className="w-5 h-5 text-purple-600 shrink-0" />
                                    <span className="text-sm">Encourage healthier routines without micromanagement</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4"><div className="border-t border-slate-100 max-w-5xl mx-auto"></div></div>

            {/* 5) FOR EMPLOYEES */}
            <section id="employees" className="py-24 container mx-auto px-4 scroll-mt-28">
                <div className="max-w-4xl mx-auto">
                    <span className="text-orange-600 font-bold tracking-wide uppercase text-sm mb-2 block">For Employees</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Finish Work Feeling Better</h2>

                    <div className="grid md:grid-cols-5 gap-12">
                        <div className="md:col-span-3">
                            <p className="text-lg text-slate-700 leading-relaxed mb-8">
                                Long hours at a desk can lead to stiffness, eye strain, and mental exhaustion.
                                Micro-Breaks provides gentle nudges to move, reset, and return to work feeling refreshed - not drained.
                            </p>

                            <h3 className="font-bold text-slate-900 mb-4 text-lg">Supportive, Not Controlling</h3>
                            <p className="text-slate-600 mb-4">
                                The experience is designed to be a personal wellness companion, giving you autonomy over when and how you take breaks.
                            </p>
                        </div>
                        <div className="md:col-span-2 bg-orange-50/50 p-8 rounded-2xl border border-orange-100">
                            <h3 className="font-bold text-slate-900 mb-4 text-lg">Key Benefits</h3>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-slate-700 items-start">
                                    <Clock className="w-5 h-5 text-orange-600 shrink-0" />
                                    <span className="text-sm">Short, desk-friendly guided breaks (2–5 minutes)</span>
                                </li>
                                <li className="flex gap-3 text-slate-700 items-start">
                                    <Shield className="w-5 h-5 text-orange-600 shrink-0" />
                                    <span className="text-sm">Non-intrusive reminders that respect focus</span>
                                </li>
                                <li className="flex gap-3 text-slate-700 items-start">
                                    <Award className="w-5 h-5 text-orange-600 shrink-0" />
                                    <span className="text-sm">Personal habit visibility through streaks and usage stats</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6) FOR REMOTE TEAMS */}
            <section id="remote" className="py-24 bg-slate-900 text-slate-300 scroll-mt-28">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="flex-1">
                            <span className="text-blue-400 font-bold tracking-wide uppercase text-sm mb-2 block">For Remote Teams</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Shared Culture, Anywhere</h2>
                            <p className="text-lg leading-relaxed mb-8 text-slate-400">
                                When teams are distributed across locations and time zones, well-being becomes invisible.
                                Micro-Breaks creates a shared rhythm of healthy work habits, no matter where people work from.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                    <Globe className="w-6 h-6 text-blue-400 mb-2" />
                                    <div className="text-white text-sm font-semibold">Async-friendly wellness habits</div>
                                </div>
                                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                    <Users className="w-6 h-6 text-green-400 mb-2" />
                                    <div className="text-white text-sm font-semibold">Consistent experience across geographies</div>
                                </div>
                                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                    <Briefcase className="w-6 h-6 text-purple-400 mb-2" />
                                    <div className="text-white text-sm font-semibold">Designed for hybrid and fully remote teams</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7) WHY MICRO-BREAKS */}
            <section className="py-24 bg-slate-50 container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12">Why Micro-Breaks Works</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-left p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                            <Briefcase className="w-8 h-8 text-slate-400 mb-4" />
                            <h3 className="font-bold text-slate-900 mb-2">For Knowledge Work</h3>
                            <p className="text-sm text-slate-600">Designed specifically for desk-heavy roles.</p>
                        </div>
                        <div className="text-left p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                            <Shield className="w-8 h-8 text-slate-400 mb-4" />
                            <h3 className="font-bold text-slate-900 mb-2">Science Backed</h3>
                            <p className="text-sm text-slate-600">Grounded in ergonomics and habit science.</p>
                        </div>
                        <div className="text-left p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                            <Zap className="w-8 h-8 text-slate-400 mb-4" />
                            <h3 className="font-bold text-slate-900 mb-2">Easy Adoption</h3>
                            <p className="text-sm text-slate-600">Easy to adopt, easy to sustain long-term.</p>
                        </div>
                        <div className="text-left p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                            <Clock className="w-8 h-8 text-slate-400 mb-4" />
                            <h3 className="font-bold text-slate-900 mb-2">Non-Intrusive</h3>
                            <p className="text-sm text-slate-600">Built to blend into workdays, not interrupt them.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8) FINAL CTA */}
            <section className="py-24 bg-white container mx-auto px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold text-slate-900 mb-6">Start Small. Feel the Difference.</h2>
                    <p className="text-xl text-slate-600 mb-10">
                        Micro-Breaks is easy to try, easy to adopt, and simple to sustain.
                    </p>
                    <Link href="/hr/signup" className="inline-flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-500/30 text-lg">
                        Start Free Trial <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
