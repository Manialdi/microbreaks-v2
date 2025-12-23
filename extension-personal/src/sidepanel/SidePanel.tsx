import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';
import Auth from '../components/Auth';
import PersonalHome from '../components/PersonalHome';
import ExercisePlayer from '../components/ExercisePlayer';

export default function SidePanel() {
    const [isBreakActive, setIsBreakActive] = useState(false);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial Check
        chrome.storage.local.get(['isBreakActive'], (result) => {
            setIsBreakActive(!!result.isBreakActive);
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
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            setSession(session);
            if (session?.user) {
                chrome.runtime.sendMessage({ action: 'SYNC_SETTINGS' });
            }
        });

        // Listen for changes (from background/notifications)
        const listener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
            if (areaName === 'local' && changes.isBreakActive) {
                setIsBreakActive(!!changes.isBreakActive.newValue);
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
        chrome.storage.local.set({ isBreakActive: true });
        setIsBreakActive(true);
    };

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    if (!session) return <Auth />;

    if (isBreakActive) {
        return <ExercisePlayer onComplete={handleFinishBreak} />;
    }

    return (
        <div className="h-screen w-full bg-gray-50 flex flex-col">
            <PersonalHome onStartBreak={handleStartBreakManually} user={session.user} />
        </div>
    );
}
