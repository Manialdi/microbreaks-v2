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

                    {/* Exercise 1: Chin Tucks */}
                    <div className="group cursor-pointer">
                        <div className="relative aspect-video bg-white rounded-2xl overflow-hidden mb-4 border border-slate-200 group-hover:shadow-lg transition-all flex items-center justify-center">
                            <video
                                src="/videos/chin-tucks.mp4"
                                className="w-full h-full object-contain invert mix-blend-multiply brightness-110 contrast-110"
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Chin Tucks</h3>
                        <p className="text-slate-600 mt-2 text-sm">Corrects forward head posture by strengthening deep cervical flexors.</p>
                    </div>

                    {/* Exercise 2: Pectoralis Stretch */}
                    <div className="group cursor-pointer">
                        <div className="relative aspect-video bg-white rounded-2xl overflow-hidden mb-4 border border-slate-200 group-hover:shadow-lg transition-all flex items-center justify-center">
                            <video
                                src="/videos/pectoralis-stretch.mp4"
                                className="w-full h-full object-contain invert mix-blend-multiply brightness-110 contrast-110"
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Pectoralis Stretch</h3>
                        <p className="text-slate-600 mt-2 text-sm">Opens up chest muscles that get tight from hunching over a keyboard.</p>
                    </div>

                    {/* Exercise 3: Heel Slides */}
                    <div className="group cursor-pointer">
                        <div className="relative aspect-video bg-white rounded-2xl overflow-hidden mb-4 border border-slate-200 group-hover:shadow-lg transition-all flex items-center justify-center">
                            <video
                                src="/videos/heel-slides.mp4"
                                className="w-full h-full object-contain invert mix-blend-multiply brightness-110 contrast-110"
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Heel Slides</h3>
                        <p className="text-slate-600 mt-2 text-sm">Activates hamstrings and improves knee mobility while seated.</p>
                    </div>

                </div>
            </section>
        </div>
    );
}
