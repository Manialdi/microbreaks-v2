import { Bell, Layout, Laptop, Shield, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ExtensionPage() {
    return (
        <div className="bg-white">
            <section className="py-20 container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                    A Wellness Coach in Your Browser
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12">
                    The MicroBreaks extension lives in your Chrome side panel, providing non-intrusive reminders and exercises without you ever leaving your tab.
                </p>
                <div className="relative w-full max-w-4xl mx-auto bg-slate-100 rounded-2xl border border-gray-200 shadow-2xl overflow-hidden flex items-center justify-center p-8 md:p-12">
                    <div className="relative w-full h-[500px] md:h-[600px]">
                        <Image
                            src="/images/extension-preview-new.png"
                            alt="MicroBreaks Chrome Extension Side Panel Interface"
                            fill
                            className="object-contain drop-shadow-2xl"
                        />
                    </div>
                </div>
            </section>

            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <Layout className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Seamless Side Panel</h3>
                            <p className="text-slate-600">
                                Exercises play directly in the browser side panel. No need to switch windows or lose context of your work.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                                <Bell className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Notifications</h3>
                            <p className="text-slate-600">
                                Gentle reminders nudge you when it's time for a break. Easy to snooze if you're in deep focus mode.
                            </p>
                        </div>

                        {/* Feature 3 (New) */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-6">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Lightweight & Fast</h3>
                            <p className="text-slate-600">
                                Zero lag impact on your browser. Universal compatibility with Chrome, Edge, and Brave.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Private & Secure</h3>
                            <p className="text-slate-600">
                                We don't track your browsing history. The extension only "activates" when you start a break session.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
