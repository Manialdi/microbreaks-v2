"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown } from "lucide-react"

export function MarketingHeader() {
    return (
        <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
            <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                {/* Left: Logo */}
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

                {/* Center: Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {/* Product Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center space-x-1 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors py-2">
                            <span>Product</span>
                            <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                        </button>
                        <div className="absolute top-full left-0 w-56 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                            <div className="bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden py-1">
                                <Link href="#" className="block px-4 py-2.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50">How it works</Link>
                                <Link href="#" className="block px-4 py-2.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50">Chrome Extension</Link>
                                <Link href="#" className="block px-4 py-2.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50">2-Minute Exercises</Link>
                                <Link href="#" className="block px-4 py-2.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50">HR Dashboard</Link>
                            </div>
                        </div>
                    </div>

                    {/* Solutions Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center space-x-1 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors py-2">
                            <span>Solutions</span>
                            <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                        </button>
                        <div className="absolute top-full left-0 w-56 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                            <div className="bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden py-1">
                                <Link href="#" className="block px-4 py-2.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50">For HR Teams</Link>
                                <Link href="#" className="block px-4 py-2.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50">For People Leaders</Link>
                                <Link href="#" className="block px-4 py-2.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50">For Employees</Link>
                                <Link href="#" className="block px-4 py-2.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50">For Remote Teams</Link>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                        Pricing
                    </Link>

                    {/* Resources Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center space-x-1 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors py-2">
                            <span>Resources</span>
                            <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                        </button>
                        <div className="absolute top-full left-0 w-56 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                            <div className="bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden py-1">
                                <Link href="#" className="block px-4 py-2.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50">Blog</Link>
                                <Link href="#" className="block px-4 py-2.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50">Science Behind Microbreaks</Link>
                                <Link href="#" className="block px-4 py-2.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50">Wellness Guides</Link>
                                <Link href="#" className="block px-4 py-2.5 text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50">Research & Case Studies</Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Right: Auth Links */}
                <div className="flex items-center space-x-6">
                    <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                        HR Portal
                    </Link>
                    <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                        Employee Login
                    </Link>
                </div>
            </div>
        </header>
    )
}
