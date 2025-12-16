const fs = require('fs');
const path = require('path');

const files = {
    'extension/src/background/index.ts': `import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wjnydegrspaxfdnptebd.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqbnlkZWdyc3BheGZkbnB0ZWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDc3ODIsImV4cCI6MjA4MDMyMzc4Mn0.2KHdSIweIpukWpBwp78X3-qqDMMEgy0Ows8R9kEN8kQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        storage: {
            getItem: (key) => new Promise((resolve) => chrome.storage.local.get(key, (items) => resolve(items[key]))),
            setItem: (key, value) => new Promise((resolve) => chrome.storage.local.set({ [key]: value }, resolve)),
            removeItem: (key) => new Promise((resolve) => chrome.storage.local.remove(key, resolve)),
        },
    },
});

const ALARM_NAME = 'MICROBREAK_ALARM';

// 1. Sync Logic
async function syncCompanySettings() {
    try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session?.user) return;

        const user = sessionData.session.user;

        // Get Employee Details to find Company
        const { data: employee } = await supabase
            .from('employees')
            .select('company_id')
            .eq('auth_user_id', user.id)
            .single();

        if (!employee) return;

        // Get Settings
        const { data: settings } = await supabase
            .from('company_settings')
            .select('*')
            .eq('company_id', employee.company_id)
            .single();

        if (settings) {
             await chrome.storage.local.set({
                settings: settings,
                companyId: employee.company_id
            });
            console.log("Settings Synced:", settings);
            
            // Calculate Interval
            const interval = settings.work_interval_minutes || 60;
            updateAlarms(interval);
        }

    } catch (err) {
        console.error("Sync Error:", err);
    }
}

// 2. Alarm Logic
function updateAlarms(intervalMinutes) {
    chrome.alarms.clear(ALARM_NAME);
    chrome.alarms.create(ALARM_NAME, {
        delayInMinutes: intervalMinutes,
        periodInMinutes: intervalMinutes
    });
    console.log('Alarm set for every ' + intervalMinutes + ' minutes');
}

chrome.runtime.onInstalled.addListener(() => {
    console.log("MicroBreaks Extension Installed");
    chrome.alarms.clearAll();
    syncCompanySettings();
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === ALARM_NAME) {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon-128.png',
            title: 'Time for a MicroBreak! 🧘',
            message: 'Take 2 minutes to stretch and refresh.',
            buttons: [
                { title: 'Start Exercise' },
                { title: 'Snooze 5m' }
            ],
            priority: 2
        });
    }
});

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    if (buttonIndex === 0) {
        // "Start Exercise" clicked
        chrome.windows.create({
            url: 'index.html',
            type: 'popup',
            width: 400,
            height: 600
        });
    } else if (buttonIndex === 1) {
        // "Snooze 5m" clicked
        chrome.alarms.create(ALARM_NAME, { delayInMinutes: 5 });
    }
});


// Message from Frontend (e.g. after Login)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'SYNC_SETTINGS') {
        syncCompanySettings();
        sendResponse({ status: 'sync_started' });
    }
});`,

    'extension/src/components/ExerciseView.tsx': `import { useState, useEffect } from 'react';
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
}`,

    'extension/src/App.tsx': `import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import ExerciseView from '@/components/ExerciseView';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'dashboard' | 'exercise'>('dashboard');

  useEffect(() => {
    // 1. Check Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);

      // Auto-Sync Settings on Load
      if (session?.user) {
        chrome.runtime.sendMessage({ action: 'SYNC_SETTINGS' });
      }
    });

    // 2. Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      if (session?.user) {
        chrome.runtime.sendMessage({ action: 'SYNC_SETTINGS' });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="h-full flex items-center justify-center">Loading...</div>;

  if (!session) {
    return <Login />;
  }

  if (view === 'exercise') {
    return <ExerciseView onComplete={() => setView('dashboard')} session={session} />;
  }

  return <Dashboard onStartBreak={() => setView('exercise')} />;
}

export default App;`
};

for (const [file, content] of Object.entries(files)) {
    const fullPath = path.resolve(process.cwd(), file);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
    console.log("Wrote " + file);
}
