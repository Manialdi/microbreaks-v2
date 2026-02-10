import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, CheckCircle, Clock, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import exercisesData from '../exercises.json';
import SessionSummary from './SessionSummary';

// Define Exercise Type
type Exercise = {
    id: number | string;
    title?: string;
    name?: string;
    duration: number;
    instructions?: string;
    description?: string;
    category: string;
    image?: string;
    video_url?: string;
    gif_url?: string;
};

const exercises: Exercise[] = exercisesData as Exercise[];

const BENEFITS_MAP: Record<string, string[]> = {
    "Seated Side Stretch": ["Releases side-body and back tension", "Improves seated posture and flexibility"],
    "Upper Body & Arm Stretch": ["Relieves upper-body stiffness", "Improves shoulder and arm mobility"],
    "Seated Neck Rotation": ["Reduces neck stiffness from screen use", "Improves neck range of motion"],
    "Chin Tucks": ["Strengthens deep neck muscles", "Reduces forward-head posture strain"],
    "Side Neck Stretch": ["Relieves neck and shoulder tightness", "Eases tension from prolonged sitting"],
    "Knee Extensions": ["Improves knee mobility and circulation", "Reduces stiffness from long sitting"],
    "Wrist Circles": ["Improves wrist flexibility", "Reduces strain from typing and mouse use"],
    "Sit to Stands": ["Activates leg and core muscles", "Boosts circulation after sitting"],
    "Wrist Flexor Stretch": ["Relieves wrist and forearm tension", "Helps prevent repetitive strain discomfort"],
    "Seated Calf Raises": ["Improves blood flow in lower legs", "Reduces leg fatigue and stiffness"],
    "Eye Circles": ["Reduces digital eye strain", "Refreshes visual focus"],
    "Seated Hip Stretch": ["Releases tight hip muscles", "Improves lower-body mobility"],
    "Pectoralis Stretch": ["Opens the chest and shoulders", "Counteracts rounded sitting posture"],
    "Heel Slides": ["Improves ankle and knee mobility", "Reduces lower-limb stiffness"],
    "Triceps Stretch": ["Relieves upper-arm tension", "Improves shoulder range of motion"]
};

