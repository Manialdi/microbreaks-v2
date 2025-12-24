
import Link from "next/link"
import { MarketingHeader } from "@/components/marketing/MarketingHeader"

export default function IndividualLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <MarketingHeader />
            <main className="flex-1 pt-24">
                {children}
            </main>
            <footer className="bg-slate-50 border-t border-slate-200 py-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-slate-400 text-sm">
                        © 2025 Micro Breaks. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
