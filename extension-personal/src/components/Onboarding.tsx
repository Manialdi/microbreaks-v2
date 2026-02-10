import { useState } from 'react';
import { Play, Bell, CheckCircle, ChevronRight, ExternalLink } from 'lucide-react';

interface OnboardingProps {
    onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
    const [step, setStep] = useState(1);

    const handleNext = () => setStep(prev => prev + 1);

    const handleFinish = () => {
        // Mark onboarding as seen
        chrome.storage.local.set({ hasSeenOnboarding: true }, () => {
            onComplete();
        });
    };

    const requestNotificationPermission = async () => {
        // Simple permission request - browser will handle the prompt logic
        if (chrome.notifications && chrome.notifications.getPermissionLevel) {
            chrome.notifications.getPermissionLevel((level) => {
                if (level !== 'granted') {
                    // There isn't a direct "requestPermission" API in standard MV3 chrome.notifications for arbitrary requesting 
                    // confusingly, standard web API 'Notification.requestPermission()' works in some contexts but extension background usually has it
                    // For side panel, we can try the standard web API:
                    Notification.requestPermission();
                }
            });
        } else {
            // Fallback for types
            Notification.requestPermission();
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-600 to-indigo-700 text-white text-center">

            {/* Step 1: Welcome & Video */}
            {step === 1 && (
                <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                        <Play size={32} className="text-white fill-white" />
                    </div>

                    <h1 className="text-2xl font-bold mb-2">Welcome to Microbreaks!</h1>
                    <p className="text-blue-100 mb-8 max-w-xs text-sm leading-relaxed">
                        Watch this 1-minute guide to learn how to stay healthy while you work.
                    </p>

                    <a
                        href="https://youtu.be/47vmfKzNEGI"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-white text-blue-600 font-bold py-4 rounded-xl mb-4 flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-lg"
                    >
                        <Play size={18} className="fill-current" />
                        Watch Tutorial
                    </a>

                    <button
                        onClick={handleNext}
                        className="text-sm font-semibold text-blue-200 hover:text-white flex items-center gap-1 mt-2"
                    >
                        Skip for now
                    </button>
                </div>
            )}

            {/* Step 2: Notifications */}
            {step === 2 && (
                <div className="flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                        <Bell size={32} className="text-white" />
                    </div>

                    <h1 className="text-2xl font-bold mb-2">Don't Miss a Break</h1>
                    <p className="text-blue-100 mb-6 max-w-xs text-sm leading-relaxed">
                        We need permission to ping you. Please ensure <strong>System Notifications</strong> are also enabled for your browser.
                    </p>

                    <div className="bg-white/10 rounded-lg p-4 mb-8 text-left w-full max-w-xs border border-white/10">
                        <div className="flex items-start gap-3 mb-3">
                            <span className="bg-white/20 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                            <p className="text-xs text-blue-50">Click <strong>Allow</strong> if browser asks.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="bg-white/20 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                            <p className="text-xs text-blue-50">Mac/Windows Users: Check System Settings if you don't see banners.</p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            requestNotificationPermission();
                            handleNext();
                        }}
                        className="w-full bg-white text-blue-600 font-bold py-4 rounded-xl mb-3 hover:bg-blue-50 transition-colors shadow-lg"
                    >
                        Enable Notifications
                    </button>
                </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-900/20">
                        <CheckCircle size={40} className="stroke-[3]" />
                    </div>

                    <h1 className="text-2xl font-bold mb-2">You're All Set!</h1>
                    <p className="text-blue-100 mb-8 max-w-xs text-sm">
                        Your first break is scheduled. We'll silently handle the rest.
                    </p>

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
