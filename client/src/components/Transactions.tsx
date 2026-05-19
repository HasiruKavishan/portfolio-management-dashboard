import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, PieChart, LogOut } from 'lucide-react';

export default function Transactions() {
    const navigate = useNavigate();

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (err) {
            console.error('Logout failed:', err);
        } finally {
            navigate('/login');
        }
    };

    const transactions = [
        { id: 1, type: 'Buy', asset: 'AAPL', shares: 50, price: 150, date: '2024-01-15' },
        { id: 2, type: 'Sell', asset: 'VOO', shares: 10, price: 420, date: '2024-02-10' },
        { id: 3, type: 'Buy', asset: 'MSFT', shares: 20, price: 300, date: '2024-03-05' },
    ];

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

    return (
        <div className="h-screen overflow-hidden bg-slate-950 flex font-sans text-slate-300">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 bg-slate-950/50 backdrop-blur-xl hidden md:flex flex-col relative z-20">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <LayoutDashboard className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">PortoDash</span>
                </div>
                <nav className="flex-1 px-4 py-8 space-y-2">
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-indigo-500/10 text-indigo-400 rounded-xl transition-colors font-medium">
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </Link>
                    <Link to="/transactions" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 rounded-xl transition-colors font-medium hover:text-white">
                        <PieChart className="w-5 h-5" /> Transactions
                    </Link>
                </nav>
                <div className="p-4">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors font-medium"
                    >
                        <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto space-y-8">
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Transaction History</h2>
                    <Link to="/dashboard" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                        ← Back to Dashboard
                    </Link>
                </header>
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-950/40 text-slate-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Type</th>
                                <th className="px-6 py-4 font-semibold">Asset</th>
                                <th className="px-6 py-4 font-semibold text-right">Shares</th>
                                <th className="px-6 py-4 font-semibold text-right">Price</th>
                                <th className="px-6 py-4 font-semibold text-right">Date</th>
                                <th className="px-6 py-4 font-semibold text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">{tx.type}</span></td>
                                    <td className="px-6 py-4 font-medium text-white">{tx.asset}</td>
                                    <td className="px-6 py-4 text-right font-medium text-white">{tx.shares}</td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-300">{formatCurrency(tx.price)}</td>
                                    <td className="px-6 py-4 text-right text-slate-400">{tx.date}</td>
                                    <td className="px-6 py-4 text-right font-bold text-white">{formatCurrency(tx.shares * tx.price)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
