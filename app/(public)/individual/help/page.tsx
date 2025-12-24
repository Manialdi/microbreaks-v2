import { HelpCircle, Mail, MessageCircle, FileQuestion, Monitor, Clock, Shield } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Help & FAQs | Microbreaks Personal",
    description: "Common questions and support for Microbreaks Personal extension.",
};

export default function HelpPage() {
    const faqs = [
        {
            question: "I can't log in to my account.",
            answer: "Please ensure you are using the same email address you used during sign-up. If you forgot your password, use the 'Forgot Password?' link on the login screen to receive a reset link. If you signed up via Google, please use the 'Sign in with Google' button.",
            icon: <Shield className="w-5 h-5 text-indigo-500" />
        },
        {
            question: "I signed up but didn't receive a verification email.",
            answer: "Check your spam or junk folder. The email subject is usually 'Confirm your signup'. If you still can't find it, try signing up again or contact support to verify your account manually.",
            icon: <Mail className="w-5 h-5 text-blue-500" />
        },
        {
            question: "The exercise screen doesn't open automatically.",
            answer: "This is usually due to browser permissions. 1) Ensure Chrome isn't in 'Do Not Disturb' mode (macOS) or Focus Assist (Windows). 2) Check if the Microbreaks extension is pinned. 3) Restart your browser. If issues persist, reinstall the extension.",
            icon: <Monitor className="w-5 h-5 text-emerald-500" />
        },
        {
            question: "What are the default schedule settings?",
            answer: "By default, Microbreaks is active Monday to Friday, from 9:00 AM to 5:00 PM. The default break frequency is every 60 minutes, and the break duration is 2 minutes. You can customize this in the dashboard.",
            icon: <Clock className="w-5 h-5 text-orange-500" />
        },
        {
            question: "Can I customize the exercises?",
            answer: "Currently, Microbreaks rotates through a curated list of scientifically-backed exercises. We are working on a feature to allow users to favorite or exclude specific exercises in a future update.",
            icon: <FileQuestion className="w-5 h-5 text-purple-500" />
        },
        {
            question: "How do I change my billing or cancel my subscription?",
            answer: "You can manage your subscription via the 'Manage Billing' link in your account dashboard on the website. For cancellations, you can also email support directly.",
            icon: <FileQuestion className="w-5 h-5 text-teal-500" />
        },
        {
            question: "Why do I see a blank screen instead of an exercise?",
            answer: "This might happen if your internet connection is unstable as exercises are loaded dynamically. Ensure you are connected to the internet. If the problem persists, try reloading the extension.",
            icon: <Monitor className="w-5 h-5 text-red-500" />
        },
        {
            question: "Does Microbreaks track my other browsing activity?",
            answer: "No. Microbreaks is privacy-first. We do NOT track your browsing history or collect data on what websites you visit. The extension only runs its internal timer and opens the break screen.",
            icon: <Shield className="w-5 h-5 text-indigo-500" />
        },
        {
            question: "Can I use Microbreaks on multiple computers?",
            answer: "Yes! Your account works across multiple devices. Just install the extension and log in with your credentials. Your settings will sync automatically.",
            icon: <Monitor className="w-5 h-5 text-blue-500" />
        },
        {
            question: "I have a suggestion for a new feature.",
            answer: "We love feedback! Please email us at support@micro-breaks.com with your ideas. Many of our best features come from user suggestions.",
            icon: <MessageCircle className="w-5 h-5 text-pink-500" />
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-5xl mx-auto px-6 py-8 text-center">
                    <div className="inline-flex items-center justify-center p-2.5 bg-indigo-50 rounded-2xl mb-4">
                        <HelpCircle className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                        How can we help you?
                    </h1>
                    <p className="text-sm text-slate-500 max-w-full mx-auto whitespace-nowrap overflow-hidden text-ellipsis px-4">
                        Find answers to common questions about setting up and using your Microbreaks Personal extension.
                    </p>
                </div>
            </div>

            {/* FAQs */}
            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-3">
                                <div className="shrink-0 p-1.5 bg-gray-50 rounded-lg mt-0.5">
                                    {faq.icon}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                                        {faq.question}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed text-xs">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Support */}
            <div className="max-w-4xl mx-auto px-6 pb-12">
                <div className="bg-indigo-600 rounded-2xl p-6 md:p-8 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                        <h2 className="text-xl md:text-2xl font-bold mb-3">Still need help?</h2>
                        <p className="text-indigo-100 mb-6 max-w-xl mx-auto text-sm">
                            We're here for you. If you couldn't find the answer above, drop us a line and we'll get back to you as soon as possible.
                        </p>
                        <a
                            href="mailto:support@micro-breaks.com"
                            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg shadow-black/10 text-sm"
                        >
                            <Mail className="w-4 h-4" />
                            support@micro-breaks.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
