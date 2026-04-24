import { useState, useEffect } from "react";
import { useNotificationStore } from "./notificationStore";

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("marketpulse_watchlist");
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
    localStorage.setItem("marketpulse_watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (symbol: string) => {
    const isRemoving = watchlist.includes(symbol);
    const { addNotification } = useNotificationStore.getState();

    if (isRemoving) {
      addNotification(
        "Removed from Watchlist",
        `${symbol} has been removed from your watchlist.`,
        "INFO"
      );
    } else {
      addNotification(
        "Added to Watchlist",
        `${symbol} has been added to your watchlist.`,
        "SUCCESS"
      );
    }

    setWatchlist((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  };

  const isWatchlisted = (symbol: string) => watchlist.includes(symbol);

  return { watchlist, toggleWatchlist, isWatchlisted, setWatchlist };
};
