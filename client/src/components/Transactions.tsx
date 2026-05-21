import { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { api } from "../services/api";
import toast from "react-hot-toast";

export default function Transactions() {
    const {
        transactions,
        fetchTransactions,
        fetchPortfolio,
        selectedPortfolio,
    } = usePortfolio();

    const [editingTx, setEditingTx] = useState<any | null>(null);
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [type, setType] = useState<"BUY" | "SELL">("BUY");

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(value);

    const assetTypeTotals = transactions.reduce((acc, tx) => {
        const assetType = tx.asset.assetType;
        const total = Number(tx.quantity) * Number(tx.pricePerShare);
        acc[assetType] = (acc[assetType] || 0) + total;
        return acc;
    }, {} as Record<string, number>);

    const grandTotal = Object.values(assetTypeTotals).reduce((a, b) => a + b, 0);

    const assetTypeColors: Record<string, string> = {
        STOCK: "bg-indigo-500",
        BOND: "bg-emerald-500",
        MUTUAL_FUND: "bg-amber-500",
    };

    const assetTypeTextColors: Record<string, string> = {
        STOCK: "text-indigo-400",
        BOND: "text-emerald-400",
        MUTUAL_FUND: "text-amber-400",
    };

    const hasChanges =
        editingTx &&
        (Number(editingTx.quantity) !== quantity ||
            Number(editingTx.pricePerShare) !== price ||
            editingTx.transactionType !== type);

    // Open edit modal
    const openEdit = (tx: any) => {
        setEditingTx(tx);
        setQuantity(Number(tx.quantity));
        setPrice(Number(tx.pricePerShare));
        setType(tx.transactionType);
    };

    // Update transaction
    const handleUpdateTransaction = async () => {
        if (!editingTx) return;

        try {
            await api.updateTransaction(editingTx.id, {
                quantity,
                pricePerShare: price,
                transactionType: type,
            });

            await fetchTransactions(selectedPortfolio.id);
            await fetchPortfolio();

            setEditingTx(null);
            toast.success("Transaction updated successfully");
        } catch (err) {
            toast.error("Failed to update transaction");
        }
    };

    return (
        <div className="bg-slate-950 flex font-sans text-slate-300">
            <main className="flex-1 overflow-y-auto max-w-7xl mx-auto space-y-8">

                {/* HEADER */}
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {transactions.length > 0
                            ? "Transaction History"
                            : "No Transactions"}
                    </h2>
                </header>

                {/* TABLE */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                    <table className="w-full text-left border-collapse">

                        <thead className="bg-slate-950/40 text-slate-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Type</th>
                                <th className="px-6 py-4 font-semibold">Asset</th>
                                <th className="px-6 py-4 font-semibold text-right">Quantity</th>
                                <th className="px-6 py-4 font-semibold text-right">Price</th>
                                <th className="px-6 py-4 font-semibold text-right">Total</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-800/50">
                            {transactions.map((tx) => {
                                const quantityVal = Number(tx.quantity);
                                const priceVal = Number(tx.pricePerShare);

                                return (
                                    <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">

                                        {/* TYPE */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${tx.transactionType === "BUY"
                                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                                                {tx.transactionType}
                                            </span>
                                        </td>

                                        {/* ASSET */}
                                        <td className="px-6 py-4 font-medium text-white">
                                            {tx.asset.name} ({tx.asset.symbol})
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-white">{quantityVal}</td>
                                        <td className="px-6 py-4 text-right text-slate-300">{formatCurrency(priceVal)}</td>
                                        <td className="px-6 py-4 text-right font-bold text-white">{formatCurrency(quantityVal * priceVal)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => openEdit(tx)}
                                                className="text-xs px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* ASSET TYPE BREAKDOWN */}
                {transactions.length > 0 && (
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                        <h3 className="text-white font-semibold text-lg">Asset Type Breakdown</h3>

                        {/* Progress Bar */}
                        <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                            {Object.entries(assetTypeTotals).map(([type, total]) => (
                                <div
                                    key={type}
                                    className={`${assetTypeColors[type] ?? "bg-slate-500"} transition-all`}
                                    style={{ width: `${(total / grandTotal) * 100}%` }}
                                />
                            ))}
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap gap-6">
                            {Object.entries(assetTypeTotals).map(([type, total]) => {
                                const percentage = ((total / grandTotal) * 100).toFixed(1);
                                return (
                                    <div key={type} className="flex items-center gap-3">
                                        <span className={`w-3 h-3 rounded-full ${assetTypeColors[type] ?? "bg-slate-500"}`} />
                                        <div>
                                            <p className={`text-sm font-semibold ${assetTypeTextColors[type] ?? "text-slate-400"}`}>
                                                {type}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {formatCurrency(total)} · {percentage}%
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            </main>

            {/* EDIT MODAL */}
            {editingTx && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-900 p-6 rounded-2xl w-[400px] space-y-4 border border-slate-800">

                        <h2 className="text-white text-lg font-semibold">
                            Edit Transaction
                        </h2>

                        {/* TYPE */}
                        <div className="space-y-2">
                            <label className="text-xs text-slate-400">
                                Transaction Type
                            </label>

                            <div className="flex gap-6">

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="transactionType"
                                        checked={type === "BUY"}
                                        onChange={() => setType("BUY")}
                                        className="accent-emerald-500"
                                    />
                                    <span className="text-emerald-400 font-medium">BUY</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="transactionType"
                                        checked={type === "SELL"}
                                        onChange={() => setType("SELL")}
                                        className="accent-red-500"
                                    />
                                    <span className="text-red-400 font-medium">SELL</span>
                                </label>

                            </div>
                        </div>

                        {/* QUANTITY */}
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="w-full bg-slate-800 p-2 rounded text-white"
                            placeholder="Quantity"
                        />

                        {/* PRICE */}
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="w-full bg-slate-800 p-2 rounded text-white"
                            placeholder="Price"
                        />

                        {/* ACTIONS */}
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setEditingTx(null)}
                                className="px-3 py-1 rounded bg-slate-700 text-white"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUpdateTransaction}
                                disabled={!hasChanges}
                                className={`px-3 py-1 rounded text-white transition
                                    ${hasChanges
                                        ? "bg-indigo-500 hover:bg-indigo-600"
                                        : "bg-slate-700 opacity-50 cursor-not-allowed"
                                    }`}
                            >
                                Save
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}