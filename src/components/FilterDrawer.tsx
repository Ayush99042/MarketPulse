import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, BarChart3, RotateCcw, ArrowUpDown } from "lucide-react";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeExchange: string;
  sortBy: string;
  sortOrder: "asc" | "desc" | "none";
  onApply: (filters: {
    exchange: string;
    sortBy: string;
    sortOrder: "asc" | "desc" | "none";
  }) => void;
  exchanges: { label: string; value: string }[];
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  activeExchange,
  sortBy,
  sortOrder,
  onApply,
  exchanges,
}) => {
  const [tempExchange, setTempExchange] = useState(activeExchange);
  const [tempSortOrder, setTempSortOrder] = useState(sortOrder);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTempExchange(activeExchange);
      setTempSortOrder(sortOrder);
    }
  }, [isOpen, activeExchange, sortBy, sortOrder]);

  const handleReset = () => {
    setTempExchange("XNSE");
    setTempSortOrder("none");
  };

  const handleApply = () => {
    onApply({
      exchange: tempExchange,
      sortBy: tempSortOrder !== "none" ? "name" : "none",
      sortOrder: tempSortOrder,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 220 }}
            className="fixed inset-y-0 left-0 h-[100dvh] w-[300px] md:w-[400px] bg-white/70 dark:bg-black/60 backdrop-blur-3xl border-r border-white/20 dark:border-white/5 z-[200] shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-8 flex items-center justify-between border-b border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  Filters
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 transition-all group active:scale-90"
              >
                <X className="w-6 h-6 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500">
                  <Globe className="w-4 h-4" />
                  <span className="text-[11px] font-black uppercase tracking-[0.25em]">
                    Market Exchanges
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {exchanges.map((ex) => (
                    <button
                      key={ex.value}
                      onClick={() => setTempExchange(ex.value)}
                      className={`px-4 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-wider transition-all duration-300 border ${
                        tempExchange === ex.value
                          ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/30 -translate-y-0.5"
                          : "bg-white/40 dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-blue-500/30 hover:bg-white/60 dark:hover:bg-white/10"
                      }`}
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500">
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="text-[11px] font-black uppercase tracking-[0.25em]">
                    Sort Order
                  </span>
                </div>
                <div className="flex items-center justify-center gap-12 p-4 rounded-[2rem] bg-white/40 dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-inner">
                  {["asc", "desc"].map((dir) => (
                    <button
                      key={dir}
                      onClick={() =>
                        setTempSortOrder((prev) =>
                          prev === dir ? "none" : (dir as any),
                        )
                      }
                      className="flex items-center gap-3 group cursor-pointer outline-none relative"
                    >
                      <div
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                          tempSortOrder === dir
                            ? "bg-blue-600 border-blue-600 shadow-xl shadow-blue-500/40 scale-110"
                            : "border-gray-300 dark:border-white/20 group-hover:border-blue-500/50"
                        }`}
                      >
                        <AnimatePresence>
                          {tempSortOrder === dir && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="w-3 h-3 rounded-full bg-white shadow-sm"
                            />
                          )}
                        </AnimatePresence>
                      </div>
                      <span
                        className={`text-[12px] font-black uppercase tracking-widest transition-all duration-300 ${
                          tempSortOrder === dir
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200"
                        }`}
                      >
                        {dir === "asc" ? "Asc" : "Desc"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-gray-100 dark:border-white/5 flex gap-4">
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 h-14 rounded-[1.5rem] bg-white/50 dark:bg-white/5 text-gray-600 dark:text-gray-400 font-black text-[11px] uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={handleApply}
                className="flex-[2] h-14 rounded-[1.5rem] bg-blue-600 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/40 hover:scale-[1.02] active:scale-95 transition-all outline-none"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
