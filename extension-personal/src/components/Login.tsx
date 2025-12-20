import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Mail, Lock } from 'lucide-react';
import logo from '@/assets/logo.jpg';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const [loading, setLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    useEffect(() => {
        // Load saved email if exists
        const savedEmail = localStorage.getItem('microbreaks_saved_email');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        // Handle "Remember Me"
        if (rememberMe) {
            localStorage.setItem('microbreaks_saved_email', email);
        } else {
            localStorage.removeItem('microbreaks_saved_email');
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        }
        // Auth state listener in App.tsx will handle redirect
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError("Please enter your email address first.");
            return;
        }

        setResetLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            // We redirect them to the web dashboard to reset their password
            // Ensure this URL matches your actual reset page endpoint
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'https://www.micro-breaks.com/update-password',
            });

            if (error) throw error;

            setSuccessMsg("Password reset email sent! Check your inbox.");
        } catch (err: any) {
            setError(err.message || "Failed to send reset email");
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-6">
            <div className="w-full max-w-sm bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg overflow-hidden border-4 border-white/50">
                        <img src={logo} alt="Microbreaks Logo" className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-2xl font-bold">Micro-breaks.com</h1>
                    <p className="text-white/80 text-sm mt-1">Sign in to your account</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-500/20 text-red-100 text-xs rounded-xl border border-red-500/30 text-center animate-shake">
                            {error}
                        </div>
                    )}
                    {successMsg && (
                        <div className="p-3 bg-green-500/20 text-green-100 text-xs rounded-xl border border-green-500/30 text-center">
                            {successMsg}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 group-focus-within:text-white transition-colors" />
                            <input
                                type="email"
                                required
                                placeholder="Work Email"
                                className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-black/30 transition-all text-white"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 group-focus-within:text-white transition-colors" />
                            <input
                                type="password"
                                required
                                placeholder="Password"
                                className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-black/30 transition-all text-white"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="rounded border-white/30 bg-black/20 text-indigo-500 focus:ring-indigo-500/50 cursor-pointer"
                            />
                            <label htmlFor="remember" className="text-sm text-white/80 cursor-pointer select-none hover:text-white">Remember Me</label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || resetLoading}
                        className="w-full bg-white text-indigo-900 py-3.5 rounded-xl font-bold hover:bg-indigo-50 transition-all hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={loading || resetLoading}
                        className="w-full text-center text-sm text-white/70 hover:text-white transition-colors mt-2"
                    >
                        {resetLoading ? 'Sending email...' : 'Forgot Password?'}
                    </button>
                </form>
            </div>
        </div>
    );
}
