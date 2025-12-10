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
    const [fullName, setFullName] = useState("");
    const [workEmail, setWorkEmail] = useState("");
    const [password, setPassword] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsSubmitting(true);

        // Email domain validation
        const domain = workEmail.split("@")[1]?.toLowerCase();
        if (!domain || personalDomains.includes(domain)) {
            setError("Please use your company email address.");
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-[480px]">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Create your HR account</h1>
                    <p className="text-slate-600">Set up micro-breaks for your company in under 2 minutes.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="fullName">Full Name</label>
                        <input
                            id="fullName"
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Jane Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="workEmail">Work Email</label>
                        <input
                            id="workEmail"
                            type="email"
                            required
                            value={workEmail}
                            onChange={(e) => setWorkEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="jane@company.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="companyName">Company Name</label>
                        <input
                            id="companyName"
                            type="text"
                            required
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Acme Corp"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <Link href="/hr/login" className="text-slate-600 hover:text-blue-600 transition-colors">
                        Already have an account? HR Portal
                    </Link>
                </div>
            </div>
        </div>
    );
}
