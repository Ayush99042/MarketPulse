import { useState, useEffect } from 'react';
import { fetchNSEQuote } from '../api/nse';
import type { NSESockEntry } from '../api/nse';

export interface LivePriceResult {
  data: NSESockEntry | null;
  price: number | null;
  prevPrice: number | null;
  direction: 'up' | 'down' | 'stable';
  loading: boolean;
  error: string | null;
}

export const useLivePrice = (symbol: string | undefined): LivePriceResult => {
  const [data, setData] = useState<NSESockEntry | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);
  const [direction, setDirection] = useState<'up' | 'down' | 'stable'>('stable');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;

    let isMounted = true;
    let oldPrice: number | null = null;

    const checkMarketOpen = () => {
      const now = new Date();

      const hours = now.getHours();
      const minutes = now.getMinutes();
      const timeInMinutes = hours * 60 + minutes;

      const openTime = 9 * 60 + 15;
      const closeTime = 15 * 60 + 35;

      return timeInMinutes >= openTime && timeInMinutes < closeTime;
    };

    const fetchPrice = async () => {
      try {
        const result = await fetchNSEQuote(symbol);
        if (!isMounted) return;

        if (!result || !result.priceInfo) {
          return;
        }

        const newPrice = result.priceInfo.lastPrice;

        setData(result);
        setPrevPrice(oldPrice);
        setPrice(newPrice);

        if (result.priceInfo.pChange !== undefined) {
          if (result.priceInfo.pChange >= 0) setDirection('up');
          else setDirection('down');
        }

        oldPrice = newPrice;
        setLoading(false);
        setError(null);
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Polling error:', err);
        if (loading) {
          setError('Failed to fetch live price');
          setLoading(false);
        }
      }
    };

    fetchPrice();


    let interval: any;
    if (checkMarketOpen()) {
      interval = setInterval(fetchPrice, 3500);
    }

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [symbol]);

  return { data, price, prevPrice, direction, loading, error };
};
