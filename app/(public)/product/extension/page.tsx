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
                            src="/sidepanel-ui.png"
                            alt="MicroBreaks Chrome Extension Side Panel Interface"
                            fill
                            className="object-contain drop-shadow-2xl"
                        />
                    </div>
                </div>
            </section>

            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
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

                        {/* Feature 3 */}
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

            <section className="py-24 container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Lightweight & Fast</h2>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <Zap className="w-6 h-6 text-yellow-500 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-slate-900">Zero Lag</h4>
                                    <p className="text-slate-600">Optimized to have zero impact on your browser's performance or memory usage.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Laptop className="w-6 h-6 text-blue-500 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-slate-900">Universal Compatibility</h4>
                                    <p className="text-slate-600">Works on Chrome, Edge, Brave, and other Chromium-based browsers on Mac and Windows.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 bg-slate-900 p-8 rounded-2xl text-white">
                        <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
                            <span className="text-green-400">➜</span> <span className="text-blue-400">microbreaks</span> <span className="text-yellow-300">npm run build</span>{"\n"}
                            Building extension...{"\n"}
                            <span className="text-green-400">✔</span> Manifest V3 Validated{"\n"}
                            <span className="text-green-400">✔</span> Bundle size: 45KB (Gzipped){"\n"}
                            <span className="text-green-400">✔</span> Privacy check passed{"\n"}
                            {"\n"}
                            <span className="text-gray-400">Ready for deployment.</span>
                        </pre>
                    </div>
                </div>
            </section>
        </div>
    );
}
