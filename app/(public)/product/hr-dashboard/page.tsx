import { BarChart, Users, Settings, PieChart } from "lucide-react";
import Link from "next/link";

export default function HRDashboardPage() {
    return (
        <div className="bg-white">
            <section className="pt-20 pb-12 bg-slate-900 text-white overflow-hidden">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Data-Driven Wellness
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12">
                        Measure the impact of wellness on your organization. Track engagement, identifying at-risk teams, and prove ROI.
                    </p>
                    <div className="relative mx-auto max-w-6xl mt-12">
                        {/* Scrollable Container */}
                        <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar">
                            {[
                                { src: "/dashboard-overview.png", alt: "Overview" },
                                { src: "/dashboard-analytics.png", alt: "Analytics" },
                                { src: "/dashboard-employees.png", alt: "Employees" },
                                { src: "/dashboard-settings.png", alt: "Settings" }
                            ].map((img, i) => (
                                <div key={i} className="flex-none w-[85vw] md:w-[800px] snap-center rounded-xl overflow-hidden shadow-2xl border border-slate-700">
                                    <img src={img.src} alt={img.alt} className="w-full h-auto" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <BarChart className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Engagement Analytics</h3>
                            <p className="text-slate-600 leading-relaxed">
                                See exactly how many breaks are being taken. View trends over weeks and months to ensure adoption and identify teams that might be at risk of burnout.
                            </p>
                        </div>

                        <div className="p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Team Management</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Easily add, remove, or group employees. Bulk invite support makes onboarding thousands of users a breeze. track active versus pending invites.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
