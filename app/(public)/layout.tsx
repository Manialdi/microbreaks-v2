
import Link from "next/link"
import { MarketingHeader } from "@/components/marketing/MarketingHeader"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Micro-Breaks — 2-Minute Wellness for Teams",
    description: "Boost team productivity with quick 2-minute wellness breaks. The #1 wellness tool for remote teams.",
};

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <MarketingHeader />
            <main className="flex-1 pt-32">
                {children}
            </main>
            <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                        {/* Product */}
                        <div className="flex flex-col space-y-4">
                            <h4 className="font-semibold text-slate-900">Product</h4>
                            <Link href="/product/how-it-works" className="text-slate-600 hover:text-blue-600 text-sm transition-colors">Overview</Link>
                            <Link href="/product/extension" className="text-slate-600 hover:text-blue-600 text-sm transition-colors">Chrome Extension</Link>
                            <Link href="/product/exercises" className="text-slate-600 hover:text-blue-600 text-sm transition-colors">Exercise Library</Link>
                            <Link href="/product/hr-dashboard" className="text-slate-600 hover:text-blue-600 text-sm transition-colors">HR Dashboard</Link>
                        </div>

                        {/* Solutions */}
                        <div className="flex flex-col space-y-4">
                            <h4 className="font-semibold text-slate-900">Solutions</h4>
                            <Link href="/solutions" className="text-slate-600 hover:text-blue-600 text-sm transition-colors">All Solutions</Link>
                        </div>

                        {/* Company */}
                        <div className="flex flex-col space-y-4">
                            <h4 className="font-semibold text-slate-900">Company</h4>
                            <Link href="/contact" className="text-slate-600 hover:text-blue-600 text-sm transition-colors">Contact</Link>
                        </div>



                        {/* Legal */}
                        <div className="flex flex-col space-y-4">
                            <h4 className="font-semibold text-slate-900">Legal</h4>
                            <Link href="/privacy" className="text-slate-600 hover:text-blue-600 text-sm transition-colors">Privacy</Link>
                            <Link href="#" className="text-slate-600 hover:text-blue-600 text-sm transition-colors">Terms</Link>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-200 text-center md:text-left">
                        <p className="text-slate-400 text-sm">
                            © 2025 Micro Breaks. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

