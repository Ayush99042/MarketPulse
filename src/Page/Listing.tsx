import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTickers } from "../api/queries";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { StockCard } from "../components/StockCard";

export const Listing: React.FC = () => {
  const { data, isLoading, isError } = useTickers("XNSE");
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [displayCount, setDisplayCount] = useState(12);
  const observerTarget = useRef<HTMLDivElement>(null);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(
      (ticker) =>
        ticker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticker.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [data, searchTerm]);

  const total = filteredData.length;

  const displayedData = useMemo(() => {
    return filteredData.slice(0, displayCount);
  }, [filteredData, displayCount]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayCount < total) {
          setDisplayCount((prev) => Math.min(prev + 8, total));
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [displayCount, total]);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Card className="p-8 text-center bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20">
          <p className="text-red-600 dark:text-red-400 font-semibold text-lg">
            Failed to load market data
          </p>
          <p className="text-sm text-red-500/70 mt-1">
            Please check your network or try again later.
          </p>
          <Button
            variant="outline"
            className="mt-6 border-red-200 text-red-600"
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20"
    >
      <div className="flex justify-end pb-4">
        <div className="relative group max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search company or symbol..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setDisplayCount(12);
            }}
            className="w-full pl-12 pr-12 py-3.5 glass-liquid rounded-[1.5rem] shadow-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-sm font-black text-gray-900 dark:text-white placeholder-gray-500/50"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setDisplayCount(12);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-3xl bg-gray-100 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        )}

        {!isLoading && total === 0 && (
          <div className="flex flex-col items-center justify-center h-80 space-y-4">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                No results found
              </p>
              <p className="text-gray-500 text-sm mt-1 italic">
                "{searchTerm}" returned no matches in the NSE directory.
              </p>
            </div>
          </div>
        )}

        {!isLoading && total > 0 && (
          <div className="flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {displayedData.map((ticker) => (
                  <StockCard
                    key={ticker.symbol}
                    ticker={ticker}
                    onClick={() =>
                      navigate(`/detail/${ticker.symbol}`, {
                        state: { name: ticker.name },
                      })
                    }
                  />
                ))}
              </AnimatePresence>
            </div>

            {displayCount < total && (
              <div
                ref={observerTarget}
                className="w-full h-20 mt-8 flex items-center justify-center"
              >
                <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
