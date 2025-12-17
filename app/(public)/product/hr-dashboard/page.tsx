```javascript
import { BarChart, Users, Settings, PieChart } from "lucide-react";
import Link from "next/link";
import DashboardCarousel from "@/components/marketing/DashboardCarousel";

export default function HRDashboardPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="bg-slate-900 pt-20 pb-0 overflow-hidden">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Data-Driven Wellness <br/>
                        <span className="text-blue-400">For Modern Teams</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12">
                        Measure the impact of wellness on your organization. Track engagement, identify at-risk teams, and prove ROI.
                    </p>
                    <div className="relative mx-auto max-w-6xl mt-12 pb-20">
                        <DashboardCarousel />
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
