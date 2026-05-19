import { useState } from 'react';
import {
    LayoutDashboard,
    PieChart,
    Wallet,
    TrendingUp,
    TrendingDown,
    Bell,
    Search,
    LogOut,
    ArrowUpRight,
    ArrowDownRight,
    Briefcase,
    Activity,
    Plus,
    Edit2,
    X,
    Trash2
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

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

    const [assets, setAssets] = useState<Asset[]>([
        { id: 1, name: 'Apple Inc.', symbol: 'AAPL', type: 'Stock', shares: 150, purchasePrice: 145.20, currentPrice: 175.50, change: 2.1 },
        { id: 2, name: 'Vanguard 500 Index', symbol: 'VOO', type: 'Mutual Fund', shares: 45, purchasePrice: 380.00, currentPrice: 410.20, change: 0.8 },
        { id: 3, name: 'US Treasury Bond', symbol: 'US10Y', type: 'Bond', shares: 100, purchasePrice: 98.50, currentPrice: 102.10, change: 0.2 },
        { id: 4, name: 'Microsoft Corp.', symbol: 'MSFT', type: 'Stock', shares: 80, purchasePrice: 280.00, currentPrice: 330.40, change: -1.2 },
        { id: 5, name: 'Tesla Inc.', symbol: 'TSLA', type: 'Stock', shares: 50, purchasePrice: 210.00, currentPrice: 195.50, change: -3.5 },
    ]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        symbol: '',
        type: 'Stock',
        shares: '',
        purchasePrice: '',
        currentPrice: ''
    });

    const totalValue = assets.reduce((sum, asset) => sum + (asset.shares * asset.currentPrice), 0);
    const totalCost = assets.reduce((sum, asset) => sum + (asset.shares * asset.purchasePrice), 0);
    const totalGain = totalValue - totalCost;
    const totalGainPercentage = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

    // Mock day gains based on static changes
    const dayGain = assets.reduce((sum, asset) => sum + (asset.shares * asset.currentPrice * (asset.change / 100)), 0);
    const dayGainPercentage = totalValue > 0 ? (dayGain / totalValue) * 100 : 0;

    const portfolioSummary = {
        totalValue,
        dayGain,
        dayGainPercentage: dayGainPercentage.toFixed(2),
        totalGain,
        totalGainPercentage: totalGainPercentage.toFixed(2),
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    const handleOpenModal = (asset?: Asset) => {
        if (asset) {
            setEditingAsset(asset);
            setFormData({
                name: asset.name,
                symbol: asset.symbol,
                type: asset.type,
                shares: asset.shares.toString(),
                purchasePrice: asset.purchasePrice.toString(),
                currentPrice: asset.currentPrice.toString()
            });
        } else {
            setEditingAsset(null);
            setFormData({ name: '', symbol: '', type: 'Stock', shares: '', purchasePrice: '', currentPrice: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAsset(null);
    };

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

    const handleSaveAsset = (e: React.FormEvent) => {
        e.preventDefault();
        const payload: Asset = {
            id: editingAsset ? editingAsset.id : Date.now(),
            name: formData.name,
            symbol: formData.symbol.toUpperCase(),
            type: formData.type,
            shares: Number(formData.shares) || 0,
            purchasePrice: Number(formData.purchasePrice) || 0,
            currentPrice: Number(formData.currentPrice) || 0,
            change: editingAsset ? editingAsset.change : 0 // keep old change or 0 for new
        };

        if (editingAsset) {
            setAssets(assets.map(a => a.id === editingAsset.id ? payload : a));
        } else {
            setAssets([...assets, payload]);
        }
        handleCloseModal();
    };

    const handleDeleteAsset = (id: number) => {
        setAssets(assets.filter(a => a.id !== id));
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
                    <a href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 rounded-xl transition-colors font-medium hover:text-white">
                        <PieChart className="w-5 h-5" />
                        Assets
                    </a>
                    <Link to="/transactions" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 rounded-xl transition-colors font-medium hover:text-white">
                        <Wallet className="w-5 h-5" />
                        Transactions
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

            {/* Main Content */}
            <main className="flex-1 relative overflow-y-auto">
                {/* Background glowing effects */}
                <div className="absolute top-[-10%] right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
                <div className="absolute top-[40%] left-[-10%] w-[30%] h-[30%] rounded-full bg-fuchsia-600/10 blur-[120px] pointer-events-none"></div>

                {/* Top Header */}
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

                <div className="p-8 max-w-7xl mx-auto space-y-8 relative z-10">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Total Balance */}
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700/80 transition-all duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-indigo-500/20 transition-all"></div>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium mb-1">Total Portfolio Value</p>
                                    <h3 className="text-3xl font-extrabold text-white tracking-tight">{formatCurrency(portfolioSummary.totalValue)}</h3>
                                </div>
                                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                                    <Wallet className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg ${portfolioSummary.totalGain >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {portfolioSummary.totalGain >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                    {portfolioSummary.totalGainPercentage}%
                                </div>
                                <span className="text-slate-500 text-sm">All time return</span>
                            </div>
                        </div>

                        {/* Day's Gain */}
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700/80 transition-all duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-fuchsia-500/20 transition-all"></div>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-slate-400 text-sm font-medium mb-1">Today's Profit</p>
                                    <h3 className="text-3xl font-extrabold text-white tracking-tight">{formatCurrency(portfolioSummary.dayGain)}</h3>
                                </div>
                                <div className="p-3 bg-fuchsia-500/10 rounded-2xl text-fuchsia-400">
                                    <Activity className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg ${portfolioSummary.dayGain >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {portfolioSummary.dayGain >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                    {portfolioSummary.dayGainPercentage}%
                                </div>
                                <span className="text-slate-500 text-sm">Today</span>
                            </div>
                        </div>

                        {/* Asset Allocation Placeholder */}
                        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-700/80 transition-all duration-500 flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-slate-400 text-sm font-medium mb-1">Top Holdings</p>
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

                    {/* Asset Table */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-xl mt-8">
                        <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white tracking-tight">Your Assets</h3>
                            <button
                                onClick={() => handleOpenModal()}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
                            >
                                <Plus className="w-4 h-4" />
                                Add Asset
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-950/40 text-slate-400 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4 font-semibold">Asset</th>
                                        <th className="px-6 py-4 font-semibold">Type</th>
                                        <th className="px-6 py-4 font-semibold text-right">Holdings</th>
                                        <th className="px-6 py-4 font-semibold text-right">Purchase Price</th>
                                        <th className="px-6 py-4 font-semibold text-right">Current Price</th>
                                        <th className="px-6 py-4 font-semibold text-right">24h Change</th>
                                        <th className="px-6 py-4 font-semibold text-right">Total Value</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {assets.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                                                No assets found. Click "Add Asset" to start building your portfolio.
                                            </td>
                                        </tr>
                                    ) : assets.map((asset) => (
                                        <tr key={asset.id} className="hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white shadow-sm border border-slate-700/50">
                                                        {asset.symbol.substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white group-hover:text-indigo-300 transition-colors">{asset.symbol}</div>
                                                        <div className="text-xs text-slate-400">{asset.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                                    {asset.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="text-white font-medium">{asset.shares}</div>
                                                <div className="text-xs text-slate-500">Shares</div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-slate-300">
                                                {formatCurrency(asset.purchasePrice)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-white">
                                                {formatCurrency(asset.currentPrice)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className={`inline-flex items-center gap-1 font-medium ${asset.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {asset.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                                    {Math.abs(asset.change)}%
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-white">
                                                {formatCurrency(asset.shares * asset.currentPrice)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(asset)}
                                                        className="p-2 text-slate-400 hover:text-indigo-400 bg-slate-900/50 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
                                                        title="Edit Asset"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAsset(asset.id)}
                                                        className="p-2 text-slate-400 hover:text-red-400 bg-slate-900/50 hover:bg-slate-800 rounded-lg transition-colors border border-slate-800"
                                                        title="Delete Asset"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Add / Edit Asset Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={handleCloseModal}></div>
                    <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white tracking-tight">
                                {editingAsset ? 'Edit Asset' : 'Add New Asset'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveAsset} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 font-medium text-sm">
                                    <label className="text-slate-400">Asset Symbol</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.symbol}
                                        onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all uppercase"
                                        placeholder="AAPL"
                                    />
                                </div>
                                <div className="space-y-1.5 font-medium text-sm">
                                    <label className="text-slate-400">Asset Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none"
                                    >
                                        <option value="Stock">Stock</option>
                                        <option value="Bond">Bond</option>
                                        <option value="Mutual Fund">Mutual Fund</option>
                                        <option value="Crypto">Crypto</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1.5 font-medium text-sm">
                                <label className="text-slate-400">Asset Name (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                    placeholder="Apple Inc."
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1.5 font-medium text-sm">
                                    <label className="text-slate-400">Shares</label>
                                    <input
                                        type="number"
                                        step="any"
                                        required
                                        value={formData.shares}
                                        onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                        placeholder="10"
                                    />
                                </div>
                                <div className="space-y-1.5 font-medium text-sm">
                                    <label className="text-slate-400">Buy Price</label>
                                    <input
                                        type="number"
                                        step="any"
                                        required
                                        value={formData.purchasePrice}
                                        onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5 font-medium text-sm">
                                    <label className="text-slate-400">Current Price</label>
                                    <input
                                        type="number"
                                        step="any"
                                        required
                                        value={formData.currentPrice}
                                        onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors border border-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20"
                                >
                                    {editingAsset ? 'Save Changes' : 'Add Asset'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
