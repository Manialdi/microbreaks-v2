"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
    { src: "/dashboard-overview.png", alt: "Overview" },
    { src: "/dashboard-analytics.png", alt: "Analytics" },
    { src: "/dashboard-employees.png", alt: "Employees" },
    { src: "/dashboard-settings.png", alt: "Settings" }
];

export default function DashboardCarousel() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const scrollToSlide = (index: number) => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const scrollAmount = container.clientWidth * index;
            container.scrollTo({
                left: scrollAmount,
                behavior: "smooth"
            });
            setActiveIndex(index);
        }
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            const container = scrollRef.current;
            const index = Math.round(container.scrollLeft / container.clientWidth);
            setActiveIndex(index);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="relative group">
                {/* Scroll Container */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar scroll-smooth rounded-xl shadow-2xl border border-slate-700 bg-slate-800"
                >
                    {images.map((img, i) => (
                        <div key={i} className="flex-none w-full snap-center relative aspect-[16/10]">
                            {/* We use standard img for simplicity with external/static resources, but Next.js Image is better if compatible. 
                                Using standard img tag here to ensure it fills container exactly as expected without fighting Next.js Image layout modes for this specific carousel use case
                                where we want simple intrinsic sizing or absolute fill. */
                            /* Actually, better to use a div with background or object-fit image to ensure consistency */}
                            <div className="w-full h-full flex items-center justify-center bg-slate-900">
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className="w-full h-auto max-h-full object-contain"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Left/Right Navigation Buttons (Visible on Hover) */}
                <button
                    onClick={() => scrollToSlide(Math.max(0, activeIndex - 1))}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 ${activeIndex === 0 ? 'invisible' : ''}`}
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={() => scrollToSlide(Math.min(images.length - 1, activeIndex + 1))}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 ${activeIndex === images.length - 1 ? 'invisible' : ''}`}
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-3 mt-6">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => scrollToSlide(i)}
                        className={`transition-all duration-300 rounded-full ${i === activeIndex
                                ? "w-8 h-2 bg-blue-500"
                                : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                            }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
