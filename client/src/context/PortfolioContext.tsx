import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import { api } from '../services/api';

export interface Asset {
  id: number;
  name: string;
  symbol: string;
  type: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  change: number;
}

export interface Portfolio {
  id: number;
  userId: string;
  portfolioName: string;
  assets: Asset[];
}

interface PortfolioContextType {
  assets: Asset[];
  loading: boolean;
  portfolios: Portfolio[];
  fetchPortfolio: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined
);

export function PortfolioProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);

      const data = await api.getPortfolio();

      console.log(data);

      setPortfolios(data.portfolios || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssets = async () => {
    try {
      setLoading(true);

      const data = await api.getAssets();

      setAssets(data.assets || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    fetchAssets();
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        assets,
        loading,
        portfolios,
        fetchPortfolio,
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