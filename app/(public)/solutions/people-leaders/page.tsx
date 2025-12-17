import Link from "next/link";
import { Check } from "lucide-react";

export default function PeopleLeadersPage() {
    return (
        <div className="bg-white">
            <section className="py-20 container mx-auto px-4 text-center">
                <span className="text-purple-600 font-bold tracking-wide uppercase text-sm">For People Leaders</span>
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mt-4 mb-6">
                    A Healthier Team is a<br /> More Productive Team
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                    Microbreaks aren't time lost; they are energy gained. Equip your team with the tools to stay sharp and avoid the afternoon slump.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link href="/hr/signup" className="text-blue-600 font-bold hover:underline">
                        See how it works &rarr;
                    </Link>
                </div>
            </section>
        </div>
    );
}
