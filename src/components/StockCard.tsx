import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bookmark } from "lucide-react";
import { Card } from "./Card";
import type { Ticker } from "../api/queries";
import { useWatchlist } from "../hooks/useWatchlist";

interface StockCardProps {
  ticker: Ticker;
  onClick: () => void;
}

export const StockCard: React.FC<StockCardProps> = ({ ticker, onClick }) => {
  const { toggleWatchlist, isWatchlisted } = useWatchlist();
  const bookmarked = isWatchlisted(ticker.symbol);

  const firstLetter = ticker.name.charAt(0).toUpperCase();
  const colors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-cyan-500",
    "bg-teal-500",
  ];
  const colorIndex = ticker.symbol.charCodeAt(0) % colors.length;
  const avatarColor = colors[colorIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer h-full"
      onClick={onClick}
    >
      <div className="relative overflow-hidden h-full glass-liquid rounded-[2.5rem] p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20">
        {/* Dynamic Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
        <div className="relative z-10 flex items-start justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-2xl ${avatarColor} flex flex-shrink-0 items-center justify-center text-white font-black text-xl shadow-lg shadow-inherit/20`}
          >
            {firstLetter}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWatchlist(ticker.symbol);
              }}
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <Bookmark
                className={`h-5 w-5 transition-all ${bookmarked ? "fill-blue-500 text-blue-500 scale-110" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
              />
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[3rem]">
            {ticker.name}
          </h3>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 font-mono">
            {ticker.symbol}
          </p>
        </div>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">
            View Analytics
          </span>
          <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-blue-500/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />
      </div>
    </motion.div>
  );
};
