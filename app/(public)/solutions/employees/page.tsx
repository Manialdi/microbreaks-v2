import Link from "next/link";
import { Smile, Battery, Brain } from "lucide-react";

export default function EmployeesPage() {
    return (
        <div className="bg-white">
            <section className="py-20 container mx-auto px-4 text-center">
                <span className="text-orange-500 font-bold tracking-wide uppercase text-sm">For Employees</span>
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mt-4 mb-6">
                    Feel Better at the End<br /> of the Day
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                    No more stiff necks, aching wrists, or dry eyes. Let MicroBreaks guide you through quick refreshes so you finish work feeling energized, not drained.
                </p>
            </section>

            <section className="py-20 bg-orange-50/50">
                <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
                    <div className="p-6">
                        <Battery className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                        <h3 className="font-bold text-xl mb-2">Sustain Energy</h3>
                        <p className="text-slate-600">Avoid the crash. Small movement breaks update your energy levels throughout the day.</p>
                    </div>
                    <div className="p-6">
                        <Brain className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                        <h3 className="font-bold text-xl mb-2">Sharpen Focus</h3>
                        <p className="text-slate-600">Stepping away for 2 minutes actually restores your attention span.</p>
                    </div>
                    <div className="p-6">
                        <Smile className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                        <h3 className="font-bold text-xl mb-2">Better Mood</h3>
                        <p className="text-slate-600">Movement releases endorphins. A happy worker is a good worker.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
