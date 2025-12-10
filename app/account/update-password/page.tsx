"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function UpdatePasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Ideally verify that the user is authenticated (via the reset link)
    // But supabase client handles the session automatically if the link worked.

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsSubmitting(true);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setIsSubmitting(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) {
                throw error;
            }

            setSuccess("Password updated successfully. Redirecting to dashboard...");
            setTimeout(() => {
                router.push("/dashboard"); // or /login
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm border">
                <h1 className="text-2xl font-bold mb-6">Update Password</h1>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100 mb-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-3 bg-green-50 text-green-600 text-sm rounded border border-green-100 mb-4">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none w-full"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none w-full"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-medium w-full disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {isSubmitting ? "Updating Password..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
