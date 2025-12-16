"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Loader2, ShieldCheck, ArrowRight } from "lucide-react";

function VerifyInviteContent() {
    const searchParams = useSearchParams();
    const inviteId = searchParams.get("id"); // Now using ID
    const [isValid, setIsValid] = useState(false);
    const [redirecting, setRedirecting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (inviteId) {
            setIsValid(true);
        }
    }, [inviteId]);

    const handleContinue = async () => {
        if (!inviteId) return;
        setRedirecting(true);
        setError(null);

        try {
            // Call API to generate fresh token
            const res = await fetch('/api/verify-invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inviteId })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Verification failed");
            }

            if (data.url) {
                // Redirect to the fresh one-time link
                window.location.href = data.url;
            } else {
                throw new Error("No redirect URL received");
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message);
            setRedirecting(false);
        }
    };

    if (!inviteId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center max-w-md">
                    <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid Verification Link</h1>
                    <p className="text-gray-500">The link appears to be missing the invitation ID.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center transition-all hover:shadow-xl">

                <div className="mx-auto h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                    <ShieldCheck className="h-8 w-8" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-3">Verify Invitation</h1>
                <p className="text-gray-500 mb-8">
                    To keep your account secure, we generate a secure access token only when you are ready. Click below to continue.
                </p>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleContinue}
                    disabled={redirecting || !isValid}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {redirecting ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Securing Connection...
                        </>
                    ) : (
                        <>
                            Verify & Continue
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                <p className="text-xs text-gray-400 mt-6">
                    MicroBreaks Security Check
                </p>
            </div>
        </div>
    );
}

export default function VerifyInvitePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        }>
            <VerifyInviteContent />
        </Suspense>
    );
}
