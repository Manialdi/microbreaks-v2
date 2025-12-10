
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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
        <div className="flex h-screen bg-gray-50">
            <aside className="w-64 bg-white border-r p-4 hidden md:block">
                <div className="font-bold text-xl mb-8">Microbreaks App</div>
                <nav className="space-y-2">
                    <a href="/dashboard" className="block px-4 py-2 bg-blue-50 text-blue-600 rounded-md">Dashboard</a>
                    <a href="/invite" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md">Invite Employees</a>
                    <a href="/settings" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md">Settings</a>
                </nav>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-end mb-8">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{user.email}</span>
                        <form action="/auth/signout" method="post">
                            <button className="text-sm text-red-600 hover:underline">Sign out</button>
                        </form>
                    </div>
                </header>
                {children}
            </main>
        </div>
    )
}
