
import Image from "next/image"
import Link from "next/link"

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-white">
            <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                            <Image
                                src="/logo.jpg"
                                alt="Micro-breaks Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-900">Micro-breaks</span>
                    </Link>
                    <nav className="flex items-center space-x-6">
                        <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                            Log in
                        </Link>
                        <Link href="/login" className="text-sm font-medium px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all shadow-sm hover:shadow-md">
                            Get Started
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="flex-1 pt-16">
                {children}
            </main>
            <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                        {/* Product */}
                        <div className="flex flex-col space-y-4">
                            <h4 className="font-semibold text-slate-900">Product</h4>
                            <Link href="#" className="text-slate-600 hover:text-blue-600 text-sm transition-colors">Overview</Link>
                            <Link href="#" className="text-slate-600 hover:text-blue-600 text-sm transition-colors">Reminders</Link>
                            <Link href="#" className="text-slate-600 hover:text-blue-600 text-sm transition-colors">Exercise Library</Link>
                            <Link href="#" className="text-slate-600 hover:text-blue-600 text-sm transition-colors">HR Dashboard</Link>
                        </div>

                        {/* Solutions */}
                        <div className="flex flex-col space-y-4">
                            <h4 className="font-semibold text-slate-900">Solutions</h4>
                            <Link href="#" className="text-slate-600 hover:text-blue-600 text-sm transition-colors">For HR Teams</Link>
                            <Link href="#" className="text-slate-600 hover:text-blue-600 text-sm transition-colors">For Employees</Link>
                            <Link href="#" className="text-slate-600 hover:text-blue-600 text-sm transition-colors">For Managers</Link>
                        </div>

                        {/* Company */}
                        <div className="flex flex-col space-y-4">
                            <h4 className="font-semibold text-slate-900">Company</h4>
                            <Link href="#" className="text-slate-600 hover:text-blue-600 text-sm transition-colors">About</Link>
                            <Link href="#" className="text-slate-600 hover:text-blue-600 text-sm transition-colors">Contact</Link>
                        </div>

                        {/* Resources */}
                        <div className="flex flex-col space-y-4">
                            <h4 className="font-semibold text-slate-900">Resources</h4>
                            <Link href="#" className="text-slate-600 hover:text-blue-600 text-sm transition-colors">Blog</Link>
                            <Link href="#" className="text-slate-600 hover:text-blue-600 text-sm transition-colors">Science Behind Microbreaks</Link>
                        </div>

                        {/* Legal */}
                        <div className="flex flex-col space-y-4">
                            <h4 className="font-semibold text-slate-900">Legal</h4>
                            <Link href="#" className="text-slate-600 hover:text-blue-600 text-sm transition-colors">Privacy</Link>
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

