import { useState, useEffect } from 'react';
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

export default App;
