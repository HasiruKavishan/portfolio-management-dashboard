import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const Assets = () => {
    const { assets, loading } = usePortfolio();

    return (
        <div className="bg-slate-950 flex font-sans text-slate-300">
            <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto space-y-8">
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        System Assets
                    </h2>
                </header>

                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-xl">

                    {loading ? (
                        <div className="p-6 text-slate-400">Loading assets...</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-950/40 text-slate-400 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Name</th>
                                    <th className="px-6 py-4 font-semibold">Symbol</th>
                                    <th className="px-6 py-4 font-semibold text-right">
                                        Current Price
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-800/50">
                                {assets?.map((asset) => (
                                    <tr
                                        key={asset.symbol}
                                        className="hover:bg-slate-800/30 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-medium text-white">
                                            {asset.name}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                                {asset.symbol}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right font-medium text-white">
                                            ${Number(asset.currentPrice).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
};