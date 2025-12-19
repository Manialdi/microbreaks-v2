"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
    {
        question: "How often should employees take breaks?",
        answer: "Most research supports breaks every 30–60 minutes. Micro Breaks gives sensible defaults and lets teams customize them."
    },
    {
        question: "Will this interrupt workflow?",
        answer: "No. Reminders are gentle, lightweight, and easy to snooze during meetings or deep work."
    },
    {
        question: "What exercises are included?",
        answer: "Guided micro movements for eyes, neck, shoulders, wrists, back, posture, and breathing — all under 2 minutes."
    },
    {
        question: "How does the HR dashboard work?",
        answer: "It shows engagement and break trends across teams to measure impact and support wellbeing initiatives."
    },
    {
        question: "Is data secure?",
        answer: "Yes. Micro Breaks uses best practices for security and only tracks what’s required to deliver core functionality."
    },
    {
        question: "Can I customize the break schedule?",
        answer: "Yes. While we recommend defaults, teams can adjust frequency and duration to suit their specific workflow needs."
    },
    {
        question: "Does it work on other browsers?",
        answer: "Micro Breaks is currently optimized for Chromium-based browsers like Google Chrome, Microsoft Edge, and Brave."
    },
    {
        question: "Is there a free trial?",
        answer: "Yes! We offer a 14-day free trial for teams so you can experience the benefits of Micro Breaks before committing."
    },
    {
        question: "Can I use Micro Breaks for remote teams?",
        answer: "Absolutely. Since it's browser-based, it works perfectly for distributed teams, keeping everyone on the same wellness page."
    },
    {
        question: "How do I request a new feature?",
        answer: "We love feedback! You can reach out to our support team or submit requests directly through the user portal."
    }
]

export function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section className="bg-slate-50 py-12 lg:py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
                        Questions you might have.
                    </h2>
                </div>

                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 items-start">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-2xl border transition-all duration-200 ${openIndex === index ? 'border-blue-200 shadow-md ring-1 ring-blue-100' : 'border-slate-200 hover:border-blue-100'}`}
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                            >
                                <span className={`font-semibold text-lg ${openIndex === index ? 'text-blue-700' : 'text-slate-800'}`}>
                                    {faq.question}
                                </span>
                                {openIndex === index ? (
                                    <ChevronUp className="text-blue-500 shrink-0" size={20} />
                                ) : (
                                    <ChevronDown className="text-slate-400 shrink-0" size={20} />
                                )}
                            </button>

                            <div
                                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'}`}
                            >
                                <p className="text-slate-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
