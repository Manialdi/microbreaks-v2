import Link from "next/link";
import { Globe, Wifi } from "lucide-react";

export default function RemoteTeamsPage() {
    return (
        <div className="bg-white">
            <section className="py-20 container mx-auto px-4 text-center">
                <span className="text-green-600 font-bold tracking-wide uppercase text-sm">For Remote Teams</span>
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mt-4 mb-6">
                    Wellness Across Timezones
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                    When you can't tap someone on the shoulder to go for a walk, MicroBreaks does it for you. Build a shared culture of health, no matter where your team sits.
                </p>
            </section>
        </div>
    );
}
