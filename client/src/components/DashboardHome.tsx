import { Wallet, TrendingUp, TrendingDown, PieChart, Plus, X } from "lucide-react";
import { useState, Activity, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePortfolio, type Portfolio } from "../context/PortfolioContext";
import { TradeModal } from "./TradeModal";
import Transactions from "./Transactions";

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

export default function DashboardHome() {
    const navigate = useNavigate();

    const { portfolios,
        loading,
        setPortfolios,
        selectedPortfolio,
        setSelectedPortfolio
    } = usePortfolio();

    console.log(usePortfolio())

    const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
    const [portfolioName, setPortfolioName] = useState("");
    const [creatingPortfolio, setCreatingPortfolio] = useState(false);

    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

    const [assets, setAssets] = useState<Asset[]>([
        { id: 1, name: 'Apple Inc.', symbol: 'AAPL', type: 'Stock', shares: 150, purchasePrice: 145.20, currentPrice: 175.50, change: 2.1 },
        { id: 2, name: 'Vanguard 500 Index', symbol: 'VOO', type: 'Mutual Fund', shares: 45, purchasePrice: 380.00, currentPrice: 410.20, change: 0.8 },
        { id: 3, name: 'US Treasury Bond', symbol: 'US10Y', type: 'Bond', shares: 100, purchasePrice: 98.50, currentPrice: 102.10, change: 0.2 },
        { id: 4, name: 'Microsoft Corp.', symbol: 'MSFT', type: 'Stock', shares: 80, purchasePrice: 280.00, currentPrice: 330.40, change: -1.2 },
        { id: 5, name: 'Tesla Inc.', symbol: 'TSLA', type: 'Stock', shares: 50, purchasePrice: 210.00, currentPrice: 195.50, change: -3.5 },
    ]);

    const [formData, setFormData] = useState({
        name: '',
        symbol: '',
        type: 'Stock',
        shares: '',
        purchasePrice: '',
        currentPrice: ''
    });

    const totalValue = assets.reduce(
        (sum, asset) => sum + asset.shares * asset.currentPrice,
        0
    );

    const totalCost = assets.reduce(
        (sum, asset) => sum + asset.shares * asset.purchasePrice,
        0
    );

    const totalGain = totalValue - totalCost;

    const totalGainPercentage =
        totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

    const dayGain = assets.reduce(
        (sum, asset) =>
            sum +
            asset.shares *
            asset.currentPrice *
            (asset.change / 100),
        0
    );

    const dayGainPercentage =
        totalValue > 0 ? (dayGain / totalValue) * 100 : 0;

    const portfolioSummary = {
        totalValue,
        dayGain,
        dayGainPercentage: dayGainPercentage.toFixed(2),
        totalGain,
        totalGainPercentage: totalGainPercentage.toFixed(2),
    };

    const handleCreatePortfolio = async () => {
        if (!portfolioName.trim()) return;

        try {
            setCreatingPortfolio(true);

            const response = await fetch("/api/portfolios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    portfolioName,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create portfolio");
            }

            const newPortfolio = await response.json();

            // update context instantly
            setPortfolios((prev: any) => [...prev, newPortfolio]);

            // close modal
            setIsPortfolioModalOpen(false);

            // clear input
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

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Total Balance */}
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700/80 transition-all duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-indigo-500/20 transition-all"></div>

                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium mb-1">
                                        Total Portfolio Value
                                    </p>

                                    <h3 className="text-3xl font-extrabold text-white tracking-tight">
                                        ${portfolioSummary.totalValue}
                                    </h3>
                                </div>

                                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                                    <Wallet className="w-6 h-6" />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div
                                    className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg ${portfolioSummary.totalGain >= 0
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : 'bg-red-500/10 text-red-400'
                                        }`}
                                >
                                    {portfolioSummary.totalGain >= 0 ? (
                                        <TrendingUp className="w-4 h-4" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4" />
                                    )}

                                    {portfolioSummary.totalGainPercentage}%
                                </div>

                                <span className="text-slate-500 text-sm">
                                    All time return
                                </span>
                            </div>
                        </div>

                        {/* Day Gain */}
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700/80 transition-all duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-fuchsia-500/20 transition-all"></div>

                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium mb-1">
                                        Today's Profit
                                    </p>

                                    <h3 className="text-3xl font-extrabold text-white tracking-tight">
                                        ${portfolioSummary.dayGain.toFixed(2)}
                                    </h3>
                                </div>

                                <div className="p-3 bg-fuchsia-500/10 rounded-2xl text-fuchsia-400">
                                    <Activity className="w-4 h-4" />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div
                                    className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg ${portfolioSummary.dayGain >= 0
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : 'bg-red-500/10 text-red-400'
                                        }`}
                                >
                                    {portfolioSummary.dayGain >= 0 ? (
                                        <TrendingUp className="w-4 h-4" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4" />
                                    )}

                                    {portfolioSummary.dayGainPercentage}%
                                </div>

                                <span className="text-slate-500 text-sm">
                                    Today
                                </span>
                            </div>
                        </div>

                        {/* Allocation */}
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700/80 transition-all duration-500 flex flex-col justify-between">

                            <div className="flex justify-between items-start mb-2">
                                <p className="text-slate-400 text-sm font-medium mb-1">
                                    Top Holdings
                                </p>

                                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                                    <PieChart className="w-6 h-6" />
                                </div>
                            </div>

                            <div className="space-y-3 mt-4">

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-300">Stock</span>
                                        <span className="text-white font-medium">65%</span>
                                    </div>

                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 w-[65%] rounded-full"></div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-300">Mutual Fund</span>
                                        <span className="text-white font-medium">25%</span>
                                    </div>

                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-fuchsia-500 w-[25%] rounded-full"></div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <Transactions/>

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
