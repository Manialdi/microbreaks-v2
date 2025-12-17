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
                    <div className="max-w-4xl mx-auto space-y-24">

                        {/* Step 1 */}
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1 space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium text-sm">
                                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                                    Step One
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900">Invite Your Team</h2>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    HR admins invite employees via email from the dashboard. Employees receive a secure link to set their password.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-slate-700">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        Bulk invite support
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        Secure password setup
                                    </li>
                                </ul>
                            </div>
                            <div className="flex-1 bg-slate-100 p-8 rounded-2xl border border-slate-200 aspect-video flex items-center justify-center">
                                <Mail className="w-24 h-24 text-blue-200" />
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                            <div className="flex-1 space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-full font-medium text-sm">
                                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                                    Step Two
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900">Install Extension</h2>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Employees install the MicroBreaks Chrome Extension and log in. It sits quietly in the browser, respecting privacy while waiting for the next scheduled break.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-slate-700">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        One-click installation
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        Privacy-first (no browsing history tracking)
                                    </li>
                                </ul>
                            </div>
                            <div className="flex-1 bg-slate-100 p-8 rounded-2xl border border-slate-200 aspect-video flex items-center justify-center">
                                <Download className="w-24 h-24 text-purple-200" />
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1 space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-full font-medium text-sm">
                                    <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                                    Step Three
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900">Active Breaks</h2>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Every 2 hours (customizable), a gentle notification appears. The side panel opens with a guided 2-minute stretching routine.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-slate-700">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        Smart notifications
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        Guided HD videos
                                    </li>
                                </ul>
                            </div>
                            <div className="flex-1 bg-slate-100 p-8 rounded-2xl border border-slate-200 aspect-video flex items-center justify-center">
                                <Activity className="w-24 h-24 text-orange-200" />
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
