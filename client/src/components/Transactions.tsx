import { Link } from 'react-router-dom';

export default function Transactions() {

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
