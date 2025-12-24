
import Link from "next/link"
import { Check } from "lucide-react"

export const metadata = {
    title: "Pricing - MicroBreaks Personal",
    description: "Simple, one-time pricing for lifetime access to MicroBreaks.",
}

export default function IndividualPricingPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h1>
                <p className="text-xl text-slate-600">Invest in your long-term health for less than the cost of a massage.</p>
            </div>

            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative">
                <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    Best Value
                </div>
                <div className="p-8 text-center border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Lifetime Access</h3>
                    <div className="flex justify-center items-baseline mb-4">
                        <span className="text-5xl font-bold text-slate-900">$49</span>
                        <span className="text-slate-500 ml-2">one-time</span>
                    </div>
                    <p className="text-slate-600 text-sm mb-6">No subscriptions. No recurring fees. Yours forever.</p>
                    <Link
                        href="https://buy.stripe.com/test_7sI01g0Xw2C45ji5kk" // Replace with actual link later
                        className="block w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        Get Lifetime Access
                    </Link>
                    <p className="text-xs text-slate-400 mt-4">
                        Includes 7-day money-back guarantee
                    </p>
                </div>
                <div className="p-8 bg-slate-50">
                    <ul className="space-y-4">
                        {[
                            "Unlimited Micro-breaks",
                            "Full Exercise Library (15+ Videos)",
                            "Smart Custom Scheduling",
                            "Wellness Stats & Analytics",
                            "Privacy-First (Local Storage)",
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
