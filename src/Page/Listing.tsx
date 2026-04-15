import { AnimatePresence, motion } from "framer-motion";
import { Search, X, SlidersHorizontal } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTickers } from "../api/queries";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { StockCard } from "../components/StockCard";
import { FilterDrawer } from "../components/FilterDrawer";

export const Listing: React.FC = () => {
  const [activeExchange, setActiveExchange] = useState(
    () => localStorage.getItem("mp_activeExchange") ?? "XNSE",
  );
  const [sortBy, setSortBy] = useState<string>(
    () => localStorage.getItem("mp_sortBy") ?? "none",
  );

  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">(
    () => (localStorage.getItem("mp_sortOrder") as any) ?? "none",
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { data, isLoading, isError } = useTickers(activeExchange);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [displayCount, setDisplayCount] = useState(12);
  const observerTarget = useRef<HTMLDivElement>(null);

  const exchanges = [
    { label: "NSE", value: "XNSE" },
    { label: "BSE", value: "XBOM" },
    { label: "NASDAQ", value: "XNAS" },
    { label: "NYSE", value: "XNYS" },
    { label: "LSE", value: "XLON" },
    { label: "HKEX", value: "XHKG" },
    { label: "PARIS", value: "XPAR" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setDisplayCount(12);
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const processedData = useMemo(() => {
    if (!data) return [];

    let filtered = data?.filter(
      (ticker) =>
        ticker.name
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        ticker.symbol
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()),
    );

    if (sortBy !== "none" && sortOrder !== "none") {
      filtered = [...filtered].sort((a, b) => {
        const valA = sortBy === "name" ? a.name : a.symbol;
        const valB = sortBy === "name" ? b.name : b.symbol;

        if (sortOrder === "asc") {
          return valA.localeCompare(valB);
        } else {
          return valB.localeCompare(valA);
        }
      });
    }

    return filtered;
  }, [data, debouncedSearchTerm, sortBy, sortOrder]);

  const total = processedData.length;

  const displayedData = useMemo(() => {
    return processedData.slice(0, displayCount);
  }, [processedData, displayCount]);

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

  useEffect(() => {
    localStorage.setItem("mp_activeExchange", activeExchange);
    setDisplayCount(12);
    setSearchTerm("");
    setDebouncedSearchTerm("");
  }, [activeExchange]);
  useEffect(() => {
    localStorage.setItem("mp_sortBy", sortBy);
    localStorage.setItem("mp_sortOrder", sortOrder);
  }, [sortBy, sortOrder]);
  const handleApplyFilters = (filters: {
    exchange: string;
    sortBy: string;
    sortOrder: "asc" | "desc" | "none";
  }) => {
    setActiveExchange(filters.exchange);
    setSortBy(filters.sortBy);
    setSortOrder(filters.sortOrder);
  };

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
    <>
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        activeExchange={activeExchange}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onApply={handleApplyFilters}
        exchanges={exchanges}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-20"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="group flex items-center gap-3 px-5 py-3 rounded-[1.2rem] bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-blue-500/50 transition-all duration-300 shadow-xl shadow-black/5 active:scale-95"
            >
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <span className="text-sm font-black text-gray-700 dark:text-gray-300 group-hover:text-gray-950 dark:group-hover:text-white transition-colors">
                Filters
              </span>
            </button>

            <div className="h-8 w-px bg-gray-200 dark:bg-white/10 hidden md:block" />

            <div className="hidden md:flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Market:
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase">
                {exchanges.find((ex) => ex.value === activeExchange)?.label}
              </span>
              {sortBy !== "none" && (
                <>
                  <div className="h-4 w-px bg-gray-200 dark:bg-white/10 mx-1" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Sort:
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">
                    {sortBy} ({sortOrder})
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="relative group max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder={`Search in ${activeExchange}...`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className="w-full pl-12 pr-12 py-3.5 glass-liquid rounded-[1.5rem] shadow-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-sm font-black text-gray-900 dark:text-white placeholder-gray-500/50"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1">
          {(isLoading || searchTerm !== debouncedSearchTerm) && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-3xl bg-gray-100 dark:bg-gray-800 animate-pulse"
                />
              ))}
            </div>
          )}

          {!isLoading && searchTerm === debouncedSearchTerm && total === 0 && (
            <div className="flex flex-col items-center justify-center h-80 space-y-4">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  No results found
                </p>
                <p className="text-gray-500 text-sm mt-1 italic">
                  "{debouncedSearchTerm}" returned no matches in the directory.
                </p>
              </div>
            </div>
          )}

          {!isLoading && searchTerm === debouncedSearchTerm && total > 0 && (
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
    </>
  );
};
