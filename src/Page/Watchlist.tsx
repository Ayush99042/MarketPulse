import { AnimatePresence, motion, Reorder } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  Bookmark,
  Check,
  Edit2,
  Plus,
  Search,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTickers } from "../api/queries";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { WatchlistRow } from "../components/WatchlistRow";
import { useWatchlist } from "../hooks/useWatchlist";

export const Watchlist: React.FC = () => {
  const { data, isLoading, isError } = useTickers("XNSE");
  const { watchlist, setWatchlist, toggleWatchlist } = useWatchlist();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const displayedSymbols = useMemo(() => {
    if (!searchTerm) return watchlist;
    const term = searchTerm.toLowerCase();
    return watchlist.filter((symbol) => {
      const t = data?.find((d) => d.symbol === symbol);
      if (!t) return false;
      return (
        t.name.toLowerCase().includes(term) ||
        symbol.toLowerCase().includes(term)
      );
    });
  }, [watchlist, searchTerm, data]);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Card className="p-8 text-center bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20">
          <p className="text-red-600 dark:text-red-400 font-semibold text-lg">
            Failed to load watchlist data
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
      className="flex flex-col space-y-8 animate-in fade-in duration-700 pb-32"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white flex items-center gap-4 mt-2">
          <div className="p-4 glass-liquid rounded-[1.75rem] text-blue-500 shadow-xl">
            <Bookmark className="h-8 w-8 fill-blue-500" />
          </div>
          My <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent italic ml-2">Watchlist</span>
        </h1>

        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="px-6 py-2.5 mt-2 sm:mt-0 glass-liquid-alt rounded-2xl hover:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-all font-black border-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="text-[10px] uppercase tracking-[0.2em]">
            Back to Market
          </span>
        </Button>
      </div>

      <div className="flex-1 mt-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Activity className="h-10 w-10 animate-spin text-blue-500" />
          </div>
        ) : watchlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-20 mt-10 rounded-[3rem] border border-dashed border-gray-300 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20 text-center"
          >
            <Bookmark className="h-16 w-16 text-gray-300 dark:text-gray-700 mb-6" />
            <p className="text-2xl font-black text-gray-400 dark:text-gray-500 ">
              Your watchlist is empty
            </p>
            <p className="text-gray-400 dark:text-gray-600 font-medium mt-2 max-w-md">
              Browse the market directory and click the bookmark icon on any
              asset to pin it here.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="mt-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 font-bold px-8"
            >
              Explore Market Directory
            </Button>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
              <div className="relative group max-w-md w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500/60 transition-colors group-focus-within:text-blue-500" />
                <input
                  type="text"
                  placeholder="Search your watchlist"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-3.5 glass-liquid rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm font-black text-gray-900 dark:text-gray-100 placeholder-gray-500/40"
                />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="rounded-xl flex items-center gap-2 border-gray-300 dark:border-gray-700 hover:border-gray-900 dark:hover:border-white bg-white/50 dark:bg-gray-900/50 font-bold transition-all"
                  onClick={() => navigate("/")}
                >
                  <Plus className="h-4 w-4" /> Add stocks
                </Button>
                <Button
                  variant="outline"
                  className={`rounded-xl flex items-center gap-2 font-bold transition-all ${isEditing ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)]" : "border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 hover:border-gray-900 dark:hover:border-white"}`}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Edit2 className="h-4 w-4" />
                  )}
                  {isEditing ? "Done" : "Edit"}
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="min-w-[800px] lg:min-w-full">
                  <div className="flex items-center justify-between px-6 py-5 text-[10px] uppercase tracking-[0.25em] font-black text-white/30 border-b border-white/5 mb-4 sticky top-0 z-20 glass-liquid">
                    <div className="w-[35%] sm:w-[30%] lg:w-[25%] flex items-center justify-between">
                      <span>Company ({displayedSymbols.length})</span>
                    </div>
                    <div className="w-[15%] hidden md:flex items-center justify-center">
                      Trend
                    </div>
                    <div className="w-[20%] md:w-[15%] text-right cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
                      Mkt price{" "}
                    </div>
                    <div className="w-[25%] md:w-[20%] text-right cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
                      1D change{" "}
                    </div>
                    <div className="w-[15%] hidden lg:block text-right cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
                      1D vol{" "}
                    </div>
                    <div className="w-[10%] hidden xl:block text-right">
                      52W perf
                    </div>
                    {isEditing && <div className="w-10 opacity-0">.</div>}
                  </div>

                  {displayedSymbols.length === 0 ? (
                    <div className="text-center py-10 font-bold text-gray-500">
                      No stocks match your search.
                    </div>
                  ) : (
                    <Reorder.Group
                      axis="y"
                      values={searchTerm ? displayedSymbols : watchlist}
                      onReorder={searchTerm ? () => {} : setWatchlist}
                      className="flex flex-col w-full"
                    >
                      <AnimatePresence initial={false}>
                        {displayedSymbols.map((symbol) => {
                          const ticker = data?.find((t) => t.symbol === symbol);
                          if (!ticker) return null;
                          return (
                            <WatchlistRow
                              key={ticker.symbol}
                              ticker={ticker}
                              isEditing={isEditing}
                              onClick={() =>
                                !isEditing &&
                                navigate(`/detail/${ticker.symbol}`)
                              }
                              onRemove={() => toggleWatchlist(ticker.symbol)}
                            />
                          );
                        })}
                      </AnimatePresence>
                    </Reorder.Group>
                  )}
                </div>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-l from-gray-50 dark:from-gray-950 to-transparent opacity-0 lg:hidden group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
