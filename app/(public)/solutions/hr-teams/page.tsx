import Link from "next/link";
import { Check } from "lucide-react";

export default function HRTeamsPage() {
    return (
        <div className="bg-white">
            <section className="py-20 container mx-auto px-4 text-center">
                <span className="text-blue-600 font-bold tracking-wide uppercase text-sm">For HR Teams</span>
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mt-4 mb-6">
                    Reduce Burnout. <br /> Retain Top Talent.
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                    Wellness isn't just a perk—it's a retention strategy. MicroBreaks gives you a tangible, low-effort way to show you care about employee health.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link href="/hr/signup" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                        Start Pilot Program
                    </Link>
                </div>
            </section>

            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Turnkey Implementation</h3>
                            <p className="text-slate-600 mb-4">No IT integration required. Just a Chrome Extension.</p>
                            <ul className="space-y-2">
                                <li className="flex gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-green-500" /> Deploys in minutes</li>
                                <li className="flex gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-green-500" /> SOC2 Compliant (Soon)</li>
                            </ul>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Measurable ROI</h3>
                            <p className="text-slate-600 mb-4">Track usage and correlate it with productivity and sick leave reduction.</p>
                            <ul className="space-y-2">
                                <li className="flex gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-green-500" /> Weekly reports</li>
                                <li className="flex gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-green-500" /> Engagement metrics</li>
                            </ul>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Visible Care</h3>
                            <p className="text-slate-600 mb-4">A branded experience that reminds employees daily that their company values them.</p>
                            <ul className="space-y-2">
                                <li className="flex gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-green-500" /> Custom branding available</li>
                                <li className="flex gap-2 text-sm text-slate-600"><Check className="w-4 h-4 text-green-500" /> Positive reinforcement</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
