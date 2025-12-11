
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Left: Logo & Brand */}
                        <div className="flex items-center">
                            <Link href="/dashboard" className="flex-shrink-0 flex items-center gap-2">
                                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
                                <span className="font-bold text-xl text-gray-900">Micro-Breaks</span>
                            </Link>

                            {/* Desktop Nav Items */}
                            <div className="hidden md:ml-10 md:flex md:space-x-8">
                                <Link href="/dashboard" className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Dashboard
                                </Link>
                                <Link href="/invite" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Employees
                                </Link>
                                <Link href="/analytics" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Analytics
                                </Link>
                                <Link href="/settings" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                    Settings
                                </Link>
                            </div>
                        </div>

                        {/* Right: User & Actions */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500 hidden sm:block">{user.email}</span>
                            <form action="/auth/signout" method="post">
                                <button className="text-sm font-medium text-gray-700 hover:text-red-600 transition">Log Out</button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    )
}
