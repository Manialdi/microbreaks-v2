import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Privacy Policy - Micro-Breaks StepChallenge',
    description: 'Privacy policy for the Micro-Breaks StepChallenge application.',
};

export default function StepChallengePrivacyPage() {
    return (
        <div className="bg-white min-h-screen py-16 lg:py-24">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="mb-8">
                    <Link
                        href="/business/stepchallenge"
                        className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Challenge
                    </Link>
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                        Privacy Policy – StepChallenge (Micro-Breaks)
                    </h1>
                    <p className="text-slate-500">Last updated: February 2026</p>
                </div>

                <div className="prose prose-slate max-w-none text-slate-600">
                    <p>
                        StepChallenge is a corporate wellness application operated by Micro-Breaks (“we”, “our”, “us”). This Privacy Policy explains how we collect, use, and protect information when you use the StepChallenge mobile application and related services.
                    </p>

                    <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Information We Collect</h2>

                    <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-2">a. Account Information</h3>
                    <p>When you join a challenge, we may collect:</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>Name or display name</li>
                        <li>Email address</li>
                        <li>Organization or team identifier</li>
                        <li>Challenge participation details</li>
                    </ul>
                    <p className="mt-2">This information is used solely to identify participants within a challenge.</p>

                    <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-2">b. Health & Fitness Data (Step Count Only)</h3>
                    <p>With your explicit permission, StepChallenge may access:</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>Daily step count from:
                            <ul className="list-circle pl-5 mt-1">
                                <li>Apple Health (iOS)</li>
                                <li>Health Connect or Google Fit (Android)</li>
                            </ul>
                        </li>
                    </ul>

                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6">
                        <h4 className="font-bold text-amber-800 mb-2">⚠️ Important:</h4>
                        <p className="text-amber-700">We only read aggregated daily step counts.</p>
                        <p className="text-amber-700 mt-2">We <strong>do not</strong> access:</p>
                        <ul className="list-disc pl-5 mt-1 text-amber-700">
                            <li>Heart rate</li>
                            <li>Location</li>
                            <li>Medical records</li>
                            <li>Calories, sleep, or other health metrics</li>
                        </ul>
                        <p className="text-amber-700 mt-2">We cannot modify your health data.</p>
                    </div>

                    <p>Health data access is optional and can be revoked at any time through your device settings.</p>

                    <h3 className="text-lg font-semibold text-slate-800 mt-6 mb-2">c. Usage Data</h3>
                    <p>We may collect basic app usage information such as:</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>App launches</li>
                        <li>Feature usage (e.g., leaderboard view)</li>
                    </ul>
                    <p className="mt-2">This data is used to improve app performance and reliability.</p>

                    <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. How We Use Information</h2>
                    <p>We use collected information to:</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>Track progress in step challenges</li>
                        <li>Display leaderboards and rankings</li>
                        <li>Ensure fair participation</li>
                        <li>Provide challenge summaries</li>
                        <li>Improve the app experience</li>
                    </ul>
                    <p className="mt-2">We do not use health or personal data for advertising.</p>

                    <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Data Sharing</h2>
                    <p>We do not sell, rent, or share your personal or health data with third parties.</p>
                    <p className="mt-2">Data may be visible only within your organization’s challenge, such as:</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>Your name (or alias)</li>
                        <li>Step totals</li>
                        <li>Rank on the leaderboard</li>
                    </ul>
                    <p className="mt-2">No data is shared outside your organization.</p>

                    <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Data Storage & Security</h2>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>Step counts are stored securely in our backend systems</li>
                        <li>We store only daily step totals, not raw sensor data</li>
                        <li>Access is protected using authentication and role-based controls</li>
                        <li>We follow industry-standard practices to protect your information</li>
                    </ul>

                    <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. User Control & Consent</h2>
                    <p>You are always in control:</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>Health access is opt-in</li>
                        <li>You can disconnect Apple Health / Google Fit at any time</li>
                        <li>You may request deletion of your account data by contacting us</li>
                    </ul>
                    <p className="mt-2">Disconnecting health access will stop step syncing immediately.</p>

                    <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">6. Children’s Privacy</h2>
                    <p>StepChallenge is intended for workplace and adult use.</p>
                    <p>We do not knowingly collect data from children under 13.</p>

                    <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">7. Changes to This Policy</h2>
                    <p>We may update this Privacy Policy from time to time.</p>
                    <p>Any changes will be reflected on this page with an updated date.</p>

                    <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">8. Contact Us</h2>
                    <p>If you have questions about this Privacy Policy or your data, contact us at:</p>
                    <p className="mt-4">
                        <a href="mailto:support@micro-breaks.com" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                            support@micro-breaks.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
