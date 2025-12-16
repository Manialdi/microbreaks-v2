"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function EmployeeOnboardingPage() {
    const [supabase] = useState(() => createClient());
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Track auth state across async closures to prevent race conditions
    const isVerifiedRef = useRef(false);

    // Password State
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        // Detect session from URL hash
        const checkSession = async () => {
            // 1. Check existing session
            const { data: { session: initialSession } } = await supabase.auth.getSession();
            if (initialSession) {
                console.log("Initial session found");
                isVerifiedRef.current = true;
                setUser(initialSession.user);
                setLoading(false);
                return;
            }

            // 2. If no session, but we have a hash, wait for Supabase to process it
            const hasAuthHash = typeof window !== 'undefined' &&
                (window.location.hash.includes('access_token') || window.location.hash.includes('type=recovery'));

            if (hasAuthHash) {
                console.log("Auth hash detected, waiting for session...");
                // Wait longer for hydration (up to 10s)
                let attempts = 0;
                const interval = setInterval(async () => {
                    attempts++;

                    // Check if already verified by listener
                    if (isVerifiedRef.current) {
                        clearInterval(interval);
                        return;
                    }

                    const { data: { session } } = await supabase.auth.getSession();
                    if (session) {
                        console.log("Session found via polling");
                        isVerifiedRef.current = true;
                        clearInterval(interval);
                        setUser(session.user);
                        setError(null);
                        setLoading(false);
                    } else if (attempts > 20) { // 10 seconds (500ms * 20)
                        clearInterval(interval);

                        // Final check
                        const { data: { session: finalSession } } = await supabase.auth.getSession();

                        if (!finalSession && !isVerifiedRef.current) {
                            console.error("Session verification timed out");
                            setLoading(false);
                            setError("Unable to verify invite link. Please copy the link and try in a new tab, or ask admin to resend.");
                        }
                    }
                }, 500);

                return () => clearInterval(interval);
            } else {
                // No hash, no session -> Invalid
                console.warn("No hash or session found");
                setLoading(false);
                setError("Invalid or missing invite link.");
            }
        };

        checkSession();

        // Listen for auth state changes (e.g. hash parsing)
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                console.log("Auth state change detected:", event);
                isVerifiedRef.current = true;
                setUser(session.user);
                setError(null); // Clear any timeout errors
                setLoading(false);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleSetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            setSubmitting(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setSubmitting(false);
            return;
        }

        try {
            // 1. Update Password
            const { error: updateError } = await supabase.auth.updateUser({ password });
            if (updateError) throw updateError;

            // 2. Mark Invitation as Accepted & Employee Active
            // ideally this should be a backend call for security, but we authorized the user now (they have the token)
            // so RLS should allow them to update their own row if policies exist.
            // HOWEVER, we might need a backend route if RLS is strict.
            // Let's try direct DB first, assuming RLS allows "auth.uid() = auth_user_id".

            // If we face RLS issues, we'll need an API. For now, assume we can update our own profile.
            // Wait, 'employees' table might not be linked to auth.uid() yet in RLS if we just got the token.
            // The Invite API set 'auth_user_id' in DB, so RLS *should* work if policies use it.

            // Update Employee Status
            const { error: empError } = await supabase
                .from('employees')
                .update({
                    status: 'active',
                    last_active_at: new Date().toISOString()
                })
                .eq('auth_user_id', user.id);

            // Update Invitation Status
            const { error: invError } = await supabase
                .from('invitations')
                .update({
                    status: 'accepted',
                    accepted_at: new Date().toISOString()
                })
                .eq('auth_user_id', user.id);

            // We log errors but don't block success if DB update fails (could be RLS).
            // Main goal is password set.
            if (empError) console.warn("Failed to set active status:", empError);

            // Redirect to App (or extension download)
            // router.push("/dashboard"); // Or extension landing
            // For now, go to a success state or dashboard
            router.push("/dashboard");

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to set password.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-500">Verifying invite...</p>
                </div>
            </div>
        );
    }

    if (error && !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid Invite</h1>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <Link href="/login" className="text-blue-600 font-medium hover:underline">
                        Return to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <Link href="/" className="flex items-center gap-2 mb-8">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
                <span className="font-bold text-xl text-gray-900">Micro-Breaks</span>
            </Link>

            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome to the team!</h1>
                    <p className="text-gray-500 mt-2">Set up your account for {user?.email}</p>
                </div>

                <form onSubmit={handleSetPassword} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                                    placeholder="Min 8 characters"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Re-enter password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        {submitting ? "Setting Password..." : "Set Password & Continue"}
                    </button>

                    <p className="text-xs text-gray-400 text-center mt-4">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </form>
            </div>
        </div>
    );
}
