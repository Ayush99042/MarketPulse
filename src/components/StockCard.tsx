import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { Card } from './Card';
import type { Ticker } from '../api/queries';

interface StockCardProps {
  ticker: Ticker;
  onClick: () => void;
}

export const StockCard: React.FC<StockCardProps> = ({ ticker, onClick }) => {
  const firstLetter = ticker.name.charAt(0).toUpperCase();
  const colors = [
    'bg-blue-500', 'bg-emerald-500', 'bg-indigo-500',
    'bg-violet-500', 'bg-cyan-500', 'bg-teal-500'
  ];
  const colorIndex = ticker.symbol.charCodeAt(0) % colors.length;
  const avatarColor = colors[colorIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <Card className="relative overflow-hidden h-full border-gray-200 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 p-5 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm shadow-sm hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl ${avatarColor} flex items-center justify-center text-white font-black text-xl shadow-lg shadow-inherit/20`}>
            {firstLetter}
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-100 dark:border-blue-800/50">
            <TrendingUp className="h-3 w-3" />
            Live tracking
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[3rem]">
            {ticker.name}
          </h3>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 font-mono tracking-tighter">
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
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full" />
      </Card>
    </motion.div>
  );
};
