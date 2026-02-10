import Link from 'next/link';
import { ArrowRight, Trophy, Users, Heart, Zap, Award } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Micro-Breaks Step Challenge - Join your team!',
    description: 'Join the 10k step challenge and boost your health with your colleagues.',
};

export default function StepChallengePage() {
    return (
        <div className="bg-gradient-to-b from-blue-50/50 to-white min-h-screen">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16 lg:py-24 text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                        <Trophy size={16} />
                        <span>Company-Wide Wellness Event</span>
                    </div>

                    <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                        The <span className="text-blue-600">10k Step Challenge</span> is here!
                    </h1>

                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Your HR team invites you to join the 21-day movement challenge. Walk your way to better health, higher energy, and maybe even some prizes!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        <button className="inline-flex justify-center items-center px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95 text-lg">
                            Count me in! <ArrowRight className="ml-2 w-5 h-5" />
                        </button>
                        <Link href="#details" className="inline-flex justify-center items-center px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 text-lg">
                            Learn more
                        </Link>
                    </div>
                </div>
            </section>

            {/* Challenge Details Cards */}
            <section id="details" className="bg-white py-16 lg:py-20 border-t border-slate-100">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Goal Card */}
                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 text-center hover:shadow-md transition-all">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Zap size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">The Goal</h3>
                            <p className="text-slate-600">
                                Hit <span className="font-semibold text-blue-600">10,000 steps</span> every single day.
                            </p>
                        </div>

                        {/* Duration Card */}
                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 text-center hover:shadow-md transition-all">
                            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Users size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">The Duration</h3>
                            <p className="text-slate-600">
                                A <span className="font-semibold text-amber-600">21-Day</span> sprint to build a lasting habit.
                            </p>
                        </div>

                        {/* Reward Card */}
                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 text-center hover:shadow-md transition-all">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Award size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">The Reward</h3>
                            <p className="text-slate-600">
                                Feel great, reduce stress, and win <span className="font-semibold text-green-600">team bragging rights!</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Motivation Section */}
            <section className="py-16 lg:py-24 bg-slate-900 text-white text-center">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-3xl lg:text-5xl font-bold mb-6">Why walk 10k steps?</h2>
                    <p className="text-lg text-slate-300 mb-12 leading-relaxed">
                        Walking is the simplest way to improve cardiovascular health, boost creativity, and reduce workplace stress. Join your colleagues in making health a priority this month.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
                        <div className="flex gap-4">
                            <Heart className="text-rose-500 shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold text-lg mb-1">Heart Health</h4>
                                <p className="text-slate-400 text-sm">Lowers blood pressure and strengthens your heart.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Zap className="text-yellow-400 shrink-0" size={24} />
                            <div>
                                <h4 className="font-bold text-lg mb-1">More Energy</h4>
                                <p className="text-slate-400 text-sm">Walking boosts oxygen flow and energy levels.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Simple CTA Footer */}
            <section className="py-20 bg-blue-600 text-white text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8">Ready to step up?</h2>
                    <button className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
                        Join the Challenge Now
                    </button>
                    <p className="mt-6 text-blue-100 text-sm">
                        Speak to your HR representative for more details.
                    </p>
                </div>
            </section>
        </div>
    );
}
