import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Ticker {
  name: string;
  symbol: string;
  has_intraday: boolean;
  has_eod: boolean;
  country: string;
  stock_exchange: {
    name: string;
    acronym: string;
    mic: string;
    country: string;
    country_code: string;
    city: string;
    website: string;
  };
}

export interface EodData {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adj_high: number;
  adj_low: number;
  adj_close: number;
  adj_open: number;
  adj_volume: number;
  split_factor: number;
  dividend: number;
  symbol: string;
  exchange: string;
  date: string;
}

export const useTickers = (exchange: string = 'XNSE') => {
  return useQuery({
    queryKey: ['tickers', exchange],
    queryFn: async () => {
      const { data } = await axios.get<{ data: Ticker[] }>('/data/tickers.json');
      return data.data;
    },
  });
};

export const usePickers = () => { };

export const useStockDetail = (symbol: string, limit: number = 1000) => {
  return useQuery({
    queryKey: ['eod', symbol, limit],
    queryFn: async () => {

      const cacheKey = `eod_${symbol}_${limit}`;
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData) as EodData[];
      }

      const { data } = await axios.get<{ data: EodData[] }>('/api/v1/eod', {
        params: {
          access_key: import.meta.env.VITE_MARKETSTACK_ACCESS_KEY,
          symbols: symbol,
          limit
        }
      });

      localStorage.setItem(cacheKey, JSON.stringify(data.data));
      return data.data;
    },
    enabled: !!symbol,
  });
};
