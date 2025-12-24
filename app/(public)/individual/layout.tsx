import Link from "next/link"

export default function IndividualLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-white">

            <main className="flex-1 pt-32">
                {children}
            </main>
            <footer className="bg-slate-50 border-t border-slate-200 pt-12 pb-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* Logo & Copyright */}
                        <div className="text-center md:text-left">
                            <h4 className="font-bold text-slate-900 text-lg mb-1">Micro-breaks</h4>
                            <p className="text-slate-500 text-sm">
                                © 2025 Micro Breaks. All rights reserved.
                            </p>
                        </div>

                        {/* Individual Links ONLY */}
                        <div className="flex flex-wrap justify-center gap-6">
                            <Link href="/individual/pricing" className="text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors">Pricing</Link>
                            <Link href="/individual/terms" className="text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors">Terms of Service</Link>
                            <Link href="/individual/privacy" className="text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors">Privacy Policy</Link>
                            <Link href="/individual/refund-policy" className="text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors">Refund Policy</Link>
                            <Link href="/individual/help" className="text-slate-600 hover:text-blue-600 text-sm font-medium transition-colors">Help</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
