import { useState, useEffect } from 'react';
import { Play, Bell, CheckCircle, ChevronRight, Building2 } from 'lucide-react';

interface OnboardingProps {
    onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
    const [step, setStep] = useState(1);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);



    const handleNext = () => setStep(prev => prev + 1);

    const handleFinish = () => {
        // Mark onboarding as seen
        chrome.storage.local.set({ hasSeenOnboarding: true }, () => {
            onComplete();
        });
    };

    const requestNotificationPermission = async () => {
        if (notificationsEnabled) return;

        // Simple permission request - browser will handle the prompt logic
        const callback = (permission: NotificationPermission) => {
            if (permission === 'granted') {
                setNotificationsEnabled(true);
            }
        };

        if (chrome.notifications && chrome.notifications.getPermissionLevel) {
            chrome.notifications.getPermissionLevel((level) => {
                if (level !== 'granted') {
                    Notification.requestPermission().then(callback);
                } else {
                    setNotificationsEnabled(true);
                }
            });
        } else {
            Notification.requestPermission().then(callback);
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-600 to-indigo-700 text-white text-center">

            {/* Step 1: Welcome (Company Context) */}
            {step === 1 && (
                <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-xs">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                        <Building2 size={32} className="text-white" />
                    </div>

                    <h1 className="text-2xl font-bold mb-2">Welcome to Microbreaks!</h1>
                    <p className="text-blue-100 mb-12 max-w-xs text-sm leading-relaxed">
                        Your wellness partner for a healthier workday.
                    </p>

                    <div className="w-full flex justify-end">
                        <button
                            onClick={handleNext}
                            className="text-sm font-bold bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-all flex items-center gap-2"
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 2: Notifications */}
            {step === 2 && (
                <div className="flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500 w-full max-w-xs">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                        <Bell size={32} className="text-white" />
                    </div>

                    <h1 className="text-2xl font-bold mb-2">Don't Miss a Break</h1>
                    <p className="text-blue-100 mb-6 max-w-xs text-sm leading-relaxed">
                        We need permission to ping you. <br /> Please ensure <strong>System Notifications</strong> are also enabled for your browser.
                    </p>

                    <div className="bg-white/10 rounded-lg p-4 mb-6 text-left w-full max-w-xs border border-white/10">
                        <div className="flex items-start gap-3 mb-3">
                            <span className="bg-white/20 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                            <p className="text-xs text-blue-50">Click <strong>Allow</strong> if browser asks.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="bg-white/20 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                            <p className="text-xs text-blue-50">Check System Settings if you don't see banners.</p>
                        </div>
                    </div>

                    <button
                        onClick={requestNotificationPermission}
                        className={`w-full text-sm font-bold py-3.5 rounded-xl mb-4 transition-all flex items-center justify-center gap-2 border-2 ${notificationsEnabled
                            ? 'bg-white border-blue-500 text-blue-600 shadow-md'
                            : 'bg-gray-100 border-transparent text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {notificationsEnabled ? <CheckCircle size={18} /> : <Bell size={18} />}
                        {notificationsEnabled ? 'Notifications are enabled' : 'Enable Notifications'}
                    </button>

                    <div className={`w-full flex justify-end transition-opacity duration-300 ${notificationsEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                        <button
                            onClick={handleNext}
                            disabled={!notificationsEnabled}
                            className="text-sm font-bold bg-white text-blue-600 px-8 py-3 rounded-xl hover:bg-blue-50 transition-all shadow-lg flex items-center gap-2"
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500 w-full max-w-xs">
                    <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-900/20">
                        <CheckCircle size={40} className="stroke-[3]" />
                    </div>

                    <h1 className="text-2xl font-bold mb-2">You're All Set!</h1>

                    <a
                        href="https://youtu.be/47vmfKzNEGI"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-white/10 text-white font-medium py-3 rounded-xl mb-6 flex items-center justify-center gap-2 hover:bg-white/20 transition-colors border border-white/20 mt-4"
                    >
                        <Play size={16} className="fill-current" />
                        Watch this 1-minute guide to get started.
                    </a>

                    <button
                        onClick={handleFinish}
                        className="w-full bg-white text-blue-600 font-bold py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                        Go to Dashboard
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}

            {/* Step Indicators */}
            <div className="absolute bottom-6 flex gap-2">
                {[1, 2, 3].map(i => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${step === i ? 'bg-white w-6' : 'bg-white/30'}`}
                    />
                ))}
            </div>
        </div>
    );
}
