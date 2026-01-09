import { Check, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
    return (
        <div className="bg-white">
            {/* 1) HERO SECTION */}
            <section className="py-2 md:py-4 bg-gradient-to-b from-slate-50 to-white text-center container mx-auto px-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
                    Simple, Transparent Pricing
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-2 leading-relaxed">
                    Pay only based on the number of employees you support.
                </p>
                <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">
                    No feature gating. No hidden fees. No surprise upgrades.
                </p>
            </section>

            {/* 2) PRICING EXPLANATION */}
            <section className="container mx-auto px-4 mb-2 mt-0 text-center max-w-3xl">
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-6">
                    <div className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                        <Check className="w-4 h-4 text-blue-600" /> One plan for all teams
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                        <Check className="w-4 h-4 text-blue-600" /> Pricing scales with company size
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                        <Check className="w-4 h-4 text-blue-600" /> Auto-discounts
                    </div>
                </div>

                {/* 3) PRICING TABLE (MAIN FOCUS) */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-2xl mx-auto mb-4">
                    <div className="bg-slate-900 text-white py-4 px-6 text-lg font-bold">
                        Monthly Pricing (Per Employee)
                    </div>
                    <div className="divide-y divide-slate-100">
                        <div className="flex justify-between items-center py-3.5 px-8 hover:bg-slate-50 transition-colors">
                            <span className="text-slate-700 font-medium">51 - 250 employees</span>
                            <span className="text-slate-900 font-bold text-xl">$6 <span className="text-sm text-slate-500 font-normal">/user/mo</span></span>
                        </div>
                        <div className="flex justify-between items-center py-3.5 px-8 hover:bg-slate-50 transition-colors">
                            <span className="text-slate-700 font-medium">251 - 1,000 employees</span>
                            <span className="text-slate-900 font-bold text-xl">$5 <span className="text-sm text-slate-500 font-normal">/user/mo</span></span>
                        </div>
                        <div className="flex justify-between items-center py-3.5 px-8 hover:bg-slate-50 transition-colors">
                            <span className="text-slate-700 font-medium">1,001 - 5,000 employees</span>
                            <span className="text-slate-900 font-bold text-xl">$4 <span className="text-sm text-slate-500 font-normal">/user/mo</span></span>
                        </div>
                        <div className="flex justify-between items-center py-3.5 px-8 hover:bg-slate-50 transition-colors bg-blue-50/30">
                            <span className="text-slate-700 font-medium">5,001+ employees</span>
                            <span className="text-blue-700 font-bold text-xl">$3 <span className="text-sm text-blue-600/70 font-normal">/user/mo (capped)</span></span>
                        </div>
                    </div>
                </div>
                <p className="text-sm text-slate-500 mb-16">
                    Pricing caps at $3 per employee per month for large organizations.
                </p>
            </section>

            {/* 4) ANNUAL BILLING OPTION */}
            <section className="bg-slate-50 py-20 border-y border-slate-100">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Save with Annual Billing</h2>
                    <p className="text-lg text-slate-600 mb-8">
                        Choose annual billing to simplify budgeting and save 10%.
                    </p>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 inline-block shadow-sm">
                        <div className="flex items-center gap-3 text-lg font-medium text-slate-800 mb-2 justify-center">
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">Save 10%</span>
                            Annual billing discount across all ranges
                        </div>
                        <p className="text-sm text-slate-500">
                            Example: A 500-employee team billed annually saves <span className="font-semibold text-slate-700">$3,000 per year</span>.
                        </p>
                    </div>
                </div>
            </section>

            {/* 5) WHAT’S INCLUDED */}
            <section className="py-20 container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">What Every Team Gets</h2>
                        <p className="text-lg text-slate-600">All customers receive the full Micro-Breaks experience.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                        <div className="flex gap-4 items-start p-4 hover:bg-slate-50 rounded-lg transition-colors">
                            <div className="mt-1 bg-blue-100 p-1 rounded text-blue-600 shrink-0"><Check className="w-4 h-4" /></div>
                            <div>
                                <h3 className="font-semibold text-slate-900 mb-1">Guided Micro-Breaks</h3>
                                <p className="text-sm text-slate-600">2-5 minute desk-friendly routines focused on mobility and focus.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start p-4 hover:bg-slate-50 rounded-lg transition-colors">
                            {/* Note: Icon usage is purely decorative here to match style */}
                            <div className="mt-1 bg-blue-100 p-1 rounded text-blue-600 shrink-0"><Check className="w-4 h-4" /></div>
                            <div>
                                <h3 className="font-semibold text-slate-900 mb-1">Smart Reminders</h3>
                                <p className="text-sm text-slate-600">Gentle, non-intrusive notifications that respect deep work.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start p-4 hover:bg-slate-50 rounded-lg transition-colors">
                            <div className="mt-1 bg-blue-100 p-1 rounded text-blue-600 shrink-0"><Check className="w-4 h-4" /></div>
                            <div>
                                <h3 className="font-semibold text-slate-900 mb-1">Holistic Wellness</h3>
                                <p className="text-sm text-slate-600">Support for desk health, eye strain, focus, and daily energy.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start p-4 hover:bg-slate-50 rounded-lg transition-colors">
                            <div className="mt-1 bg-blue-100 p-1 rounded text-blue-600 shrink-0"><Check className="w-4 h-4" /></div>
                            <div>
                                <h3 className="font-semibold text-slate-900 mb-1">Privacy First</h3>
                                <p className="text-sm text-slate-600">Team-wide adoption without individual performance tracking.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start p-4 hover:bg-slate-50 rounded-lg transition-colors md:col-span-2 md:w-2/3 md:mx-auto">
                            <div className="mt-1 bg-blue-100 p-1 rounded text-blue-600 shrink-0"><Check className="w-4 h-4" /></div>
                            <div>
                                <h3 className="font-semibold text-slate-900 mb-1">Universal Access</h3>
                                <p className="text-sm text-slate-600">Works seamlessly across office, hybrid, and remote teams.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6) FAQ */}
            <section className="py-20 bg-slate-50 border-t border-slate-100">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Common Questions</h2>
                    <div className="space-y-8">
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-slate-400" /> Do features change based on company size?
                            </h3>
                            <p className="text-slate-600 pl-7">No. All teams receive the same complete product experience regardless of size.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-slate-400" /> Do you charge per active user or total employees?
                            </h3>
                            <p className="text-slate-600 pl-7">Pricing is based on the number of confirmed employees covered by the plan.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-slate-400" /> Are there setup or onboarding fees?
                            </h3>
                            <p className="text-slate-600 pl-7">No. Micro-Breaks is designed to be easy to roll out with zero implementation fees.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-slate-400" /> Is there a minimum contract length?
                            </h3>
                            <p className="text-slate-600 pl-7">Monthly and annual billing options are available to suit your preference.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7) FINAL CTA */}
            <section className="py-24 bg-white container mx-auto px-4 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold text-slate-900 mb-6">Start with Your Team. Scale When You’re Ready.</h2>
                    <p className="text-xl text-slate-600 mb-10">
                        Micro-Breaks is easy to try, easy to adopt, and built to grow with your organization.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/hr/signup" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-2 text-lg">
                            Start Free Trial <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link href="mailto:sales@micro-breaks.com" className="text-slate-600 font-semibold hover:text-blue-600 transition-colors underline decoration-slate-300 hover:decoration-blue-600 underline-offset-4">
                            Talk to Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
