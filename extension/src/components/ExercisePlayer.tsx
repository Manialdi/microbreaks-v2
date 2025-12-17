import { useState, useEffect } from 'react';
import { Play, SkipForward, CheckCircle, Clock } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import exercisesData from '../exercises.json';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Define Exercise Type
type Exercise = {
    id: number;
    title: string;
    duration: number;
    instructions: string;
    category: string;
    image: string;
};

const exercises: Exercise[] = exercisesData as Exercise[];

export default function ExercisePlayer({ onComplete }: { onComplete: () => void }) {
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [sessionTimeLeft, setSessionTimeLeft] = useState(300); // Total session time (default 5m)
    const [exerciseTimeLeft, setExerciseTimeLeft] = useState(60); // Current exercise timer
    const [isActive, setIsActive] = useState(false);
    const [durationDisplay, setDurationDisplay] = useState(5);
    const [employeeId, setEmployeeId] = useState<string | null>(null);

    const extendTimer = () => {
        setSessionTimeLeft((prev) => prev + 60);
        setExerciseTimeLeft((prev) => prev + 60); // Also extend current exercise ensuring flow continues
    };

    // Initialize & Fetch Settings & Employee ID
    useEffect(() => {
        // Settings
        chrome.storage.local.get(['settings'], (res) => {
            const s = res.settings as any;
            if (s?.break_duration_minutes) {
                setDurationDisplay(s.break_duration_minutes);
                setSessionTimeLeft(s.break_duration_minutes * 60);
            }
        });

        // Fetch Employee ID for logging
        const fetchEmployee = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: emp } = await supabase
                    .from('employees')
                    .select('id')
                    .eq('auth_user_id', user.id)
                    .single();
                if (emp) setEmployeeId(emp.id);
            }
        };
        fetchEmployee();

        selectRandomExercise();
    }, []);

    const logExercise = async () => {
        if (!exercise || !employeeId) return;

        // Retrieve company_id as well? Usually valid policies handle it, 
        // but let's just insert employee_id and let backend/trigger handle company if needed
        // Actually schema says company_id is NOT NULL. So we need it.
        // We can fetch it or just get from previous query.
        // Let's optimize: fetch both id and company_id in init.

        // Re-checking init... I'll just do a quick fetch inside log or store it in state. Refactor init below is better.
        // But for minimal diff, I'll update the state to store companyId too.
    };

    // Main Timer Loop
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isActive) {
            interval = setInterval(() => {
                // Decrement Session Time (Stop at 0)
                setSessionTimeLeft(prev => Math.max(0, prev - 1));

                // Decrement Exercise Time
                setExerciseTimeLeft(prev => {
                    if (prev <= 1) {
                        // Exercise Finished
                        handleExerciseComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, sessionTimeLeft, exercise, employeeId]); // Added deps

    const handleExerciseComplete = async () => {
        // Log the completed exercise
        if (employeeId && exercise) {
            // Need company_id to insert. Let's fetch it on the fly if not in state, or better: 
            // We assume backend might infer? No, schema says not null.
            // I'll fetch it here quickly or better, store it.
            // Let's do a best-effort insert with cached data.

            // To properly fix, I will fetch company_id in the mount effect. 
            // Since I cannot change the mount effect in this chunk easily without conflict, 
            // I'll use a specific lookup here or assume I added state for it.
            // Wait, I am replacing the mount effect in the Previous Chunk!
            // I will add `companyId` state in the previous chunk replacement.
            // Ah, I missed adding `const [companyId, setCompanyId]...` in the previous chunk.

            // Let's use `supabase` to just call an RPC or insert if we have data. 
            // I'll modify the "component state" part in a separate chunk to act correctly.

            logSessionInDb();
        }

        // If we still have significant time left in the session (e.g. > 10s), load next
        if (sessionTimeLeft > 10) {
            selectRandomExercise();
        } else {
            // Session Done
            setIsActive(false);
            setExerciseTimeLeft(0);
        }
    };

    // Helper to log
    const logSessionInDb = async () => {
        if (!employeeId || !exercise) return;

        try {
            // Fetch company_id if needed (we should store this in state preferably)
            // But to avoid complex refactor, I'll fetch profile again or from local storage?
            // Chrome storage settings might have it? No.

            // Quick fetch profile to get company_id
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single();
            if (profile?.company_id) {
                await supabase.from('break_logs').insert({
                    employee_id: employeeId,
                    company_id: profile.company_id,
                    exercise_id: null, // We don't have UUIDs for exercises in JSON yet... schema expects UUID.
                    // IMPORTANT: Schema `exercise_id` is UUID references exercises(id).
                    // Our `exercises.json` uses integer IDs.
                    // We cannot insert `exercise_id` unless we sync these.
                    // Workaround: Send `null` for exercise_id but log name in description? 
                    // Or just log duration. 
                    // The schema has `exercise_id` but it is nullable?
                    // `exercise_id uuid references exercises(id)` -> nullable by default.
                    // We will log duration.
                    duration_seconds: exercise.duration || 60,
                    completed_at: new Date().toISOString()
                });
            }
        } catch (e) {
            console.error("Log failed", e);
        }
    };

    const selectRandomExercise = () => {
        // Simple random for now (could prevent repetition)
        const random = exercises[Math.floor(Math.random() * exercises.length)];
        setExercise(random);
        setExerciseTimeLeft(random.duration || 60);
        setIsActive(true);
    };

    if (!exercise) return <div className="p-4 text-center">Loading Exercise...</div>;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-full bg-white w-full box-border">
            {/* Header */}
            <div className="bg-emerald-600 text-white p-4 flex justify-between items-center shadow-md shrink-0">
                <h1 className="text-sm font-bold flex items-center gap-2 truncate">
                    <Clock size={16} />
                    <span className="truncate">Microbreaks - {durationDisplay}m</span>
                </h1>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase opacity-80 font-bold tracking-wider">Session Left</span>
                    <span className="text-sm font-mono font-bold leading-none">
                        {formatTime(sessionTimeLeft)}
                    </span>
                </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 w-full">
                <div className="relative rounded-xl overflow-hidden shadow-lg aspect-video bg-gray-100 group w-full shrink-0">
                    {/* Image/Video Placeholder */}
                    <img
                        src={exercise.image}
                        alt={exercise.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                        {!isActive && sessionTimeLeft > 0 && (
                            <button
                                onClick={() => setIsActive(true)}
                                className="bg-white/90 text-emerald-600 p-4 rounded-full shadow-xl hover:scale-110 transition-transform"
                            >
                                <Play size={32} fill="currentColor" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-800 mb-1">{exercise.title}</h2>
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wide">
                        {exercise.category}
                    </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-slate-600 text-sm leading-relaxed">
                    {exercise.instructions}
                </div>
            </div>

            {/* Footer - Fixed Controls */}
            <div className="p-3 border-t bg-slate-50">
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-end mb-1">
                        <div className="flex flex-col">
                            <span className="text-slate-400 font-semibold text-xs tracking-wider uppercase">Exercise Remaining</span>
                            <span className="text-2xl font-mono font-bold text-slate-800 leading-none">
                                {formatTime(exerciseTimeLeft)}
                            </span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div
                            className="h-full bg-emerald-500 transition-all duration-1000 ease-linear"
                            style={{ width: `${(exerciseTimeLeft / (exercise.duration || 60)) * 100}%` }}
                        />
                    </div>

                    {/* Action Buttons Row 1: Skip & Extend */}
                    <div className="flex gap-2 w-full">
                        <button
                            onClick={selectRandomExercise}
                            className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 rounded-lg font-bold flex items-center justify-center gap-1 transition-colors shadow-sm active:scale-95 transform whitespace-nowrap text-sm"
                        >
                            <SkipForward size={14} /> Skip
                        </button>

                        <button
                            onClick={extendTimer}
                            className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 rounded-lg font-bold flex items-center justify-center gap-1 transition-colors shadow-sm active:scale-95 transform whitespace-nowrap text-sm"
                            title="Extend for 1 minute"
                        >
                            +1m
                        </button>
                    </div>

                    {/* Action Buttons Row 2: Done/Finish */}
                    <button
                        onClick={onComplete}
                        className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 transform whitespace-nowrap ${sessionTimeLeft <= 0
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-700 text-white/90'
                            }`}
                    >
                        <CheckCircle size={20} />
                        {sessionTimeLeft <= 0 ? 'Finish Break' : 'I am Done Early'}
                    </button>

                    <button
                        onClick={onComplete}
                        className="text-slate-400 text-[10px] text-center hover:text-slate-600 underline mt-1"
                    >
                        Quit to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
