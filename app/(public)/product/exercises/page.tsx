import { Eye, Hand, Move, PlayCircle } from "lucide-react";
import Link from "next/link";

export default function ExercisesPage() {
    return (
        <div className="bg-white">
            <section className="py-20 text-center container mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                    Science-Backed Movement
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                    Our library of 2-minute micro-exercises is designed by physiotherapists specifically for desk workers to prevent strain and improve focus.
                </p>
            </section>

            <section className="py-12 container mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Category: Eyes */}
                    <div className="group cursor-pointer">
                        <div className="relative aspect-video bg-blue-100 rounded-2xl overflow-hidden mb-4 border border-blue-200 group-hover:shadow-lg transition-all">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Eye className="w-16 h-16 text-blue-400 opacity-50" />
                            </div>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <PlayCircle className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Digital Eye Strain Relief</h3>
                        <p className="text-slate-600 mt-2 text-sm">Techniques like the 20-20-20 rule and eye rolling to reduce dryness and fatigue.</p>
                    </div>

                    {/* Category: Wrists */}
                    <div className="group cursor-pointer">
                        <div className="relative aspect-video bg-purple-100 rounded-2xl overflow-hidden mb-4 border border-purple-200 group-hover:shadow-lg transition-all">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Hand className="w-16 h-16 text-purple-400 opacity-50" />
                            </div>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <PlayCircle className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Carpal Tunnel Prevention</h3>
                        <p className="text-slate-600 mt-2 text-sm">Wrist stretches and extensions to combat repetitive strain from typing.</p>
                    </div>

                    {/* Category: Neck */}
                    <div className="group cursor-pointer">
                        <div className="relative aspect-video bg-orange-100 rounded-2xl overflow-hidden mb-4 border border-orange-200 group-hover:shadow-lg transition-all">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Move className="w-16 h-16 text-orange-400 opacity-50" />
                            </div>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <PlayCircle className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Tech Neck Correction</h3>
                        <p className="text-slate-600 mt-2 text-sm">Neck tilts and shoulder rolls to release tension from poor posture.</p>
                    </div>

                </div>
            </section>
        </div>
    );
}
