import { useState } from 'react';
import {
    LayoutDashboard,
    Wallet,
    Bell,
    Search,
    LogOut,
    Briefcase,
    ChartCandlestick
} from 'lucide-react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { api } from '../services/api';

interface Asset {
    id: number;
    name: string;
    symbol: string;
    type: string;
    shares: number;
    purchasePrice: number;
    currentPrice: number;
    change: number;
}

export default function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();

        try {
            await api.logout();
        } catch (err) {
            console.error('Logout failed:', err);
        } finally {
            navigate('/login', { replace: true });
        }
    };

    return (
        <div className="h-screen overflow-hidden bg-slate-950 flex font-sans text-slate-300">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl hidden md:flex flex-col relative z-20">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">PortoDash</span>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-indigo-500/10 text-indigo-400 rounded-xl transition-colors font-medium">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link to="/dashboard/assets" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 rounded-xl transition-colors font-medium hover:text-white">
                        <ChartCandlestick className="w-5 h-5" />
                        Assets
                    </Link>
                </nav>

                <div className="p-4">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            <div className="flex-1 relative overflow-y-auto">
                <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-8 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Overview</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative hidden sm:block">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search assets..."
                                className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white placeholder-slate-500 w-64"
                            />
                        </div>
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-2 w-2 h-2 bg-fuchsia-500 rounded-full"></span>
                        </button>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-300 border-2 border-slate-800 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            JD
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <Outlet />
            </div>
        </div>
    );
}
