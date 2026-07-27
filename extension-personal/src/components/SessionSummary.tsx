import { useState } from 'react';
import { CheckCircle, ThumbsUp, Minus, Frown, ArrowRight, Sparkles } from 'lucide-react';

const INSIGHTS = [
    "Most people feel relief in just 90 seconds.",
    "Consistency beats intensity. You showed up!",
    "Mental clarity starts with a physical reset.",
    "You showed up when most people skip.",
    "This is how better workdays are built.",
    "You chose progress over procrastination.",
    "Your future self appreciates this moment.",
    "Momentum comes from showing up, not pushing harder.",
    "One small reset can change the rest of the hour."
];

export default function SessionSummary({ onFinish }: { onFinish: () => void }) {
    const [feedback, setFeedback] = useState<'better' | 'same' | 'worse' | null>(null);
    const [insight] = useState(() => INSIGHTS[Math.floor(Math.random() * INSIGHTS.length)]);

    const handleBackToWork = () => {
        chrome.runtime.sendMessage({ action: 'SHOW_SESSION_OUTCOME_REQUEST', kind: 'complete' }, () => window.close());
    };

    return (
        <div className="flex flex-col h-full bg-white px-6 py-8 items-center justify-center text-center animate-in fade-in duration-500">

            {/* Celebration Icon */}
            <div className="relative mb-6">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                    <CheckCircle size={40} className="drop-shadow-sm" />
                </div>
                <div className="absolute -top-1 -right-1 text-amber-400 animate-bounce delay-100">
                    <Sparkles size={24} fill="currentColor" />
                </div>
            </div>

            {/* Headline */}
            <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Break Complete!</h2>

            {/* Micro-Insight */}
            <div className="bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 mb-8 max-w-xs">
                <p className="text-sm text-slate-600 font-medium italic leading-relaxed">
                    "{insight}"
                </p>
            </div>

            {/* Pulse Check (Feedback) */}
            <div className="w-full max-w-xs mb-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">
                    How do you feel?
                </p>
                <div className="flex justify-between gap-3">
                    <button
                        onClick={() => setFeedback('better')}
                        className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-2 ${feedback === 'better'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-emerald-100 shadow-lg scale-105'
                            : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-200 hover:text-emerald-600 hover:bg-emerald-50/30'}`}
                    >
                        <ThumbsUp size={20} className={feedback === 'better' ? 'fill-current' : ''} />
                        <span className="text-[10px] font-bold uppercase">Better</span>
                    </button>

                    <button
                        onClick={() => setFeedback('same')}
                        className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-2 ${feedback === 'same'
                            ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-blue-100 shadow-lg scale-105'
                            : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/30'}`}
                    >
                        <Minus size={20} />
                        <span className="text-[10px] font-bold uppercase">Same</span>
                    </button>

                    <button
                        onClick={() => setFeedback('worse')}
                        className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all border-2 ${feedback === 'worse'
                            ? 'bg-orange-50 border-orange-400 text-orange-700 shadow-orange-100 shadow-lg scale-105'
                            : 'bg-white border-slate-100 text-slate-400 hover:border-orange-200 hover:text-orange-600 hover:bg-orange-50/30'}`}
                    >
                        <Frown size={20} />
                        <span className="text-[10px] font-bold uppercase">Worse</span>
                    </button>
                </div>
            </div>

            {/* Actions */}
            <div className="w-full max-w-xs flex flex-col gap-3">
                <button
                    onClick={handleBackToWork}
                    style={{ backgroundColor: '#0f172a' }} // Slate-900 equivalent
                    className="w-full py-3.5 text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 group"
                >
                    <span>Back to Work</span>
                </button>

                <button
                    onClick={onFinish}
                    className="w-full py-2 text-xs text-slate-400 font-bold hover:text-slate-600 transition-colors flex items-center justify-center gap-1 group uppercase tracking-wide"
                >
                    <span>View Progress</span>
                </button>
            </div>
        </div>
    );
}
