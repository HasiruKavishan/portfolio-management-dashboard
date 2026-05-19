import { useState } from 'react';
import { Mail, Lock, ArrowRight, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok) {
                navigate('/dashboard');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden font-sans">
            {/* Background glowing orbs */}
            <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-600/20 blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md p-6 relative z-10">
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden hover:border-slate-700/80 transition-colors duration-500">
                    <div className="p-8 sm:p-10">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 shadow-lg text-white mb-6 ring-4 ring-indigo-500/20 overflow-hidden relative group">
                                <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 -skew-x-[20deg] -translate-x-full"></div>
                                <Activity className="w-8 h-8" />
                            </div>
                            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Welcome Back</h1>
                            <p className="text-slate-400">Sign in to your portfolio dashboard</p>
                        </div>

                        <form
                            className="space-y-6"
                            onSubmit={handleLogin}
                        >
                            {error && (
                                <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300 ml-1">Email address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-sm font-medium text-slate-300">Password</label>
                                    <a href="#" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full overflow-hidden relative group rounded-xl bg-indigo-600 text-white font-semibold py-3.5 px-4 shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isLoading ? 'Signing In...' : 'Sign In'}
                                    {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-fuchsia-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </form>

                        <div className="mt-8 flex items-center gap-4">
                            <div className="h-[1px] flex-1 bg-slate-800"></div>
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Or</span>
                            <div className="h-[1px] flex-1 bg-slate-800"></div>
                        </div>

                        {/* <div className="mt-8 grid grid-cols-2 gap-4">
                            <button className="flex justify-center items-center gap-2 py-3 px-4 bg-slate-950/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-300 transition-all duration-200 active:scale-[0.98]">
                                <Mail className="w-5 h-5" />
                                <span className="text-sm font-medium">GitHub</span>
                            </button>
                            <button className="flex justify-center items-center gap-2 py-3 px-4 bg-slate-950/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-300 transition-all duration-200 active:scale-[0.98]">
                                <Mail className="w-5 h-5" />
                                <span className="text-sm font-medium">Google</span>
                            </button>
                        </div> */}

                        <p className="mt-10 text-center text-sm text-slate-400">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                Create one now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
