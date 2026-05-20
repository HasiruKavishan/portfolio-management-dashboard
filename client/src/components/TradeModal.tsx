import { useState } from 'react';
import { usePortfolio, type Portfolio } from '../context/PortfolioContext';

interface Props {
    isTradeModalOpen: boolean;
    onClose: () => void;
    portfolio: Portfolio;
}

export const TradeModal = ({
    isTradeModalOpen,
    onClose,
    portfolio,
}: Props) => {
    const { assets, setPortfolios } = usePortfolio();

    const [asset, setAsset] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [type, setType] = useState<'BUY' | 'SELL'>('BUY');

    if (!isTradeModalOpen || !portfolio) return null;

    const selectedAsset = assets.find(
        (a: any) => a.symbol === asset
    );

    const resetForm = () => {
        setAsset('');
        setQuantity(0);
        setType('BUY');
    };

    const handleCreateTransaction = async () => {
        if (!selectedAsset || quantity <= 0) return;

        const payload = {
            portfolioId: portfolio.id,
            assetId: selectedAsset.id,
            transactionType: type,
            quantity: quantity,
            pricePerShare: selectedAsset.currentPrice,
        }
        try {

            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                console.error('Error occurred');
                return;
            }

            const newTransaction = await response.json();

            setPortfolios((prev) =>
                prev.map((p) => {
                    if (p.id !== payload.portfolioId) return p;

                    return {
                        ...p,
                        transactions: [
                            ...(p.transactions || []),
                            newTransaction,
                        ],
                    };
                })
            );

            resetForm();
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    const isDisabled =
        !selectedAsset || quantity <= 0 || asset === '';

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={() => {
                resetForm();
                onClose();
            }}
        >
            <div
                className="bg-slate-900 border border-slate-700 rounded-2xl w-[420px] p-6 space-y-4"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-white text-lg font-semibold">
                    Trade - {portfolio.portfolioName}
                </h2>

                {/* Asset Dropdown */}
                <div>
                    <label className="text-xs text-slate-400">Asset</label>
                    <select
                        value={asset}
                        onChange={(e) => setAsset(e.target.value)}
                        className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                    >
                        <option value="">Select Asset</option>
                        {assets?.map((a: any) => (
                            <option key={a.symbol} value={a.symbol}>
                                {a.name} ({a.symbol})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Quantity */}
                <div>
                    <label className="text-xs text-slate-400">
                        Quantity
                    </label>
                    <input
                        type="number"
                        min={0}
                        value={quantity}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            setQuantity(value < 0 ? 0 : value);
                        }}
                        className="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                    />
                </div>

                {/* Buy / Sell */}
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-white">
                        <input
                            type="radio"
                            checked={type === 'BUY'}
                            onChange={() => setType('BUY')}
                        />
                        Buy
                    </label>

                    <label className="flex items-center gap-2 text-white">
                        <input
                            type="radio"
                            checked={type === 'SELL'}
                            onChange={() => setType('SELL')}
                        />
                        Sell
                    </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">
                    <button
                        onClick={() => {
                            resetForm();
                            onClose();
                        }}
                        className="px-4 py-2 text-sm rounded-lg bg-slate-700 text-white"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={isDisabled}
                        onClick={handleCreateTransaction}
                        className={`px-4 py-2 text-sm rounded-lg text-white ${isDisabled
                            ? 'bg-indigo-500/40 cursor-not-allowed'
                            : 'bg-indigo-500 hover:bg-indigo-600'
                            }`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};