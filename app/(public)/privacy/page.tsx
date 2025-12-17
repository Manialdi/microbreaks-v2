export default function PrivacyPolicy() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-12 prose prose-blue">
            <h1>Privacy Policy</h1>
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <h2>1. Introduction</h2>
            <p>
                MicroBreaks ("we", "our", or "us") respects your privacy and is committed to protecting it through our compliance with this policy.
            </p>

            <h2>2. Information We Collect</h2>
            <ul>
                <li><strong>Authentication Information:</strong> Application credentials (email address) used to log you in.</li>
                <li><strong>Health & Activity Data:</strong> Logs of breaks taken and exercises completed to provide you with productivity statistics.</li>
                <li><strong>Usage Data:</strong> Information about your work sessions and break intervals.</li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>
                We use information that we collect about you or that you provide to us to:
            </p>
            <ul>
                <li>Provide the MicroBreaks service and its contents to you.</li>
                <li>Authenticate your identity.</li>
                <li>Track your wellness streaks and session history.</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
                We implement measures designed to protect your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure.
            </p>

            <h2>5. Contact Information</h2>
            <p>
                To ask questions or comment about this privacy policy and our privacy practices, contact us at: support@micro-breaks.com
            </p>
        </div>
    );
}
