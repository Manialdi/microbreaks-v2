import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';
import Auth from '../components/Auth';
import PersonalHome from '../components/PersonalHome';
import ExercisePlayer from '../components/ExercisePlayer';
import Onboarding from '../components/Onboarding';

export default function SidePanel() {
    const [isBreakActive, setIsBreakActive] = useState(false);
    const [breakSessionId, setBreakSessionId] = useState<number>(Date.now());
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        // Initial Check
        chrome.storage.local.get(['isBreakActive', 'breakSessionId', 'hasSeenOnboarding'], (result) => {
            setIsBreakActive(!!result.isBreakActive);
            if (result.breakSessionId) setBreakSessionId(Number(result.breakSessionId));

            // Check if onboarding is needed
            if (!result.hasSeenOnboarding) {
                setShowOnboarding(true);
            }
        });

        // Check Session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
            if (session?.user) {
                chrome.runtime.sendMessage({ action: 'SYNC_SETTINGS' });
            }
        });

        // Listen for Auth Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session: Session | null) => {
            setSession(session);
            if (session?.user) {
                chrome.runtime.sendMessage({ action: 'SYNC_SETTINGS' });
            }

            // RESET ONBOARDING ON LOGOUT
            if (event === 'SIGNED_OUT') {
                chrome.storage.local.remove('hasSeenOnboarding');
                setShowOnboarding(false);
            }
        });

        // Listen for changes (from background/notifications)
        const listener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
            if (areaName === 'local') {
                if (changes.isBreakActive) {
                    setIsBreakActive(!!changes.isBreakActive.newValue);
                }
                if (changes.breakSessionId) {
                    setBreakSessionId(changes.breakSessionId.newValue as number);
                }
                // Sync onboarding state if changed externally (e.g. Onboarding component finished)
                if (changes.hasSeenOnboarding) {
                    if (changes.hasSeenOnboarding.newValue === true) {
                        setShowOnboarding(false);
                    }
                }
            }
        };
        chrome.storage.onChanged.addListener(listener);
        return () => {
            chrome.storage.onChanged.removeListener(listener);
            subscription.unsubscribe();
        };
    }, []);

    const handleFinishBreak = () => {
        chrome.storage.local.set({ isBreakActive: false });
        setIsBreakActive(false);
    };

    const handleStartBreakManually = () => {
        const newId = Date.now();
        chrome.storage.local.set({ isBreakActive: true, breakSessionId: newId });
        setIsBreakActive(true);
        setBreakSessionId(newId);
    };

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    if (!session) return <Auth />;

    // Priority 1: Onboarding
    if (showOnboarding) {
        return <Onboarding onComplete={() => setShowOnboarding(false)} />;
    }

    // Priority 2: Active Break
    if (isBreakActive) {
        return <ExercisePlayer key={breakSessionId} onComplete={handleFinishBreak} />;
    }

    // Priority 3: Dashboard
    return (
        <div className="h-screen w-full bg-gray-50 flex flex-col">
            <PersonalHome onStartBreak={handleStartBreakManually} user={session.user} />
        </div>
    );
}
