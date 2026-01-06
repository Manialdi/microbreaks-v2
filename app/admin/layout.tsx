import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        // Redirect unauthenticated users to login
        redirect("/login");
    }

    // Security Check: Ensure user is an admin
    // We read from the ADMIN_EMAILS environment variable
    const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()) || [];

    if (!user.email || !adminEmails.includes(user.email)) {
        // If logged in but not an admin, redirect to home
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
                    <h1 className="font-bold text-slate-800 text-lg">Admin Dashboard</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{user.email}</div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto p-8">
                {children}
            </main>
        </div>
    );
}
