import React, { useMemo, useState, useEffect } from 'react';
import { Reorder, motion, AnimatePresence } from 'framer-motion';
import { X, GripVertical } from 'lucide-react';
import type { Ticker } from '../api/queries';
import { useLivePrice } from '../hooks/useLivePrice';

interface WatchlistRowProps {
  ticker: Ticker;
  isEditing: boolean;
  shares?: number;
  onClick: () => void;
  onRemove: () => void;
}

const Sparkline: React.FC<{ data: number[], color: string }> = ({ data, color }) => {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 30;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

export const WatchlistRow: React.FC<WatchlistRowProps> = ({ ticker, isEditing, shares = 1, onClick, onRemove }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!isEditing) setShowConfirm(false);
  }, [isEditing]);

  const nseSymbol = ticker.symbol.split('.')[0];
  const { data: liveData, price: livePrice } = useLivePrice(nseSymbol, 15000);

  const firstLetter = ticker.name.charAt(0).toUpperCase();

  const trendData = useMemo(() => {
    if (!liveData) return Array(20).fill(100);
    const result = [];
    const openPrice = liveData.priceInfo.open || liveData.priceInfo.previousClose;
    const startPrice = openPrice;
    const endPrice = livePrice || startPrice;

    let current = startPrice;
    const baseSeed = ticker.symbol.charCodeAt(0) + startPrice;
    const pts = 20;
    for (let i = 0; i <= pts; i++) {
      const pr = Math.abs(Math.sin(baseSeed + i * 2) * 10000) % 1;
      current += (endPrice - startPrice) / pts + (pr - 0.5) * (startPrice * 0.002);
      result.push(i === pts ? endPrice : current);
    }
    return result;
  }, [livePrice, liveData, ticker.symbol]);

  const pChange = liveData?.priceInfo.pChange ?? 0;
  const change = liveData?.priceInfo.change ?? 0;
  const isPositive = pChange >= 0;
  const color = isPositive ? '#10b981' : '#f43f5e';
  const textColorClass = isPositive ? 'text-emerald-500' : 'text-rose-500';

  const wkMax = liveData?.priceInfo.weekHighLow.max || 100;
  const wkMin = liveData?.priceInfo.weekHighLow.min || 0;
  const curPr = livePrice || 50;
  const perfPct = Math.min(Math.max(((curPr - wkMin) / (wkMax - wkMin)) * 100, 0), 100);

  const dummyVol = useMemo(() => {
    const pr = liveData?.priceInfo.previousClose || 100;
    const mult = ((ticker.symbol.charCodeAt(0) + ticker.symbol.charCodeAt(1)) % 10) + 1;
    return Math.floor(pr * 1234 * mult);
  }, [liveData, ticker.symbol]);

  return (
    <Reorder.Item
      value={ticker.symbol}
      id={ticker.symbol}
      dragListener={isEditing}
      whileDrag={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)', zIndex: 50, cursor: 'grabbing' }}
      className={`group relative flex items-center justify-between px-6 py-4 mb-2 bg-white/50 dark:bg-black/20 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors shadow-sm ${isEditing ? 'cursor-grab active:cursor-grabbing pr-24' : ''}`}
    >
      <div className="flex items-center gap-4 w-[35%] sm:w-[30%] lg:w-[25%] cursor-pointer" onClick={onClick}>
        {isEditing && (
          <GripVertical className="h-5 w-5 text-gray-400 mr-1 cursor-grab active:cursor-grabbing" />
        )}
        <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900/50 flex flex-shrink-0 items-center justify-center text-gray-900 dark:text-gray-100 font-black text-lg border border-gray-200 dark:border-white/10 shadow-sm">
          {firstLetter}
        </div>
        <div className="overflow-hidden">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate ">{ticker.name}</h3>
          <p className="text-[9px] uppercase font-bold text-gray-500 dark:text-gray-400 mt-0.5 tracking-widest">{shares} share{shares !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="w-[15%] hidden md:flex items-center justify-center pointer-events-none">
        {!liveData ? (
          <div className="w-16 h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        ) : (
          <Sparkline data={trendData} color={color} />
        )}
      </div>

      <div className="w-[20%] md:w-[15%] text-right cursor-pointer" onClick={onClick}>
        <div className="text-[13px] font-black text-gray-900 dark:text-gray-100 font-mono er">
          {livePrice ? `₹${livePrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
        </div>
      </div>

      <div className="w-[25%] md:w-[20%] text-right font-mono er cursor-pointer" onClick={onClick}>
        {liveData ? (
          <div className={`text-[12px] font-bold ${textColorClass}`}>
            {isPositive ? '+' : '-'}{Math.abs(change).toLocaleString('en-IN', { minimumFractionDigits: 2 })} ({Math.abs(pChange).toFixed(2)}%)
          </div>
        ) : '-'}
      </div>

      <div className="w-[15%] hidden lg:block text-right cursor-pointer" onClick={onClick}>
        <div className="text-[13px] font-bold text-gray-900 dark:text-white font-mono ">
          {dummyVol.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </div>
      </div>

      <div className="w-[10%] hidden xl:flex items-center gap-2 justify-end cursor-pointer" onClick={onClick}>
        <span className="text-[9px] font-black text-gray-400 dark:text-gray-500">L</span>
        <div className="relative w-16 h-[3px] bg-gray-200 dark:bg-gray-800 rounded-full">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-[5px] h-[10px] bg-gray-900 dark:bg-white rounded-full outline outline-[1px] outline-white/20 shadow-sm transition-all duration-500"
            style={{ left: `${perfPct}%` }}
          />
        </div>
        <span className="text-[9px] font-black text-gray-400 dark:text-gray-500">H</span>
      </div>

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute right-4 flex items-center justify-end"
          >
            {showConfirm ? (
              <div className="flex items-center gap-1.5 bg-rose-500/10 p-1.5 rounded-xl border border-rose-500/20 backdrop-blur-md shadow-lg">
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove(); }}
                  className="text-[10px] font-black text-white bg-rose-500 px-3 py-1.5 rounded-lg hover:bg-rose-600 transition-colors shadow-sm whitespace-nowrap"
                >
                  Remove
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }}
                  className="text-[10px] font-black text-rose-500/80 hover:text-rose-500 px-2 py-1.5 transition-colors whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
                className="p-2 bg-rose-500/10 text-rose-500 rounded-full hover:bg-rose-500 hover:text-white transition-colors"
                title="Remove from Watchlist"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
};
