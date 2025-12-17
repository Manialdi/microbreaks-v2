import Link from "next/link";
import { Check, Heart, Users, Globe, Briefcase, Zap } from "lucide-react";

export default function SolutionsPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="py-20 bg-slate-50 text-center container mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                    Wellness That Works <br /> For Everyone
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                    Whether you're managing a global workforce or just trying to avoid burnout, MicroBreaks adapts to your needs.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link href="/hr/signup" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                        Start Free Trial
                    </Link>
                </div>
            </section>

            {/* Navigation Anchor Links (Optional visual cue) */}
            <div className="border-b border-slate-200 sticky top-32 bg-white/95 backdrop-blur z-40 hidden md:block">
                <div className="container mx-auto px-4 flex justify-center space-x-8 py-4">
                    <a href="#hr" className="text-slate-600 hover:text-blue-600 font-medium">For HR</a>
                    <a href="#leaders" className="text-slate-600 hover:text-blue-600 font-medium">For Leaders</a>
                    <a href="#employees" className="text-slate-600 hover:text-blue-600 font-medium">For Employees</a>
                    <a href="#remote" className="text-slate-600 hover:text-blue-600 font-medium">Remote Teams</a>
                </div>
            </div>

            {/* Section: For HR Teams */}
            <section id="hr" className="py-24 container mx-auto px-4 scroll-mt-32">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mb-6">
                            <Briefcase className="w-4 h-4" /> For HR Teams
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Retention Through Care</h2>
                        <p className="text-lg text-slate-600 mb-6">
                            Wellness isn't just a perk—it's a retention strategy. MicroBreaks gives you a tangible, low-effort way to show you care about employee health without adding administrative burden.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-slate-700"><Check className="w-5 h-5 text-green-500" /> SOC2 Compliant Security</li>
                            <li className="flex gap-3 text-slate-700"><Check className="w-5 h-5 text-green-500" /> Weekly Engagement Reports</li>
                            <li className="flex gap-3 text-slate-700"><Check className="w-5 h-5 text-green-500" /> Seamless Onboarding</li>
                        </ul>
                    </div>
                    <div className="flex-1 bg-blue-50 rounded-2xl p-8 border border-blue-100 aspect-video flex items-center justify-center">
                        <span className="text-blue-300 font-bold text-xl">HR Dashboard UI</span>
                    </div>
                </div>
            </section>

            {/* Section: For People Leaders */}
            <section id="leaders" className="py-24 bg-slate-50 scroll-mt-32">
                <div className="container mx-auto px-4 flex flex-col md:flex-row-reverse gap-12 items-center">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold mb-6">
                            <Users className="w-4 h-4" /> For People Leaders
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Sustain Team Energy</h2>
                        <p className="text-lg text-slate-600 mb-6">
                            Avoid the afternoon slump. Equip your team with the tools to stay sharp, focused, and creative throughout the day.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-slate-700"><Check className="w-5 h-5 text-purple-500" /> Reduced Afternoon Fatigue</li>
                            <li className="flex gap-3 text-slate-700"><Check className="w-5 h-5 text-purple-500" /> Better Focus Metrics</li>
                            <li className="flex gap-3 text-slate-700"><Check className="w-5 h-5 text-purple-500" /> Team Health Challenges</li>
                        </ul>
                    </div>
                    <div className="flex-1 bg-white rounded-2xl p-8 border border-slate-200 aspect-video flex items-center justify-center">
                        <span className="text-slate-300 font-bold text-xl">Team Stats UI</span>
                    </div>
                </div>
            </section>

            {/* Section: For Employees */}
            <section id="employees" className="py-24 container mx-auto px-4 scroll-mt-32">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold mb-6">
                            <Heart className="w-4 h-4" /> For Employees
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Finish Work Feeling Good</h2>
                        <p className="text-lg text-slate-600 mb-6">
                            No more stiff necks, aching wrists, or dry eyes. Let MicroBreaks guide you through quick refreshes so you finish work feeling energized, not drained.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-slate-700"><Check className="w-5 h-5 text-orange-500" /> 2-Minute Guided Routines</li>
                            <li className="flex gap-3 text-slate-700"><Check className="w-5 h-5 text-orange-500" /> Non-Intrusive Notifications</li>
                            <li className="flex gap-3 text-slate-700"><Check className="w-5 h-5 text-orange-500" /> Personal Wellness Stats</li>
                        </ul>
                    </div>
                    <div className="flex-1 bg-orange-50 rounded-2xl p-8 border border-orange-100 aspect-video flex items-center justify-center">
                        <span className="text-orange-300 font-bold text-xl">Extension UI</span>
                    </div>
                </div>
            </section>

            {/* Section: For Remote Teams */}
            <section id="remote" className="py-24 bg-slate-900 text-white scroll-mt-32">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm font-bold mb-6">
                        <Globe className="w-4 h-4" /> For Remote Teams
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Shared Culture, Anywhere</h2>
                    <p className="text-xl text-slate-300 mb-10">
                        When you can't tap someone on the shoulder to go for a walk, MicroBreaks does it for you. Build a shared culture of health, no matter where your team sits.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="p-4 bg-slate-800 rounded-xl">
                            <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                            <div className="font-bold">Async Friendly</div>
                        </div>
                        <div className="p-4 bg-slate-800 rounded-xl">
                            <Globe className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                            <div className="font-bold">Global Timezones</div>
                        </div>
                        <div className="p-4 bg-slate-800 rounded-xl">
                            <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                            <div className="font-bold">Team Streaks</div>
                        </div>
                        <div className="p-4 bg-slate-800 rounded-xl">
                            <Briefcase className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                            <div className="font-bold">Slack Integration</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
