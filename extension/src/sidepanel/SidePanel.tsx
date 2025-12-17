import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import ExercisePlayer from '../components/ExercisePlayer';

export default function SidePanel() {
    const [isBreakActive, setIsBreakActive] = useState(false);

    useEffect(() => {
        // Initial Check
        chrome.storage.local.get(['isBreakActive'], (result) => {
            setIsBreakActive(!!result.isBreakActive);
        });

        // Listen for changes (from background/notifications)
        const listener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
            if (areaName === 'local' && changes.isBreakActive) {
                setIsBreakActive(!!changes.isBreakActive.newValue);
            }
        };
        chrome.storage.onChanged.addListener(listener);
        return () => chrome.storage.onChanged.removeListener(listener);
    }, []);

    const handleFinishBreak = () => {
        chrome.storage.local.set({ isBreakActive: false });
        setIsBreakActive(false);
    };

    const handleStartBreakManually = () => {
        chrome.storage.local.set({ isBreakActive: true });
        setIsBreakActive(true);
    };

    if (isBreakActive) {
        return <ExercisePlayer onComplete={handleFinishBreak} />;
    }

    return (
        <div className="h-screen w-full bg-gray-50 flex flex-col">
            <Dashboard onStartBreak={handleStartBreakManually} />
        </div>
    );
}
