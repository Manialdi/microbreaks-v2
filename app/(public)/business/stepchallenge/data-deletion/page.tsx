import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Data Deletion Request - Micro-Breaks StepChallenge',
    description: 'Submit your request for data deletion for the StepChallenge application.',
};

export default function StepChallengeDataDeletionPage() {
    return (
        <div className="bg-white min-h-screen py-16 lg:py-24">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="mb-8">
                    <Link
                        href="/business/stepchallenge/privacy"
                        className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Privacy Policy
                    </Link>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                            <Trash2 size={24} />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                            Data Deletion Reference
                        </h1>
                    </div>
                    <p className="text-lg text-slate-600">
                        Micro-Breaks StepChallenge
                    </p>
                </div>

                <div className="prose prose-slate max-w-none text-slate-600 bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <p className="lead font-medium text-slate-900">
                        Users may request deletion of their StepChallenge data at any time.
                    </p>

                    <p>
                        To request deletion, please email us directly:
                    </p>

                    <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm my-6">
                        <div className="font-mono text-blue-600 bg-blue-50 inline-block px-3 py-1 rounded text-lg font-semibold mb-4">
                            <a href="mailto:support@micro-breaks.com">support@micro-breaks.com</a>
                        </div>
                        <p className="text-sm text-slate-500 mb-2">Subject Line:</p>
                        <p className="font-medium text-slate-800">“StepChallenge Data Deletion Request”</p>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mt-6">Please include the following in your email:</h3>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>Your full name</li>
                        <li>Your organization or challenge name</li>
                        <li>The email address associated with your account</li>
                    </ul>

                    <h3 className="text-lg font-bold text-slate-900 mt-8">Upon verification, we will permanently delete:</h3>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>Your name and challenge participation profile</li>
                        <li>Your historical step count records</li>
                        <li>Your leaderboard rankings</li>
                    </ul>

                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <p className="text-sm italic text-slate-500">
                            Data deletion requests are processed within 30 days. Some anonymized, aggregated data may be retained for analytics and reporting purposes only.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
