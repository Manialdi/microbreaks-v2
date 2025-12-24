import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Mail, Lock, User, ArrowRight, ArrowLeft, HelpCircle } from 'lucide-react';

type AuthView = 'login' | 'signup' | 'forgot_password';

export default function Auth() {
    const [view, setView] = useState<AuthView>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);

    // Load persisted email
    useEffect(() => {
        chrome.storage.local.get(['rememberedEmail'], (res) => {
            if (res.rememberedEmail) {
                setEmail(res.rememberedEmail as string);
                setRememberMe(true);
            }
        });
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Success - Save Email if Remember Me is checked
            if (rememberMe) {
                chrome.storage.local.set({ rememberedEmail: email });
            } else {
                chrome.storage.local.remove('rememberedEmail');
            }
        }
        // App.tsx listener handles success redirect
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError(null);

        // Call Custom API for Resend Email
        try {
            const res = await fetch('https://www.micro-breaks.com/api/auth/personal-signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, fullName }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Signup failed');
            }

            setSuccessMsg("Account created! Please check your email to confirm your account.");
            // Optionally switch to login or stay here
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            // Call Custom API for Resend Email
            const res = await fetch('https://www.micro-breaks.com/api/auth/personal-password-reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Reset failed');
            }

            setSuccessMsg("Password reset email sent! Check your inbox.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendConfirmation = async () => {
        setLoading(true);
        // Can also be updated to use custom API if needed, 
        // but typically resend is handled by Supabase or a separate endpoint.
        // For now, keeping default supabase resend as fallback is complex since we want custom email.
        // Quick Fix: Just tell them to try signing up again which triggers the email if user exists but unconfirmed
        // or valid manual resend logic. 
        // For simplicity, using Supabase resend but knowing it sends default email. 
        // To fix this 100%, we'd need a /resend-signup endpoint.

        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email
        });
        if (error) setError(error.message);
        else setSuccessMsg("Confirmation email resent!");
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Get the Auth URL content from Supabase 
            // We use skipBrowserRedirect so we can handle the popup ourselves
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: chrome.identity.getRedirectURL(),
                    skipBrowserRedirect: true
                }
            });

            if (error) throw error;
            if (!data?.url) throw new Error("Failed to get auth URL");

            // 2. Launch the Chrome Identity Auth Flow
            // This manages the popup and callback
            chrome.identity.launchWebAuthFlow({
                url: data.url,
                interactive: true
            }, async (redirectUrl) => {
                if (chrome.runtime.lastError || !redirectUrl) {
                    // Usually cancelled by user
                    setLoading(false);
                    return;
                }

                // 3. Extract Session from URL
                // Redirect URL format: https://<id>.chromiumapp.org/#access_token=...&refresh_token=...
                try {
                    const url = new URL(redirectUrl);
                    // Supabase sends params in hash
                    const params = new URLSearchParams(url.hash.substring(1));
                    const accessToken = params.get('access_token');
                    const refreshToken = params.get('refresh_token');

                    if (!accessToken) throw new Error("No access token found");

                    // 4. Set Session in Supabase
                    const { error: sessionError } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken || '',
                    });

                    if (sessionError) throw sessionError;

                    // Success! App.tsx will redirect.
                } catch (err: any) {
                    console.error("Auth flow error:", err);
                    setError("Failed to sign in with Google. Please try again.");
                    setLoading(false);
                }
            });

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to initiate Google Login");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white p-6 font-sans relative">

            {/* Top Right Help Button - Fixed to Viewport */}
            <a
                href="https://www.micro-breaks.com/individual/help"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-xs font-medium transition-all group z-[100] hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
            >
                <HelpCircle size={14} className="text-white/90 group-hover:text-white" />
                <span className="text-white/90 group-hover:text-white">Help</span>
            </a>

            <div className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">


                {/* Header */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg overflow-hidden">
                        <img src={chrome.runtime.getURL("assets/logo-v2.jpg")} alt="MB" className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-xl font-bold">MicroBreaks Personal</h1>
                    <p className="text-white/70 text-xs mt-1">
                        {view === 'login' && 'Welcome back!'}
                        {view === 'signup' && 'Start your health journey'}
                        {view === 'forgot_password' && 'Reset your password'}
                    </p>
                </div>

                {/* Messages */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 text-red-100 text-xs rounded-xl border border-red-500/30 text-center animate-pulse">
                        {error}
                        {error.includes("confirm") && (
                            <button onClick={handleResendConfirmation} className="block w-full mt-2 underline hover:text-white">
                                Resend Confirmation (Default Email)
                            </button>
                        )}
                    </div>
                )}
                {successMsg && (
                    <div className="mb-4 p-3 bg-green-500/20 text-green-100 text-xs rounded-xl border border-green-500/30 text-center">
                        {successMsg}
                    </div>
                )}

                {/* Social Login Button (Login/Signup Only) */}
                {(view === 'login' || view === 'signup') && (
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full bg-white text-gray-700 py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg border border-gray-100 mb-4"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <span className="text-sm">
                                {view === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
                            </span>
                        </button>

                        <div className="relative flex items-center">
                            <div className="flex-grow border-t border-white/20"></div>
                            <span className="flex-shrink-0 mx-4 text-white/50 text-xs uppercase tracking-wider">Or {view === 'login' ? 'sign in' : 'sign up'} with email</span>
                            <div className="flex-grow border-t border-white/20"></div>
                        </div>
                    </div>
                )}

                {/* FORMS */}
                {view === 'login' && (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <InputGroup icon={<Mail />} type="email" placeholder="Email" value={email} onChange={setEmail} />
                        <InputGroup icon={<Lock />} type="password" placeholder="Password" value={password} onChange={setPassword} />

                        <div className="flex items-center gap-2 text-xs text-white/80">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="rounded border-white/30 bg-white/10 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="rememberMe" className="cursor-pointer select-none">Remember Me</label>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg">
                            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Sign In'}
                        </button>

                        <div className="flex justify-between text-xs mt-4 text-white/60">
                            <button type="button" onClick={() => setView('forgot_password')} className="hover:text-white transition">Forgot Password?</button>
                            <button type="button" onClick={() => setView('signup')} className="hover:text-white transition">Create Account</button>
                        </div>
                    </form>
                )}

                {view === 'signup' && (
                    <form onSubmit={handleSignup} className="space-y-3">
                        <InputGroup icon={<User />} type="text" placeholder="Full Name" value={fullName} onChange={setFullName} />
                        <InputGroup icon={<Mail />} type="email" placeholder="Email" value={email} onChange={setEmail} />
                        <InputGroup icon={<Lock />} type="password" placeholder="Create Password" value={password} onChange={setPassword} />
                        <InputGroup icon={<Lock />} type="password" placeholder="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} />

                        <button type="submit" disabled={loading} className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg">
                            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Create Account'}
                        </button>

                        <div className="text-center text-xs mt-4 text-white/60">
                            Already have an account? <button type="button" onClick={() => setView('login')} className="text-white hover:underline">Sign In</button>
                        </div>
                    </form>
                )}

                {view === 'forgot_password' && (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        <p className="text-xs text-white/70 text-center mb-2">
                            Enter your email validation code will be sent to you.
                        </p>
                        <InputGroup icon={<Mail />} type="email" placeholder="Email" value={email} onChange={setEmail} />

                        <button type="submit" disabled={loading} className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg">
                            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Send Reset Link'}
                        </button>

                        <button type="button" onClick={() => setView('login')} className="w-full text-center text-xs text-white/60 hover:text-white mt-2 flex items-center justify-center gap-1">
                            <ArrowLeft size={12} /> Back to Sign In
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

function InputGroup({ icon, type, placeholder, value, onChange }: any) {
    return (
        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors h-4 w-4">
                {icon}
            </div>
            <input
                type={type}
                required
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-black/30 transition-all text-white"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    );
}
