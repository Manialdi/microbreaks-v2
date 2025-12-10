"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function InvitePage() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activationUrl, setActivationUrl] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setActivationUrl(null);
        setIsSubmitting(true);

        try {
            // 1. Get current user
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) throw new Error("User not authenticated");

            // 2. Get profile to find company_id
            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("company_id, id")
                .eq("id", user.id)
                .single();

            if (profileError || !profile) throw new Error("Could not fetch user profile");

            // 3. Generate Token
            const token = crypto.randomUUID();

            // 4. Insert Invitation
            const { error: insertError } = await supabase
                .from("invitations")
                .insert({
                    company_id: profile.company_id,
                    email: email,
                    role: 'employee',
                    invited_by: profile.id,
                    activation_token: token,
                });

            if (insertError) throw insertError;

            // 5. Construct URL
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
            const url = `${baseUrl}/activate?token=${token}`;
            setActivationUrl(url);

        } catch (err: any) {
            console.error("Invitation error:", err);
            setError(err.message || "Failed to create invitation");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Invite Employees</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm border max-w-xl">
                {activationUrl ? (
                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 text-green-700 rounded border border-green-100">
                            <strong>Success!</strong> Invitation created for {email}.
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Share this activation link with the employee:</p>
                            <div className="flex gap-2">
                                <code className="flex-1 p-3 bg-gray-100 rounded text-sm break-all">
                                    {activationUrl}
                                </code>
                                <button
                                    onClick={() => navigator.clipboard.writeText(activationUrl)}
                                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm font-medium transition"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setActivationUrl(null);
                                setEmail("");
                            }}
                            className="text-blue-600 hover:underline text-sm mt-4 block"
                        >
                            Invite another employee
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Employee Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="colleague@company.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-medium disabled:opacity-50"
                        >
                            {isSubmitting ? "Generating Link..." : "Generate Invite Link"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
