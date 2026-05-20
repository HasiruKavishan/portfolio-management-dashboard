import {
  createContext,
  useContext,
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

export interface Portfolio {
  id: string;
  userId: string;
  portfolioName: string;
  assets: Asset[];
}

interface PortfolioContextType {
  assets: Asset[];
  loading: boolean;
  portfolios: Portfolio[];
  setPortfolios: React.Dispatch<React.SetStateAction<Portfolio[]>>;
  fetchPortfolio: () => Promise<void>;
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
  const [assets] = useState<Asset[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);

      const data = await api.getPortfolio();

      console.log('Portfolio Data:', data);

      setPortfolios(data || []);
    } catch (error) {
      console.error(error);

      setPortfolios([]);
    } finally {
      setLoading(false);
    }
  };

  const clearPortfolio = () => {
    setPortfolios([]);
  };

  return (
    <PortfolioContext.Provider
      value={{
        assets,
        loading,
        portfolios,
        setPortfolios,
        fetchPortfolio,
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