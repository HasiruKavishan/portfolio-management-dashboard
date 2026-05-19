

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
};