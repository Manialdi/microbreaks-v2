
export const metadata = {
    title: "Privacy Policy - MicroBreaks Personal",
}

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
            <div className="prose prose-slate max-w-none text-slate-600">
                <p><strong>Last Updated: December 24, 2025</strong></p>

                <h3>1. Our Core Principle: Data Minimization</h3>
                <p>MicroBreaks Personal is designed to be privacy-first. We believe your health data belongs to you.</p>

                <h3>2. What We Collect</h3>
                <ul>
                    <li><strong>Account Info:</strong> Email address (for authentication and verifying Pro status).</li>
                    <li><strong>Usage Data (Local):</strong> Your break history, settings, and preferences are stored <strong>locally on your device</strong> via Chrome Storage. We do not have access to this granular data.</li>
                    <li><strong>Syncing:</strong> If you use Google Login, we store a simple flag to verify your "Paid" status across devices.</li>
                </ul>

                <h3>3. No Tracking</h3>
                <p>We do not track your browsing history, website visits, or what you work on. The extension only runs its timer logic in the background.</p>

                <h3>4. Data Security</h3>
                <p>Authentication is handled securely via Supabase and Google OAuth. We do not store passwords.</p>

                <h3>5. Your Rights</h3>
                <p>You can delete your account and all associated server-side data at any time by contacting support.</p>
            </div>
        </div>
    )
}
