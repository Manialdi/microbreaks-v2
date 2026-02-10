import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';
import Auth from '@/components/Auth';
import PersonalHome from '@/components/PersonalHome';
import ExerciseView from '@/components/ExerciseView';
import Onboarding from '@/components/Onboarding';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'dashboard' | 'exercise' | 'onboarding'>('dashboard');

  useEffect(() => {
    // 1. Check Onboarding Status first
    chrome.storage.local.get(['hasSeenOnboarding'], (res) => {
      if (!res.hasSeenOnboarding) {
        setView('onboarding');
      }
    });

    // 2. Check Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);

      // Auto-Sync Settings on Load
      if (session?.user) {
        chrome.runtime.sendMessage({ action: 'SYNC_SETTINGS' });
      }
    });

    // 3. Listen for Auth Changes
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

  // If logged in, prioritize "Exercise" view if that was somehow triggered (e.g. from notification)
  // BUT logic in SidePanel.tsx usually handles exercise mounting. App.tsx here is mostly for popup/main frame?
  // Wait, SidePanel.tsx uses PersonalHome directly. This App.tsx might be used in popup.html?
  // Let's check where App.tsx is used. It's used in main.tsx which is likely the SidePanel entry point based on `sidepanel.html` script tag.
  // Actually, checking file structure: `src/sidepanel/SidePanel.tsx` exists. `src/App.tsx` exists.
  // Let's assume SidePanel.tsx is the main entry for the sidepanel.
  // If `SidePanel.tsx` is the side panel, then modifying `App.tsx` might not affect the side panel.
  // Let's check `src/sidepanel/main.tsx`.

  if (view === 'exercise') {
    return <ExerciseView onComplete={() => setView('dashboard')} session={session as Session} />;
  }

  // Conditionally render Onboarding if view is set to it
  if (view === 'onboarding') {
    return <Onboarding onComplete={() => setView('dashboard')} />;
  }

  const handleStartBreak = async () => {
    // 1. Set State for Side Panel
    await chrome.storage.local.set({ isBreakActive: true, breakSessionId: Date.now() });

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
