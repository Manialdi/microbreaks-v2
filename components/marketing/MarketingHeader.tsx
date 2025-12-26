"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ChevronDown } from "lucide-react"

export function MarketingHeader() {
    const pathname = usePathname();
    const isIndividual = pathname?.startsWith('/individual');
    const isGateway = pathname === '/';

    return (
        <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
            <div className="container mx-auto px-4 h-32 flex justify-between items-center">
                {/* Left: Logo */}
                <Link href="/" className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gray-200">
                        <Image
                            src="/logo.jpg"
                            alt="Micro-breaks Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="font-bold text-3xl tracking-tight text-gray-900">Micro-breaks</span>
                </Link>

                {/* Center Navigation */}
                <nav className="hidden md:flex items-center space-x-12">
                    {/* Gateway State: Simple Links */}
                    {isGateway && (
                        <>
                            <Link href="/business" className="text-lg font-medium text-slate-600 hover:text-blue-600 transition-colors">
                                Business
                            </Link>
                            <Link href="/individual" className="text-lg font-medium text-slate-600 hover:text-blue-600 transition-colors">
                                Individual
                            </Link>
                        </>
                    )}

                    {/* Business/Default State */}
                    {!isGateway && !isIndividual && (
                        <>
                            {/* Product Dropdown */}
                            <div className="relative group">
                                <button className="flex items-center space-x-2 text-lg font-medium text-slate-600 hover:text-blue-600 transition-colors py-4">
                                    <span>Product</span>
                                    <ChevronDown size={20} className="group-hover:rotate-180 transition-transform duration-200" />
                                </button>
                                <div className="absolute top-full left-0 w-64 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                    <div className="bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden py-2">
                                        <Link href="/product/how-it-works" className="block px-6 py-4 text-base text-slate-600 hover:text-blue-600 hover:bg-slate-50">How it works</Link>
                                        <Link href="/product/extension" className="block px-6 py-4 text-base text-slate-600 hover:text-blue-600 hover:bg-slate-50">Chrome Extension</Link>
                                        <Link href="/product/exercises" className="block px-6 py-4 text-base text-slate-600 hover:text-blue-600 hover:bg-slate-50">2-Minute Exercises</Link>
                                        <Link href="/product/hr-dashboard" className="block px-6 py-4 text-base text-slate-600 hover:text-blue-600 hover:bg-slate-50">HR Dashboard</Link>
                                    </div>
                                </div>
                            </div>
                            <Link href="/solutions" className="text-lg font-medium text-slate-600 hover:text-blue-600 transition-colors">
                                Solutions
                            </Link>
                            <Link href="/pricing" className="text-lg font-medium text-slate-600 hover:text-blue-600 transition-colors">
                                Pricing
                            </Link>
                        </>
                    )}

                    {/* Individual State */}
                    {isIndividual && (
                        <>
                            <Link href="/individual/pricing" className="text-lg font-medium text-slate-600 hover:text-blue-600 transition-colors">Pricing</Link>
                            <Link href="/individual/terms" className="text-lg font-medium text-slate-600 hover:text-blue-600 transition-colors">Terms</Link>
                            <Link href="/individual/privacy" className="text-lg font-medium text-slate-600 hover:text-blue-600 transition-colors">Privacy</Link>
                            <Link href="/individual/refund-policy" className="text-lg font-medium text-slate-600 hover:text-blue-600 transition-colors">Refund policy</Link>
                        </>
                    )}
                </nav>

                {/* Right Navigation */}
                <div className="flex items-center space-x-8">
                    {/* Business/Default State: HR Actions */}
                    {!isGateway && !isIndividual && (
                        <div className="relative group">
                            <button className="flex items-center space-x-2 text-lg font-medium text-slate-600 hover:text-blue-600 transition-colors py-4">
                                <span>Business</span>
                                <ChevronDown size={20} className="group-hover:rotate-180 transition-transform duration-200" />
                            </button>
                            <div className="absolute top-full right-0 w-56 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                <div className="bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden py-2">
                                    <Link href="/login" className="block px-6 py-4 text-base text-slate-600 hover:text-blue-600 hover:bg-slate-50">HR Portal</Link>
                                    <Link href="/hr/signup" className="block px-6 py-4 text-base text-slate-600 hover:text-blue-600 hover:bg-slate-50">Create Account</Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Individual State: Help */}
                    {isIndividual && (
                        <Link href="/individual/help" className="text-lg font-medium text-slate-600 hover:text-blue-600 transition-colors">
                            Help
                        </Link>
                    )}

                    {/* Gateway State: Empty Right Side (Or Optional Login) */}
                    {isGateway && null}

                    {/* Link to Swap Contexts (Visible on non-gateway pages) */}
                    {!isGateway && (
                        <Link
                            href={isIndividual ? "/business" : "/individual"}
                            className="text-lg font-medium text-slate-600 hover:text-blue-600 transition-colors"
                        >
                            {isIndividual ? "Business" : "Individual"}
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
