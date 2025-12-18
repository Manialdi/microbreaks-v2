import { useState, useEffect } from 'react';
import { Play, SkipForward, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Use shared client
import exercisesData from '../exercises.json';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL; // Removed
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY; // Removed
// const supabase = createClient(supabaseUrl, supabaseKey); // Removed

// Define Exercise Type
type Exercise = {
    id: number | string; // Supabase uses UUID string, json uses number
    title?: string;
    name?: string; // Supabase field
    duration: number;
    instructions?: string;
    description?: string; // Supabase field
    category: string;
    image?: string;
    video_url?: string;
    gif_url?: string;
};

const exercises: Exercise[] = exercisesData as Exercise[];

export default function ExercisePlayer({ onComplete }: { onComplete: () => void }) {
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [sessionTimeLeft, setSessionTimeLeft] = useState(300); // Total session time (default 5m)
    const [exerciseTimeLeft, setExerciseTimeLeft] = useState(60); // Current exercise timer
    const [isActive, setIsActive] = useState(false);
    const [durationDisplay, setDurationDisplay] = useState(5);
    const [employeeId, setEmployeeId] = useState<string | null>(null);
    const [companyId, setCompanyId] = useState<string | null>(null);
    const [debugLog, setDebugLog] = useState<string>("Initializing...");

    // Log Accumulator
    const [accumulatedDuration, setAccumulatedDuration] = useState(0);

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

        // Fetch Employee ID & Company ID for logging
        const fetchEmployee = async () => {
            try {
                const { data: { user }, error: authError } = await supabase.auth.getUser();
                if (authError) {
                    setDebugLog(`Auth Error: ${authError.message}`);
                    return;
                }
                if (!user) {
                    setDebugLog("No User Logged In");
                    return;
                }

                const { data: emp, error: empError } = await supabase
                    .from('employees')
                    .select('id, company_id')
                    .eq('auth_user_id', user.id)
                    .single();

                if (empError) {
                    setDebugLog(`Emp Fetch Error: ${empError.message}`);
                } else if (emp) {
                    setEmployeeId(emp.id);
                    setCompanyId(emp.company_id);
                    setDebugLog(`Ready. Emp: ${emp.id.slice(0, 4)}... Co: ${emp.company_id.slice(0, 4)}...`);
                } else {
                    setDebugLog("Employee profile not found.");
                }
            } catch (err: any) {
                setDebugLog(`Init Exception: ${err.message}`);
            }
        };
        fetchEmployee();
        selectRandomExercise(); // Fire and forget
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
        // Just accumulate time and move to next
        const duration = exercise?.duration || 60;
        setAccumulatedDuration(prev => prev + duration);

        // If we still have significant time left in the session (e.g. > 10s), load next
        if (sessionTimeLeft > 10) {
            selectRandomExercise();
        } else {
            // Session Done naturally
            // Updated: Don't auto-close. Wait for user to click "Finish".
            setIsActive(false);
            setSessionTimeLeft(0);
        }
    };

    const finishSession = async () => {
        setIsActive(false);
        // Add any partial time logic if needed, but for now we log the accumulated fully completed exercises
        // OR we can add the sessionTimeLeft diff. 
        // Simplest: Just log what we accumulated.
        await logSessionInDb(accumulatedDuration);
        onComplete();
    };

    // Helper to log
    const logSessionInDb = async (totalSeconds: number) => {
        if (totalSeconds <= 0) return; // Don't log empty sessions if they just opened and closed immediately? 
        // Or maybe log them as 0 duration? Let's log active work only.

        setDebugLog("Finalizing Session...");
        if (!employeeId || !companyId) {
            setDebugLog(`Missing Data. Emp:${!!employeeId}, Co:${!!companyId}, Ex:${!!exercise}`);
            console.error("Missing data for log:", { employeeId, companyId, exercise });
            return;
        }

        try {
            const { error } = await supabase.from('break_logs').insert({
                employee_id: employeeId,
                company_id: companyId,
                // exercise_id removed to avoid PGRST204 if column is missing
                duration_seconds: totalSeconds,
                completed_at: new Date().toISOString()
            });

            if (error) {
                setDebugLog(`Insert Error: ${error.message} (${error.code})`);
                console.error("Supabase Insert Error:", error);
            }
            else {
                setDebugLog("Success! Log inserted.");
                console.log("Break Logged Successfully");
            }

        } catch (e: any) {
            setDebugLog(`Insert Exception: ${e.message}`);
            console.error("Log failed exception", e);
        }
    };

    // Fetch exercises from Supabase
    const fetchExercises = async () => {
        try {
            const { data, error } = await supabase
                .from('exercises')
                .select('*');

            if (error) {
                console.error("Error fetching exercises:", error);
                setDebugLog(`Fetch Error: ${error.message}`);
                // Fallback to local JSON if DB fails? For now just log.
                return [];
            }
            return data || [];
        } catch (err: any) {
            setDebugLog(`Fetch Ex Exception: ${err.message}`);
            return [];
        }
    };

    const selectRandomExercise = async () => {
        // Fetch fresh list or use cached? For simplicity, fetch fresh or use a local state cache if optimizing.
        // Let's fetch fresh for now to ensure we get the new video URLs. 
        // OPTIMIZATION: In a real app, fetch once on mount and store in state. using `exercisesData` as fallback.

        let availableExercises = await fetchExercises();

        if (availableExercises.length === 0) {
            // Fallback to static if DB empty
            availableExercises = exercises;
        }

        const random = availableExercises[Math.floor(Math.random() * availableExercises.length)];

        // Map DB fields to Component State (if names differ)
        // seed_exercises.sql: name, description, duration_seconds, video_url
        // Component expects: title, instructions, duration, video_url
        const mappedExercise = {
            ...random,
            title: random.name || random.title,
            instructions: random.description || random.instructions,
            duration: random.duration_seconds || random.duration || 60,
            image: random.gif_url || random.image // Use gif_url as image fallback
        };

        setExercise(mappedExercise);
        setExerciseTimeLeft(mappedExercise.duration || 60);
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
                <div className="relative rounded-xl overflow-hidden shadow-lg aspect-video bg-white group w-full shrink-0 flex items-center justify-center">
                    {/* Video Player or Image Fallback */}
                    {exercise.video_url ? (
                        <video
                            src={exercise.video_url} // Extension will resolve relative path
                            className="w-full h-full object-contain invert brightness-110 contrast-110"
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    ) : (
                        <img
                            src={exercise.image || exercise.gif_url} // Fallback to GIF or Image
                            alt={exercise.title || exercise.name}
                            className="w-full h-full object-contain"
                        />
                    )}

                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none">
                        {/* Play Button Overlay (Optional, if video is paused manually) */}
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
                        onClick={finishSession}
                        className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 transform whitespace-nowrap ${sessionTimeLeft <= 0
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-700 text-white/90'
                            }`}
                    >
                        <CheckCircle size={20} />
                        {sessionTimeLeft <= 0 ? 'Finish Break' : 'I am Done Early'}
                    </button>
                </div>
            </div>
            {/* Footer */}
            <div className="flex justify-between items-center w-full px-4 mb-4">
                <button
                    onClick={finishSession}
                    className="text-gray-400 hover:text-white text-xs flex items-center gap-1 transition-colors"
                >
                    Quit to Dashboard
                </button>
            </div>

            {/* Debug Info */}
            <div className="w-full px-4 pb-2">
                <details className="text-[10px] text-gray-500 cursor-pointer">
                    <summary>Debug Info</summary>
                    <pre className="mt-1 whitespace-pre-wrap bg-gray-900/50 p-2 rounded border border-gray-700">
                        {debugLog}
                    </pre>
                </details>
            </div>
        </div>
    );
}
