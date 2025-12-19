"use client";

import Link from "next/link";
import { CheckCircle, Download, Monitor, Heart, Coffee } from "lucide-react";

export default function IndividualPage() {
    return (
        <div className="bg-gradient-to-b from-blue-50/50 to-white min-h-screen">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16 lg:py-24 text-center">
                <div className="max-w-3xl mx-auto space-y-6">
                    <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold tracking-wide">
                        FOR INDIVIDUALS
                    </span>
                    <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Your personal wellness coach, <br />
                        <span className="text-blue-600">right in your browser.</span>
                    </h1>
                    <p className="text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Don't wait for your company to sign up. Take control of your health with the same science-backed micro-breaks used by top teams.
                    </p>

                    <div className="pt-8 flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="https://chromewebstore.google.com/detail/micro-breaks/..."
                            target="_blank"
                            className="inline-flex justify-center items-center px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95 text-base gap-2"
                        >
                            <Download size={20} />
                            Get Extension for Free
                        </Link>
                    </div>
                    <p className="text-sm text-slate-500 mt-4">
                        Forever free for individual use. No credit card required.
                    </p>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="bg-white py-16 lg:py-24 border-t border-slate-100">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                                <Monitor size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">Prevent Computer Strain</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Staring at a screen all day causes digital eye strain and headaches. Our 20-20-20 rule reminders keep your vision sharp.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                                <Heart size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">Protect Your Long-term Health</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Sitting is the new smoking. Regular movement breaks reduce the risk of back pain, RSI, and metabolic issues.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
                                <Coffee size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">Boost Your Focus</h3>
                            <p className="text-slate-600 leading-relaxed">
                                It sounds counterintuitive, but taking breaks actually helps you get more done. Reset your attention span every hour.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                                <CheckCircle size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">Zero Disruptions</h3>
                            <p className="text-slate-600 leading-relaxed">
                                We know you're busy. That's why our reminders are non-intrusive and easy to snooze if you're in the zone.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
