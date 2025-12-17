import { Check } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
    return (
        <div className="bg-white py-24">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Simple, Transparent Pricing</h1>
                    <p className="text-xl text-slate-600">Invest in your team's health for less than the cost of a coffee per employee.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Free Tier */}
                    <div className="p-8 rounded-2xl border border-slate-200 bg-white">
                        <h3 className="font-bold text-xl text-slate-900 mb-2">Starter</h3>
                        <div className="text-4xl font-bold text-slate-900 mb-6">$0 <span className="text-base text-slate-500 font-normal">/mo</span></div>
                        <p className="text-slate-600 mb-6 text-sm">Perfect for small teams trying out wellness.</p>
                        <Link href="/hr/signup" className="block w-full py-3 px-4 bg-slate-100 text-slate-900 font-bold text-center rounded-xl hover:bg-slate-200 transition mb-8">
                            Start Free
                        </Link>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-sm text-slate-700">
                                <Check className="w-5 h-5 text-green-500 shrink-0" /> Up to 5 Employees
                            </li>
                            <li className="flex gap-3 text-sm text-slate-700">
                                <Check className="w-5 h-5 text-green-500 shrink-0" /> Basic Animations
                            </li>
                            <li className="flex gap-3 text-sm text-slate-700">
                                <Check className="w-5 h-5 text-green-500 shrink-0" /> 7-Day History
                            </li>
                        </ul>
                    </div>

                    {/* Pro Tier */}
                    <div className="p-8 rounded-2xl border-2 border-blue-600 bg-white relative shadow-xl transform md:-translate-y-4">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">Most Popular</div>
                        <h3 className="font-bold text-xl text-slate-900 mb-2">Team</h3>
                        <div className="text-4xl font-bold text-slate-900 mb-6">$5 <span className="text-base text-slate-500 font-normal">/user/mo</span></div>
                        <p className="text-slate-600 mb-6 text-sm">Full power for growing organizations.</p>
                        <Link href="/hr/signup" className="block w-full py-3 px-4 bg-blue-600 text-white font-bold text-center rounded-xl hover:bg-blue-700 transition mb-8 shadow-lg shadow-blue-200">
                            Start Trial
                        </Link>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-sm text-slate-700">
                                <Check className="w-5 h-5 text-blue-500 shrink-0" /> Unlimited Employees
                            </li>
                            <li className="flex gap-3 text-sm text-slate-700">
                                <Check className="w-5 h-5 text-blue-500 shrink-0" /> Full HD Video Library
                            </li>
                            <li className="flex gap-3 text-sm text-slate-700">
                                <Check className="w-5 h-5 text-blue-500 shrink-0" /> Advanced Analytics
                            </li>
                            <li className="flex gap-3 text-sm text-slate-700">
                                <Check className="w-5 h-5 text-blue-500 shrink-0" /> Priority Support
                            </li>
                        </ul>
                    </div>

                    {/* Enterprise Tier */}
                    <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50">
                        <h3 className="font-bold text-xl text-slate-900 mb-2">Enterprise</h3>
                        <div className="text-4xl font-bold text-slate-900 mb-6">Custom</div>
                        <p className="text-slate-600 mb-6 text-sm">Security and control for large orgs.</p>
                        <Link href="/contact" className="block w-full py-3 px-4 bg-white border border-slate-300 text-slate-900 font-bold text-center rounded-xl hover:bg-slate-50 transition mb-8">
                            Contact Sales
                        </Link>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-sm text-slate-700">
                                <Check className="w-5 h-5 text-slate-500 shrink-0" /> SSO & SAML
                            </li>
                            <li className="flex gap-3 text-sm text-slate-700">
                                <Check className="w-5 h-5 text-slate-500 shrink-0" /> Custom Branding
                            </li>
                            <li className="flex gap-3 text-sm text-slate-700">
                                <Check className="w-5 h-5 text-slate-500 shrink-0" /> Dedicated Account Manager
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
}
