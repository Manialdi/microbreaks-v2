import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';
import Auth from '@/components/Auth';
import PersonalHome from '@/components/PersonalHome';
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
    return <Auth />;
  }

  if (view === 'exercise') {
    return <ExerciseView onComplete={() => setView('dashboard')} session={session as Session} />;
  }

  const handleStartBreak = async () => {
    // 1. Set State for Side Panel
    await chrome.storage.local.set({ isBreakActive: true });

    // 2. Open Side Panel (Requires User Gesture - Click propagates here)
    const windowId = (await chrome.windows.getCurrent()).id;
    if (windowId) {
      // We can call sidePanel.open directly from popup click
      chrome.sidePanel.open({ windowId });
      window.close(); // Close the popup
    }
  };

  // Use PersonalHome for standard view
  return <PersonalHome onStartBreak={handleStartBreak} user={session?.user} />;
}

export default App;
