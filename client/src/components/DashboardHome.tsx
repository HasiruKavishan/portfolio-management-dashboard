import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePortfolio } from "../context/PortfolioContext";
import Summary from "./Summary";
import { TradeModal } from "./TradeModal";
import Transactions from "./Transactions";
import { api } from "../services/api";

export default function DashboardHome() {
    const navigate = useNavigate();

    const { portfolios,
        loading,
        setPortfolios,
        selectedPortfolio,
        setSelectedPortfolio,
    } = usePortfolio();

    const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
    const [portfolioName, setPortfolioName] = useState("");
    const [creatingPortfolio, setCreatingPortfolio] = useState(false);

    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

    const handleCreatePortfolio = async () => {
        if (!portfolioName.trim()) return;

        try {
            setCreatingPortfolio(true);

            const newPortfolio = await api.createPortfolio(portfolioName);

            setPortfolios((prev: any) => [...prev, newPortfolio]);

            setIsPortfolioModalOpen(false);

            setPortfolioName("");

        } catch (error) {
            console.error(error);
        } finally {
            setCreatingPortfolio(false);
        }
    };

    useEffect(() => {
        if (portfolios.length > 0) {
            setSelectedPortfolio(portfolios[0]);
        }
    }, [portfolios]);

    return (
        <div className="p-8 mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT SIDEBAR */}
                <div className="lg:col-span-3">
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl sticky top-6">

                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white tracking-tight">
                                Portfolios
                            </h3>

                            <button
                                onClick={() => setIsPortfolioModalOpen(true)}
                                className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors"
                            >
                                <Plus className="w-4 h-4 text-white" />
                            </button>
                        </div>

                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3,].map((i) => (
                                    <div
                                        key={i}
                                        className="h-16 rounded-2xl bg-slate-800/50 animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : portfolios?.length === 0 ? (
                            <div className="text-sm text-slate-500 text-center py-10">
                                No portfolios found
                            </div>
                        ) : (
                            <div>
                                <div className="space-y-3">
                                    {portfolios?.map((portfolio: any) => (
                                        <div
                                            key={portfolio.id}
                                            onClick={() => setSelectedPortfolio(portfolio)}
                                            className={`group border rounded-2xl p-4 cursor-pointer transition-all duration-300 ${selectedPortfolio?.id === portfolio.id
                                                ? 'bg-indigo-500/20 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                                                : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70'
                                                }`}
                                        >
                                            <div className="flex justify-between">
                                                <h4 className="text-white font-semibold">
                                                    {portfolio.portfolioName}
                                                </h4>

                                                <button
                                                    onClick={() => {
                                                        setSelectedPortfolio(portfolio);
                                                        setIsTradeModalOpen(true);
                                                    }}
                                                    className="px-3 py-1 text-xs rounded-lg bg-indigo-500/20 text-indigo-300"
                                                >
                                                    Trade
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <TradeModal
                                    isTradeModalOpen={isTradeModalOpen}
                                    onClose={() => setIsTradeModalOpen(false)}
                                    portfolio={selectedPortfolio}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="lg:col-span-9 space-y-8">

                    {/* Portfolio Performance Summary */}
                    <Summary/>

                    <Transactions />

                </div>

                {/* Portfolio Modal */}
                {isPortfolioModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <div className="w-full max-w-md mx-4 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
                                <h2 className="text-xl font-bold text-white">
                                    Create Portfolio
                                </h2>

                                <button
                                    onClick={() => setIsPortfolioModalOpen(false)}
                                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-5">

                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">
                                        Portfolio Name
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Enter portfolio name"
                                        value={portfolioName}
                                        onChange={(e) => setPortfolioName(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <button
                                    onClick={handleCreatePortfolio}
                                    disabled={creatingPortfolio}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 rounded-2xl transition-colors"
                                >
                                    {creatingPortfolio ? "Creating..." : "Create Portfolio"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
