"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Loader2, ShieldCheck, ArrowRight } from "lucide-react";

function VerifyInviteContent() {
    const searchParams = useSearchParams();
    const target = searchParams.get("target");
    const [isValid, setIsValid] = useState(false);
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        if (target) {
            // Simple validation to ensure we have a link
            setIsValid(true);
        }
    }, [target]);

    const handleContinue = () => {
        if (!target) return;
        setRedirecting(true);
        window.location.href = target;
    };

    if (!target) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center max-w-md">
                    <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid Verification Link</h1>
                    <p className="text-gray-500">The link you followed appears to be incomplete.</p>
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
                    To keep your account secure and prevent link expiration, please click the button below to continue.
                </p>

                <button
                    onClick={handleContinue}
                    disabled={redirecting || !isValid}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {redirecting ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Verifying...
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
