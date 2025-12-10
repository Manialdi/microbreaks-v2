"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const personalDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "protonmail.com",
    "icloud.com",
    "aol.com",
    "live.com",
    "msn.com"
];

export default function HRSignupPage() {
    const router = useRouter();

    // State
    const [fullName, setFullName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [workEmail, setWorkEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsSubmitting(true);

        // Validation
        if (!fullName || !companyName || !workEmail || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            setIsSubmitting(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setIsSubmitting(false);
            return;
        }

        // Email domain validation
        const domain = workEmail.split("@")[1]?.toLowerCase();
        if (!domain || personalDomains.includes(domain)) {
            setError("Please use your company email (not a personal Gmail/Yahoo address).");
            setIsSubmitting(false);
            return;
        }

        // Supabase auth signup
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
            email: workEmail,
            password,
        });

        if (signupError || !signupData.user) {
            setError(signupError?.message ?? "Could not create account.");
            setIsSubmitting(false);
            return;
        }

        const user = signupData.user;

        // Insert company
        const { data: company, error: companyError } = await supabase
            .from("companies")
            .insert({ name: companyName })
            .select()
            .single();

        if (companyError || !company) {
            setError(companyError?.message ?? "Could not create company.");
            setIsSubmitting(false);
            return;
        }

        // Insert profile
        const { error: profileError } = await supabase.from("profiles").insert({
            id: user.id,
            company_id: company.id,
            full_name: fullName,
            role: "hr",
            status: "active",
        });

        if (profileError) {
            setError(profileError.message);
            setIsSubmitting(false);
            return;
        }

        // Success
        setSuccess("Account created successfully. Redirecting...");
        setError(null);
        setIsSubmitting(false);

        setTimeout(() => {
            router.push("/hr/onboarding");
        }, 1000);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm border">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Create your HR account</h1>
                    <p className="text-sm text-gray-500">Set up micro-breaks for your company in under 2 minutes.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700" htmlFor="fullName">Full Name</label>
                        <input
                            id="fullName"
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none w-full"
                            placeholder="Jane Doe"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700" htmlFor="companyName">Company Name</label>
                        <input
                            id="companyName"
                            type="text"
                            required
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none w-full"
                            placeholder="Acme Corp"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700" htmlFor="workEmail">Work Email</label>
                        <input
                            id="workEmail"
                            type="email"
                            required
                            value={workEmail}
                            onChange={(e) => setWorkEmail(e.target.value)}
                            className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none w-full"
                            placeholder="jane@company.com"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700" htmlFor="password">Create Password</label>
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
                        <label className="text-sm font-medium text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
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

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-green-50 text-green-600 text-sm rounded border border-green-100">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-medium w-full disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 hover:text-blue-700 hover:underline">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}
