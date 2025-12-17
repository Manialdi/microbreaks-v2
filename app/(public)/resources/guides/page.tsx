export default function GuidesPage() {
    return (
        <div className="bg-white py-24">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl font-bold text-slate-900 mb-6">Wellness Guides</h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-16">
                    Deep dives into creating a healthier workplace culture.
                </p>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div className="border border-slate-200 p-8 rounded-2xl hover:shadow-lg transition-shadow text-left">
                        <h3 className="font-bold text-xl mb-2">Remote Work Integration</h3>
                        <p className="text-slate-600 mb-4">How to introduce wellness initiatives to distributed teams without them feeling intrusive.</p>
                        <span className="text-blue-600 font-bold hover:underline cursor-pointer">Download PDF &rarr;</span>
                    </div>
                    <div className="border border-slate-200 p-8 rounded-2xl hover:shadow-lg transition-shadow text-left">
                        <h3 className="font-bold text-xl mb-2">Ergonomics Checklist</h3>
                        <p className="text-slate-600 mb-4">A complete desk setup guide for employees to prevent back pain and RSI.</p>
                        <span className="text-blue-600 font-bold hover:underline cursor-pointer">View Guide &rarr;</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
