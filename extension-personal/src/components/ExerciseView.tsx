import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface Exercise {
    id: string;
    name: string;
    description: string;
    duration_seconds: number;
    video_url?: string;
    gif_url?: string;
    category?: string;
}

interface Props {
    onComplete: () => void;
    session: Session;
}

export default function ExerciseView({ onComplete, session }: Props) {
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(60);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        fetchRandomExercise();
    }, []);

    useEffect(() => {
        if (!exercise || completed) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleFinish();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [exercise, completed]);

    async function fetchRandomExercise() {
        try {
            // Random selection from DB
            const { data, error } = await supabase.from('exercises').select('*');

            if (error || !data || data.length === 0) {
                console.error("No exercises found", error);
                return;
            }

            const random = data[Math.floor(Math.random() * data.length)];
            setExercise(random);
            setTimeLeft(random.duration_seconds || 60);

        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleFinish() {
        if (completed) return;
        setCompleted(true);

        try {
            // 1. Get Employee ID
            const { data: employee } = await supabase
                .from('employees')
                .select('id, company_id')
                .eq('auth_user_id', session.user.id)
                .single();

            if (employee && exercise) {
                // 2. Log Break
                await supabase.from('break_logs').insert({
                    employee_id: employee.id,
                    company_id: employee.company_id,
                    exercise_id: exercise.id,
                    duration_seconds: exercise.duration_seconds,
                    completed_at: new Date().toISOString()
                });
                console.log("Break Logged!");
            }
        } catch (err) {
            console.error("Logging failed:", err);
        }
    }

    if (loading) return <div className="h-full flex items-center justify-center p-8 text-white">Loading Workout...</div>;
    if (!exercise) return <div className="h-full flex items-center justify-center p-8 text-white">No exercises found.</div>;

    return (
        <div className="h-full flex flex-col items-center justify-between p-6 text-white text-center bg-gradient-to-br from-blue-900 to-slate-900 overflow-y-auto">

            {/* Header */}
            <div className="w-full pt-4">
                <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-medium uppercase tracking-wider backdrop-blur-sm">
                    {exercise.category || 'Stretch'}
                </span>
                <h1 className="text-2xl font-bold mt-4 mb-2 leading-tight">{exercise.name}</h1>
                <p className="text-white/80 text-sm">{exercise.description}</p>
            </div>

            {/* Visual */}
            <div className="flex-1 flex items-center justify-center my-6 w-full max-w-[280px] aspect-square bg-white/10 rounded-2xl backdrop-blur-md shadow-inner border border-white/5 overflow-hidden relative">
                {exercise.gif_url ? (
                    <img src={exercise.gif_url} alt={exercise.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-6xl animate-pulse">🧘</div>
                )}

                {/* Timer */}
                <div className="absolute bottom-4 right-4 text-3xl font-bold font-mono drop-shadow-lg">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
            </div>

            {/* Actions */}
            <div className="w-full pb-6 space-y-3">
                {!completed ? (
                    <button
                        onClick={() => { handleFinish(); onComplete(); }}
                        className="w-full py-4 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-xl font-semibold transition-all border border-white/10 backdrop-blur-md"
                    >
                        Skip / Done Early
                    </button>
                ) : (
                    <button
                        onClick={onComplete}
                        className="w-full py-4 bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-900/20 rounded-xl font-bold transition-all transform hover:scale-[1.02]"
                    >
                        Awesome! Done ✅
                    </button>
                )}
            </div>
        </div>
    );
}
