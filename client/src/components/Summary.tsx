import React from 'react'
import { usePortfolio } from '../context/PortfolioContext'
import { PieChart, TrendingDown, TrendingUp } from 'lucide-react';

const Summary = () => {
    const { summary } = usePortfolio();

    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700/80 transition-all duration-500">

                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all"></div>

                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-slate-400 text-sm font-medium mb-1">
                                    Portfolio Performance
                                </p>

                                <h3 className="text-3xl font-extrabold text-white tracking-tight">
                                    ${summary?.totalPnL.toFixed(2)}
                                </h3>
                            </div>

                            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                                <PieChart className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="space-y-4">

                            {/* Total Cost */}
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Total Cost</span>
                                <span className="text-white font-medium">
                                    ${summary?.totalCost.toFixed(2)}
                                </span>
                            </div>

                            {/* Total Value */}
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Total Value</span>
                                <span className="text-white font-medium">
                                    ${summary?.totalValue.toFixed(2)}
                                </span>
                            </div>

                            {/* ROI */}
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">ROI</span>
                                <span
                                    className={`font-semibold ${summary?.roi >= 0
                                            ? "text-emerald-400"
                                            : "text-red-400"
                                        }`}
                                >
                                    {summary?.roi.toFixed(2)}%
                                </span>
                            </div>

                            {/* PnL Badge */}
                            <div className="mt-4">
                                <div
                                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium ${summary?.totalPnL >= 0
                                            ? "bg-emerald-500/10 text-emerald-400"
                                            : "bg-red-500/10 text-red-400"
                                        }`}
                                >
                                    {summary?.totalPnL >= 0 ? (
                                        <TrendingUp className="w-4 h-4" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4" />
                                    )}

                                    {summary?.totalPnL >= 0 ? "+" : ""}
                                    {summary?.totalPnL.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>
    )
}

export default Summary