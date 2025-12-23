import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';

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
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'https://www.micro-breaks.com/update-password',
            });
            if (error) throw error;
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

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white p-6 font-sans">
            <div className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden">

                {/* Header */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg text-indigo-600 font-bold text-3xl">
                        M
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

                {/* FORMS */}
                {view === 'login' && (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <InputGroup icon={<Mail />} type="email" placeholder="Email" value={email} onChange={setEmail} />
                        <InputGroup icon={<Lock />} type="password" placeholder="Password" value={password} onChange={setPassword} />

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
