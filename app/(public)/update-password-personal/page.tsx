"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Lock, Eye, EyeOff, CheckCircle, Loader2 } from "lucide-react";

// Personal Project Credentials (Client-side Safe for Anon)
const PERSONAL_SUPABASE_URL = 'https://vnhhlyceginwmeyohafs.supabase.co';
const PERSONAL_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuaGhseWNlZ2lud21leW9oYWZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDc3ODIsImV4cCI6MjA4MDMyMzc4Mn0.2KHdSIweIpukWpBwp78X3-qqDMMEgy0Ows8R9kEN8kQ'; // WAIT - this key in prompt was for HR?? No, user gave updated keys. Checking history...

// Re-checking prompt for keys to be absolutely sure.
// User said: 
// 1. HR: wjnydegrspaxfdnptebd ... 2KHdSIweIpukWpBwp78X3-qqDMMEgy0Ows8R9kEN8kQ
// 2. Individuals: vnhhlyceginwmeyohafs ... OzTkw1jgzzShzWMxD5bzH8-s4DYctY9sYb_8LQh9j9k
//
// So I must use the 'OzTkw...' key for Personal.

const supabase = createClient(
    'https://vnhhlyceginwmeyohafs.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuaGhseWNlZ2lud21leW9oYWZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMjcyNTAsImV4cCI6MjA4MTgwMzI1MH0.OzTkw1jgzzShzWMxD5bzH8-s4DYctY9sYb_8LQh9j9k'
);

export default function UpdatePasswordPersonalPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            // Handle the implicit flow hash fragments or PKCE code exchange manually if needed, 
            // but Supabase JS client auto-detects hash fragments in the browser.
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error || !session) {
                // Try to get user directly (sometimes session is null but user is recoverable via hash)
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    // Wait a bit, sometimes hash processing takes a tick
                    setTimeout(async () => {
                        const { data: { user: retryUser } } = await supabase.auth.getUser();
                        if (retryUser) {
                            setUserEmail(retryUser.email || "User");
                            setVerifying(false);
                        } else {
                            setError("Invalid or expired session. Please check your reset link.");
                            setVerifying(false);
                        }
                    }, 1000);
                    return;
                }
                setUserEmail(user.email || "User");
            } else {
                setUserEmail(session.user.email || "User");
            }
            setVerifying(false);
        };
        checkSession();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) throw updateError;

            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center animate-fade-in-up">
                    <div className="mx-auto h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Password Updated!</h1>
                    <p className="text-gray-500 mb-8">
                        Your Personal Account password has been changed.
                    </p>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-left">
                        <h3 className="font-bold text-blue-900 mb-2">Next Steps:</h3>
                        <ol className="list-decimal pl-5 space-y-2 text-sm text-blue-800">
                            <li>Open the <strong>MicroBreaks Extension</strong>.</li>
                            <li>Log in with your new password.</li>
                        </ol>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <div className="mx-auto h-12 w-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                        <Lock className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
                    <p className="text-sm text-gray-500 mt-2">
                        For Personal Account: <span className="font-medium text-gray-900">{userEmail}</span>
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
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
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Set New Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
