import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  change: number;
}

export interface Transaction {
  id: string;
  portfolioId: string;
  assetId: string;
  transactionType: 'BUY' | 'SELL';
  quantity: number;
  pricePerShare: number;
}

export interface Portfolio {
  id: string;
  userId: string;
  portfolioName: string;
  assets: Asset[];
  transactions: Transaction[];
}

export interface PortfolioSummaryAsset {
  assetId: string;
  symbol: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  value: number;
  unrealizedPnL: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalPnL: number;
  roi: number;
  assets: PortfolioSummaryAsset[];
}

interface PortfolioContextType {
  assets: Asset[];
  portfolios: Portfolio[];
  transactions: Transaction[];

  selectedPortfolio: Portfolio | null;
  summary: PortfolioSummary | null;

  loading: boolean;

  setPortfolios: React.Dispatch<React.SetStateAction<Portfolio[]>>;
  setSelectedPortfolio: React.Dispatch<
    React.SetStateAction<Portfolio | null>
  >;

  fetchAssets: () => Promise<void>;
  fetchPortfolio: () => Promise<void>;
  fetchTransactions: (portfolioId: string) => Promise<void>;
  fetchSummary: (portfolioId: string) => Promise<void>;

  clearPortfolio: () => void;
}

const PortfolioContext = createContext<
  PortfolioContextType | undefined
>(undefined);

export function PortfolioProvider({
  children,
}: {
  children: ReactNode;
}) {
  const navigate = useNavigate();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>(
    []
  );

  const [selectedPortfolio, setSelectedPortfolio] =
    useState<Portfolio | null>(null);

  const [summary, setSummary] =
    useState<PortfolioSummary | null>(null);

  const [loading, setLoading] = useState(false);

  // Auth check
  const checkAuth = async () => {
    try {
      await api.authMe();
      return true;
    } catch (err) {
      navigate('/login', { replace: true });
      return false;
    }
  };

  // Assets
  const fetchAssets = async () => {
    try {
      setLoading(true);

      const data = await api.getAssets();

      setAssets(data?.assets || data || []);
    } catch (error) {
      console.error('Fetch assets error:', error);
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  // Portfolios
  const fetchPortfolio = async () => {
    try {
      setLoading(true);

      const data = await api.getPortfolio();

      setPortfolios(data?.portfolios || data || []);
    } catch (error) {
      console.error('Fetch portfolios error:', error);
      setPortfolios([]);
    } finally {
      setLoading(false);
    }
  };

  // Transactions
  const fetchTransactions = async (portfolioId: string) => {
    try {
      setLoading(true);

      const data = await api.getTransactions(portfolioId);

      setTransactions(data || []);
    } catch (err) {
      console.error('Fetch transactions error:', err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch summary
  const fetchSummary = async (portfolioId: string) => {
    try {
      setLoading(true);

      const data = await api.getPortfolioSummary(
        portfolioId
      );

      setSummary(data);
    } catch (err) {
      console.error('Fetch summary error:', err);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  // Clear state
  const clearPortfolio = () => {
    setAssets([]);
    setPortfolios([]);
    setTransactions([]);
    setSelectedPortfolio(null);
    setSummary(null);
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
      const authenticated = await checkAuth();

      if (!authenticated) return;

      await Promise.all([
        fetchAssets(),
        fetchPortfolio(),
      ]);
    };

    init();
  }, []);

  // Auto select first portfolio
  useEffect(() => {
    if (portfolios.length > 0 && !selectedPortfolio) {
      setSelectedPortfolio(portfolios[0]);
    }
  }, [portfolios]);

  // Fetch data when portfolio changes
  useEffect(() => {
    if (selectedPortfolio?.id) {
      fetchTransactions(selectedPortfolio.id);
      fetchSummary(selectedPortfolio.id);
    }
  }, [selectedPortfolio]);

  return (
    <PortfolioContext.Provider
      value={{
        assets,
        portfolios,
        transactions,

        selectedPortfolio,
        summary,

        loading,

        setPortfolios,
        setSelectedPortfolio,

        fetchAssets,
        fetchPortfolio,
        fetchTransactions,
        fetchSummary,

        clearPortfolio,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);

  if (!context) {
    throw new Error('usePortfolio must be used within PortfolioProvider');
  }

  return context;
}