import { ArrowRight, Mail, Download, Clock, Activity, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HowItWorksPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative py-20 bg-slate-50 overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                            Simple to Start.
                            <br />
                            <span className="text-blue-600">Powerful for Health.</span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                            MicroBreaks integrates seamlessly into your team's workflow. No complex setup, no heavy software—just a lightweight extension that keeps everyone healthy.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/hr/signup" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/25">
                                Start Free Trial
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Steps Section */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Step 1 */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-center mb-8">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Mail className="w-10 h-10 text-blue-600" />
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium text-xs mb-4">
                                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                                    Step One
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">Invite Your Team</h2>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    HR admins invite employees via email from the dashboard. Employees receive a secure link to set their password.
                                </p>
                                <ul className="space-y-2 text-left bg-slate-50 p-4 rounded-xl">
                                    <li className="flex items-center gap-2 text-slate-700 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                        <span>Bulk invite support</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-700 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                        <span>Secure password setup</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-center mb-8">
                                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Download className="w-10 h-10 text-purple-600" />
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full font-medium text-xs mb-4">
                                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                                    Step Two
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">Install Extension</h2>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    Employees install the extension and log in. It sits quietly in the browser, respecting privacy.
                                </p>
                                <ul className="space-y-2 text-left bg-slate-50 p-4 rounded-xl">
                                    <li className="flex items-center gap-2 text-slate-700 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                        <span>One-click installation</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-700 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                        <span>Privacy-first design</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-center mb-8">
                                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                                    <Activity className="w-10 h-10 text-orange-600" />
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-700 rounded-full font-medium text-xs mb-4">
                                    <span className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                                    Step Three
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-4">Active Breaks</h2>
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    Every 2 hours, a gentle notification appears. The side panel opens with a guided 2-minute routine.
                                </p>
                                <ul className="space-y-2 text-left bg-slate-50 p-4 rounded-xl">
                                    <li className="flex items-center gap-2 text-slate-700 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                        <span>Smart notifications</span>
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-700 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                        <span>Guided stretches</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <section className="py-20 bg-blue-600 text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-6">Ready to improve your team's health?</h2>
                    <Link href="/hr/signup" className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-colors">
                        Get Started <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
