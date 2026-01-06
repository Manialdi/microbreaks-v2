"use client";

import { CheckCircle, Download } from "lucide-react";
import Link from "next/link";
import { Chrome } from "lucide-react";

export default function WelcomeEmployeePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center text-white">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Account Activated!</h1>
                    <p className="text-blue-100 text-lg">You are now ready to start your wellness journey.</p>
                </div>

                <div className="p-8 text-center space-y-8">
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            MicroBreaks works directly in your browser to help you stay healthy and productive.
                            To get started, please install our Chrome Extension.
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-3 bg-white rounded-full shadow-sm">
                                <Chrome className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Install Chrome Extension</h3>
                            <a
                                href="https://chromewebstore.google.com/detail/microbreaks-wellness-for/dbpdhgpjaomegmniibjpdhbgandkecbk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95"
                            >
                                <Download className="h-5 w-5" />
                                Add to Chrome
                            </a>
                        </div>
                    </div>

                    <p className="text-xs text-gray-400">
                        Once installed, click the extension icon and log in with your email and the password you just created.
                    </p>
                </div>
            </div>
        </div>
    );
}
