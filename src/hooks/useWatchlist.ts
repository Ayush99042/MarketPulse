import { useState, useEffect } from 'react';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('marketpulse_watchlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('marketpulse_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (symbol: string) => {
    setWatchlist((prev) => 
      prev.includes(symbol) 
        ? prev.filter((s) => s !== symbol) 
        : [...prev, symbol]
    );
  };

  const isWatchlisted = (symbol: string) => watchlist.includes(symbol);

  return { watchlist, toggleWatchlist, isWatchlisted, setWatchlist };
};
