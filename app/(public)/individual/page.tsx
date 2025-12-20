"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Download, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";

export default function IndividualPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        "/sidepanel-ui.png",
        "/images/extension-preview-new.png"
    ];

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-24 pb-16 lg:pt-36 lg:pb-32 overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        {/* Left: Video Demo */}
                        <div className="relative order-2 lg:order-1">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 aspect-video">
                                <video
                                    src="/videos/chin-tucks.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover opacity-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                                <div className="absolute bottom-4 left-4 text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                                    Exercise Demo: Chin Tucks
                                </div>
                            </div>
                            {/* Decorative Blob */}
                            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-100/50 blur-3xl rounded-full"></div>
                        </div>

                        {/* Right: CTA & Value */}
                        <div className="order-1 lg:order-2 text-center lg:text-left">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-6">
                                <Sparkles size={14} /> New: Lifetime Personal Plan
                            </span>
                            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                                Wellness that works <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">for you.</span>
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                The smart extension that keeps you healthy with guided micro-breaks.
                                Stop back pain and eye strain before they start.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link href="#" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 ring-4 ring-transparent hover:ring-blue-100">
                                    Get Lifetime Access — $49
                                </Link>
                                <Link href="https://chromewebstore.google.com/detail/micro-breaks/..." target="_blank" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-700 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all">
                                    <Download size={20} className="mr-2" /> Free Trial
                                </Link>
                            </div>
                            <p className="text-xs text-slate-400 mt-4 font-medium uppercase tracking-wide">
                                One-time payment • 14-Day Money Back Guarantee
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Section + Carousel */}
            <section className="py-24 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Left: Why Content */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">Why you need Micro-breaks</h2>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Remote work and long desk hours are taking a toll on your body.
                                    Incidental movement has disappeared. We bring it back, scientifically.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { title: "Prevent Tech Neck", desc: "Combat the strain of looking down at screens with neck-strengthening exercises." },
                                    { title: "Reduce Eye Strain", desc: "Follow the 20-20-20 rule to keep your vision sharp and headaches at bay." },
                                    { title: "Maintain Focus", desc: "Short active breaks actually increase your mental clarity and productivity." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex shrink-0 items-center justify-center font-bold">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                                            <p className="text-slate-600">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Sliding Carousel */}
                        <div className="relative">
                            <div className="bg-white p-2 rounded-3xl shadow-2xl border border-slate-200">
                                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 group">
                                    <div
                                        className="flex transition-transform duration-500 ease-in-out h-full"
                                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                                    >
                                        {slides.map((src, index) => (
                                            <div key={index} className="min-w-full h-full relative">
                                                <Image
                                                    src={src}
                                                    alt={`Slide ${index}`}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Navigation Arrows */}
                                    <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-slate-800 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-slate-800 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Dots */}
                            <div className="flex justify-center gap-3 mt-6">
                                {slides.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentSlide(idx)}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === idx ? "bg-blue-600 w-8" : "bg-slate-300 hover:bg-slate-400"
                                            }`}
                                        aria-label={`Go to slide ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
