import { useEffect, useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";

export default function Transactions() {
    const {transactions} = usePortfolio();


    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(value);

    return (
        <div className="bg-slate-950 flex font-sans text-slate-300">
            <main className="flex-1 overflow-y-auto max-w-7xl mx-auto space-y-8">
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {transactions.length > 0
                            ? "Transaction History"
                            : "No Transactions"}
                    </h2>
                </header>

                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-950/40 text-slate-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Type</th>
                                <th className="px-6 py-4 font-semibold">Asset</th>
                                <th className="px-6 py-4 font-semibold text-right">
                                    Quantity
                                </th>
                                <th className="px-6 py-4 font-semibold text-right">
                                    Price
                                </th>
                                <th className="px-6 py-4 font-semibold text-right">
                                    Total
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-800/50">
                            {transactions.map((tx) => {
                                const quantity = Number(tx.quantity);
                                const price = Number(tx.pricePerShare);

                                return (
                                    <tr
                                        key={tx.id}
                                        className="hover:bg-slate-800/30 transition-colors"
                                    >
                                        {/* TYPE */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${tx.transactionType === "BUY"
                                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                        : "bg-red-500/10 text-red-400 border-red-500/20"
                                                    }`}
                                            >
                                                {tx.transactionType}
                                            </span>
                                        </td>

                                        {/* ASSET */}
                                        <td className="px-6 py-4 font-medium text-white">
                                            {tx.asset.name} ({tx.asset.symbol})
                                        </td>

                                        {/* QUANTITY */}
                                        <td className="px-6 py-4 text-right font-medium text-white">
                                            {quantity}
                                        </td>

                                        {/* PRICE */}
                                        <td className="px-6 py-4 text-right font-medium text-slate-300">
                                            {formatCurrency(price)}
                                        </td>

                                        {/* TOTAL */}
                                        <td className="px-6 py-4 text-right font-bold text-white">
                                            {formatCurrency(quantity * price)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}