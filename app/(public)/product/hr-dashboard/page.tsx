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
                    <div className="relative mx-auto max-w-5xl rounded-t-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-800 aspect-[16/10] flex items-center justify-center">
                        <span className="text-slate-500">Dashboard UI Screenshot</span>
                    </div>
                </div>
            </section>

            <section className="py-24">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div>
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                                <BarChart className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Engagement Analytics</h3>
                            <p className="text-slate-600">See exactly how many breaks are being taken. View trends over weeks and months to ensure adoption.</p>
                        </div>
                        <div>
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Team Management</h3>
                            <p className="text-slate-600">Easily add, remove, or groups employees. Bulk invite support makes onboarding thousands of users a breeze.</p>
                        </div>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 aspect-square flex items-center justify-center">
                        <PieChart className="w-32 h-32 text-slate-300" />
                    </div>
                </div>
            </section>
        </div>
    );
}
