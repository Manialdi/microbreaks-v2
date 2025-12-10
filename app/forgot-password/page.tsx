"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsSubmitting(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/account/update-password`,
            });

            if (error) {
                throw error;
            }

            setSuccess("Check your email for the password reset link.");
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm border">
                <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
                <p className="text-sm text-gray-600 mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

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
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none w-full"
                            placeholder="you@example.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-medium w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Sending Link..." : "Send Reset Link"}
                    </button>

                    <div className="text-center mt-2">
                        <Link
                            href="/login"
                            className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                        >
                            Back to Log in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