export default function ExercisePlayer({ onComplete }: { onComplete: () => void }) {
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [sessionTimeLeft, setSessionTimeLeft] = useState(120); // Default 2 mins (120s)
    const [exerciseTimeLeft, setExerciseTimeLeft] = useState(60); // Current exercise timer
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isSessionFinished, setIsSessionFinished] = useState(false);
    const [durationDisplay, setDurationDisplay] = useState(2);
    const [debugLog, setDebugLog] = useState<string>("Initializing...");
    const [isMuted, setIsMuted] = useState(false);

    // Company Logging State
    const [employeeId, setEmployeeId] = useState<string | null>(null);
    const [companyId, setCompanyId] = useState<string | null>(null);

    // Log Accumulator
    const [accumulatedDuration, setAccumulatedDuration] = useState(0);
    // Track played exercises in this session
    const [sessionHistory, setSessionHistory] = useState<string[]>([]);

    const videoRef = useRef<HTMLVideoElement>(null);

    const extendTimer = () => {
        setSessionTimeLeft((prev) => prev + 60);
        setExerciseTimeLeft((prev) => prev + 60); // Also extend current exercise ensuring flow continues
    };

    // Initialize
    useEffect(() => {
        // Settings
        chrome.storage.local.get(['settings'], (res) => {
            const s = res.settings as any;
            if (s?.break_duration_minutes) {
                const duration = Number(s.break_duration_minutes);
                setDurationDisplay(duration);
                setSessionTimeLeft(duration * 60);
                setDebugLog(prev => prev + `\nLoaded Duration: ${duration}m`);
            } else {
                setDebugLog(prev => prev + `\nNo duration found, using default 2m`);
            }
        });

        // Fetch Employee ID & Company ID for logging
        const fetchEmployee = async () => {
            try {
                const { data: { user }, error: authError } = await supabase.auth.getUser();
                if (authError || !user) {
                    setDebugLog("No User Logged In");
                    return;
                }

                const { data: emp, error: empError } = await supabase
                    .from('employees')
                    .select('id, company_id')
                    .eq('auth_user_id', user.id)
                    .single();

                if (emp) {
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

    // Handle Video Pause/Resume
    useEffect(() => {
        if (videoRef.current) {
            if (isPaused) {
                videoRef.current.pause();
            } else {
                videoRef.current.play().catch(e => console.log("Play interrupted", e));
            }
        }
    }, [isPaused, exercise]);

    // Main Timer Loop
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isActive && !isPaused) {
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
    }, [isActive, isPaused, sessionTimeLeft, exercise]);

    const handleExerciseComplete = async () => {
        // Just accumulate time and move to next
        const duration = exercise?.duration || 60;
        setAccumulatedDuration(prev => prev + duration);

        // If we still have significant time left in the session (e.g. > 10s), load next
        if (sessionTimeLeft > 10) {
            selectRandomExercise();
        } else {
            // Session Done naturally - Stop and Wait for User
            setIsActive(false);
            setSessionTimeLeft(0);
            // No auto-transition, wait for "Finish Break" click
        }
    };

    const finishSessionEarly = async () => {
        setIsActive(false);
        await logSessionInDb(accumulatedDuration);

        // If finishing when session is basically done, show summary
        if (sessionTimeLeft <= 10) {
            setIsSessionFinished(true);
        } else {
            // Otherwise just exit
            onComplete();
        }
    };

    // Helper to log (Company DB Logic)
    const logSessionInDb = async (totalSeconds: number) => {
        if (totalSeconds <= 0) return;

        setDebugLog("Finalizing Session...");
        if (!employeeId || !companyId) {
            setDebugLog(`Missing Data. Emp:${!!employeeId}, Co:${!!companyId}`);
            console.error("Missing data for log:", { employeeId, companyId });
            return;
        }

        try {
            const { error } = await supabase.from('break_logs').insert({
                employee_id: employeeId,
                company_id: companyId,
                duration_seconds: totalSeconds,
                completed_at: new Date().toISOString()
            });

            if (error) {
                setDebugLog(`Insert Error: ${error.message}`);
            } else {
                setDebugLog("Success! Log inserted.");
                console.log("Break Logged Successfully");
            }
        } catch (e: any) {
            setDebugLog(`Insert Exception: ${e.message}`);
        }
    };

    const selectRandomExercise = () => {
        setIsPaused(false);

        // Filter out recently played
        let availableExercises = exercises.filter(e => {
            const id = e.title || e.name || "";
            return !sessionHistory.includes(id);
        });

        // Reset if empty
        if (availableExercises.length === 0) {
            availableExercises = exercises;
        }

        if (availableExercises.length === 0) {
            setDebugLog("No exercises found in local JSON.");
            return;
        }

        const random = availableExercises[Math.floor(Math.random() * availableExercises.length)];
        const randomId = random.title || random.name || "";

        setSessionHistory(prev => [...prev, randomId]);

        const mappedExercise = {
            ...random,
            title: random.title || random.name,
            instructions: random.description || random.instructions,
            duration: random.duration || 60,
            image: random.gif_url || random.image
        } as Exercise;

        setExercise(mappedExercise);
        setExerciseTimeLeft(mappedExercise.duration || 60);
        setIsActive(true);
    };

    if (isSessionFinished) {
        return <SessionSummary onFinish={onComplete} />;
    }

    if (!exercise) return <div className="p-4 text-center">Loading Exercise...</div>;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Get Benefits
    const benefits = BENEFITS_MAP[exercise.title || ""] || [];

    return (
        <div className="flex flex-col h-screen bg-white w-full box-border overflow-hidden">
            {/* Header (Expanded) */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex justify-between items-center shadow-md shrink-0 z-10">
                <h1 className="text-lg font-bold flex items-center gap-2 truncate">
                    <Clock size={18} />
                    <span className="truncate">Microbreaks - {durationDisplay}m</span>
                </h1>
                <div className="flex flex-col items-end">
                    <span className="text-xs uppercase opacity-80 font-bold tracking-wider">Session Left</span>
                    <span className="text-base font-mono font-bold leading-none">
                        {formatTime(sessionTimeLeft)}
                    </span>
                </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-4 py-2 flex flex-col gap-2 w-full no-scrollbar">

                {/* Video Container */}
                <div className="relative rounded-xl overflow-hidden shadow-md aspect-video bg-gray-50 group w-full shrink-0 flex items-center justify-center max-h-[200px]">

                    {/* Ambient Background Layer */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        {exercise.video_url ? (
                            <video
                                src={exercise.video_url}
                                className="w-full h-full object-cover blur-xl opacity-50 scale-125 saturate-150 invert brightness-110 contrast-110"
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                        ) : (
                            <img
                                src={exercise.image || exercise.gif_url}
                                className="w-full h-full object-cover blur-xl opacity-50 scale-125 saturate-150"
                            />
                        )}
                        <div className="absolute inset-0 bg-white/20"></div>
                    </div>

                    {/* Main Content Layer */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                        {exercise.video_url ? (
                            <video
                                ref={videoRef}
                                src={exercise.video_url}
                                className="w-full h-full object-contain invert brightness-110 contrast-110 drop-shadow-md p-2"
                                autoPlay
                                loop
                                muted={isMuted}
                                playsInline
                            />
                        ) : (
                            <img
                                src={exercise.image || exercise.gif_url}
                                alt={exercise.title || exercise.name}
                                className="w-full h-full object-contain drop-shadow-md p-2"
                            />
                        )}
                    </div>

                    {/* Mute Toggle */}
                    {exercise.video_url && (
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="absolute bottom-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors z-20 backdrop-blur-sm shadow-md"
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>
                    )}
                </div>

                {/* Text Content */}
                <div className="text-center shrink-0">
                    <h2 className="text-xl font-bold text-slate-900 leading-tight">{exercise.title}</h2>
                </div>

                {/* Benefits Section - Compact */}
                {benefits.length > 0 && (
                    <div className="bg-indigo-50/50 rounded-lg p-2 border border-indigo-100 shrink-0 mt-0">
                        <div className="flex items-center gap-1.5 mb-1 justify-center">
                            <Sparkles size={12} className="text-indigo-600" />
                            <span className="text-xs font-bold text-indigo-800 uppercase tracking-wide">Key Benefits</span>
                        </div>
                        <ul className="space-y-1.5">
                            {benefits.map((benefit, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-indigo-900/90 leading-snug">
                                    <CheckCircle size={12} className="text-indigo-500 mt-0.5 shrink-0" />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Footer - Fixed Controls (Compact) */}
            <div className="px-4 py-2 border-t border-slate-100 bg-white shrink-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col gap-2">
                    {/* Timer & Progress */}
                    <div className="flex items-end justify-between mb-1">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Remaining</span>
                        <span className="text-2xl font-mono font-bold text-slate-800 leading-none">
                            {formatTime(exerciseTimeLeft)}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                        <div
                            className={`h-full transition-all duration-1000 ease-linear ${isPaused ? 'bg-orange-400' : 'bg-emerald-500'}`}
                            style={{ width: `${(exerciseTimeLeft / (exercise.duration || 60)) * 100}%` }}
                        />
                    </div>

                    {/* Action Buttons Row 1: Skip, Pause, Extend */}
                    <div className="grid grid-cols-3 gap-2 mb-1">
                        <div className="flex flex-col gap-0.5">
                            <button
                                onClick={selectRandomExercise}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all active:scale-95"
                            >
                                <SkipForward size={18} />
                                Skip
                            </button>
                            <span className="text-[9px] text-slate-400 text-center font-medium leading-tight">Next exercise</span>
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <button
                                onClick={() => setIsPaused(!isPaused)}
                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all active:scale-95 ${isPaused
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                    }`}
                            >
                                {isPaused ? <Play size={18} /> : <Pause size={18} />}
                                {isPaused ? 'Resume' : 'Pause'}
                            </button>
                            <span className="text-[9px] text-slate-400 text-center font-medium leading-tight">
                                {isPaused ? 'Continue' : 'Take a breath'}
                            </span>
                        </div>

                        <div className="flex flex-col gap-0.5">
                            <button
                                onClick={extendTimer}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all active:scale-95"
                            >
                                <Clock size={18} />
                                +1min
                            </button>
                            <span className="text-[9px] text-slate-400 text-center font-medium leading-tight">Extend time</span>
                        </div>
                    </div>

                    {/* Action Buttons Row 2: Done/Finish */}
                    <button
                        onClick={finishSessionEarly}
                        className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 text-sm ${sessionTimeLeft <= 0
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-700 text-white/95'
                            }`}
                    >
                        <CheckCircle size={16} />
                        {sessionTimeLeft <= 0 ? 'Finish Break' : 'I am Done Early'}
                    </button>

                    {/* Quit Link */}
                    <button
                        onClick={finishSessionEarly}
                        className="w-full py-1 text-xs text-slate-400 font-medium hover:text-slate-600 transition-colors -mt-1"
                    >
                        Quit to Dashboard
                    </button>

                    {/* Debug Info Hidden */}

                </div>
            </div>
        </div>
    );
}
