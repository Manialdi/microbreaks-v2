
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
            <footer className="border-t border-gray-100 py-8">
                <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
                    © {new Date().getFullYear()} Microbreaks Inc. All rights reserved.
                </div>
            </footer>
        </div>
    )
}

