export default function ConfirmedPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 font-sans p-6 text-center">

            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified</h1>
                <p className="text-gray-600 mb-8">
                    Your email has been successfully confirmed. You can now access your MicroBreaks account.
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-left flex items-start gap-3 mb-6">
                    <div className="text-2xl">🧩</div>
                    <div>
                        <h3 className="font-bold text-blue-900 text-sm">Next Step</h3>
                        <p className="text-sm text-blue-800/80">
                            Open the <strong>MicroBreaks Extension</strong> in your browser toolbar and log in with your credentials.
                        </p>
                    </div>
                </div>

                <p className="text-xs text-gray-400">
                    You can close this tab now.
                </p>
            </div>

        </div>
    );
}
