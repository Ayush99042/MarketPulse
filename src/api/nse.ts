import axios from 'axios';

export interface NSESockEntry {
  priceInfo: {
    lastPrice: number;
    change: number;
    pChange: number;
    open: number;
    close: number;
    previousClose: number;
  };
  metadata: {
    symbol: string;
    companyName: string;
    industry: string;
  };
}

export const fetchNSEQuote = async (symbol: string): Promise<NSESockEntry> => {
  try {
    const response = await axios.get(`/api-nse/api/quote-equity?symbol=${symbol}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
