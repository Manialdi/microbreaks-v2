
import Link from "next/link"
import { Check } from "lucide-react"

export const metadata = {
    title: "Pricing - MicroBreaks Personal",
    description: "Simple, one-time pricing for lifetime access to MicroBreaks.",
}

export default function IndividualPricingPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h1>
                <p className="text-xl text-slate-600">Get the full experience for free. No credit card required.</p>
            </div>

            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative">
                <div className="absolute top-5 -left-12 w-48 bg-yellow-400 text-slate-900 text-xs font-bold py-1.5 -rotate-45 text-center shadow-lg uppercase tracking-wider z-10">
                    Limited Time
                </div>
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    100% Free
                </div>
                <div className="px-8 py-6 text-center border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Lifetime Access</h3>
                    <div className="flex justify-center items-baseline mb-4">
                        <span className="text-lg text-slate-400 line-through mr-2">$199</span>
                        <span className="text-5xl font-bold text-slate-900">Free</span>
                        <span className="text-emerald-600 font-bold text-sm ml-2 bg-emerald-50 px-2 py-1 rounded-full">limited time offer</span>
                    </div>
                    <p className="text-slate-600 text-sm mb-6">Early access pricing for individuals</p>
                    <Link
                        href="https://chromewebstore.google.com/detail/microbreaks-personal/gmdpcildfnehopafflccogmhmichoppa?pli=1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-lg active:scale-95"
                    >
                        Add to Chrome - It's Free
                    </Link>
                    <p className="text-xs text-slate-400 mt-4">
                        No hidden fees. Just healthy habits.
                    </p>
                </div>
                <div className="px-8 py-6 bg-slate-50">
                    <ul className="space-y-4">
                        {[
                            "Unlimited Smart Micro-Breaks",
                            "Guided Exercise Library (15+ routines)",
                            "Custom Scheduling & Reminders",
                            "Wellness Stats & Progress Tracking",
                            "Privacy-First (Local-only data)",
                            "Free Future Updates"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center text-slate-700 text-sm">
                                <Check size={18} className="text-green-500 mr-3 flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}
