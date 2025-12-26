
"use client";

import Link from "next/link"
import { Users, User, ArrowRight } from "lucide-react"

export default function GatewayPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white flex items-center justify-center p-4">
            <div className="max-w-4xl w-full text-center space-y-12">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
                        Micro-breaks for <span className="text-blue-600">Everyone</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Whether you're leading a team or working solo, we have the perfect wellness tool for you.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {/* Business Card */}
                    <Link
                        href="/business"
                        className="group relative p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 text-left flex flex-col h-full"
                    >
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Users size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">For Teams & HR</h2>
                        <p className="text-slate-600 mb-8 flex-grow">
                            Boost team productivity and wellbeing with our managed enterprise platform. Includes HR dashboard and team analytics.
                        </p>
                        <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                            Explore Business <ArrowRight className="ml-2 w-5 h-5" />
                        </div>
                    </Link>

                    {/* Individual Card */}
                    <Link
                        href="/individual"
                        className="group relative p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 text-left flex flex-col h-full"
                    >
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            <User size={28} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">For Individuals</h2>
                        <p className="text-slate-600 mb-8 flex-grow">
                            Invest in your personal health. One-time payment for lifetime access to the extension and exercise library.
                        </p>
                        <div className="flex items-center text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
                            View Individual Plan <ArrowRight className="ml-2 w-5 h-5" />
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
