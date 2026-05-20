import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import { api } from '../services/api';

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
  asset?: {
    id: string;
    name: string;
    symbol: string;
    currentPrice: number;
  };
}

export interface Portfolio {
  id: string;
  userId: string;
  portfolioName: string;
  assets: Asset[];
  transactions: Transaction[];
}

interface PortfolioContextType {
  assets: Asset[];
  portfolios: Portfolio[];
  transactions: Transaction[];
  selectedPortfolio: Portfolio | null;
  loading: boolean;

  setPortfolios: React.Dispatch<React.SetStateAction<Portfolio[]>>;
  setSelectedPortfolio: React.Dispatch<React.SetStateAction<Portfolio | null>>;

  fetchAssets: () => Promise<void>;
  fetchPortfolio: () => Promise<void>;
  fetchTransactions: (portfolioId: string) => Promise<void>;

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
  const [assets, setAssets] = useState<Asset[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] =
    useState<Portfolio | null>(null);

  const [loading, setLoading] = useState(false);

  const fetchAssets = async () => {
    try {
      setLoading(true);

      const data = await api.getAssets();
      setAssets(data || []);
    } catch (error) {
      console.error(error);
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPortfolio = async () => {
    try {
      setLoading(true);

      const data = await api.getPortfolio();

      setPortfolios(data || []);
    } catch (error) {
      console.error(error);
      setPortfolios([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (portfolioId: string) => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/transactions/portfolio/${portfolioId}`
      );

      if (!res.ok) throw new Error('Failed to fetch transactions');

      const data = await res.json();

      setTransactions(data || []);
    } catch (err) {
      console.error(err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Clear state
  const clearPortfolio = () => {
    setPortfolios([]);
    setTransactions([]);
    setSelectedPortfolio(null);
  };

  // Load assets
  useEffect(() => {
    fetchAssets();
  }, []);

  // Auto select the first portfolio
  useEffect(() => {
    if (portfolios.length > 0 && !selectedPortfolio) {
      setSelectedPortfolio(portfolios[0]);
    }
  }, [portfolios]);

  // Auto fetch transactions
  useEffect(() => {
    if (selectedPortfolio?.id) {
      fetchTransactions(selectedPortfolio.id);
    }
  }, [selectedPortfolio]);

  return (
    <PortfolioContext.Provider
      value={{
        assets,
        portfolios,
        transactions,
        selectedPortfolio,
        loading,

        setPortfolios,
        setSelectedPortfolio,

        fetchAssets,
        fetchPortfolio,
        fetchTransactions,

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
    throw new Error(
      'usePortfolio must be used within PortfolioProvider'
    );
  }

  return context;
}