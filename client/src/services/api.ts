

export const api = {
  async getPortfolio() {
    const response = await fetch('/api/portfolios', {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch portfolio');
    }

    return response.json();
  },

  async getAssets() {
    const response = await fetch('/api/assets', {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch assets');
    }

    return response.json();
  },

  getPortfolioSummary: async (portfolioId: string) => {
    const res = await fetch(`/api/portfolios/${portfolioId}/summary`,
      {
        credentials: "include",
      }
    );

    if (!res.ok) throw new Error("Failed");

    return res.json();
  },

  async authMe() {
    const response = await fetch('/api/auth/me', {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Not authenticated');
    }

    return response.json();
  },

  async getTransactions(portfolioId: string) {
    const response = await fetch(`/api/transactions/portfolio/${portfolioId}`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    return response.json();
  },

  async logout() {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    return response.json().catch(() => null);
  },

  async createPortfolio(portfolioName: string) {
    const response = await fetch('/api/portfolios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        portfolioName,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create portfolio');
    }

    return response.json();
  },

  async createTransaction(payload: {
    portfolioId: string;
    assetId: string;
    transactionType: string;
    quantity: number;
    pricePerShare: number;
  }) {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to create transaction');
    }

    return response.json();
  },

  async login(email: string, password: string) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || 'Login failed');
    }

    return data;
  },

  async register(name: string, email: string, password: string) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || 'Registration failed');
    }

    return data;
  },

  async updateTransaction(
    transactionId: string,
    payload: {
      quantity: number;
      pricePerShare: number;
      transactionType: "BUY" | "SELL";
    }
  ) {
    const response = await fetch(`/api/transactions/${transactionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to update transaction");
    }

    return data;
  },
};