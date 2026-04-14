import { AnimatePresence, Reorder, motion } from "framer-motion";
import { Activity, Globe, LineChart, PieChart, Wallet } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTickers } from "../api/queries";
import { StockCard } from "../components/StockCard";
import { WatchlistRow } from "../components/WatchlistRow";

export const Dashboard: React.FC = () => {
  const { data, isLoading } = useTickers("XNSE");
  const navigate = useNavigate();
  const [moverTab, setMoverTab] = useState<"gainers" | "losers">("gainers");

  const getDailyStats = (symbol: string) => {
    const seed = symbol
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const day = new Date().getDate();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const finalSeed = seed + day + month * 31 + year;

    const pseudoRandom = (Math.sin(finalSeed) * 10000) % 1;
    const pChange = pseudoRandom * 7;
    return { pChange };
  };

  const topMovers = useMemo(() => {
    if (!data) return [];
    const marketSample = data.slice(0, 300).map((ticker) => ({
      ...ticker,
      stats: getDailyStats(ticker.symbol),
    }));

    if (moverTab === "gainers") {
      return marketSample
        .sort((a, b) => b.stats.pChange - a.stats.pChange)
        .slice(0, 5);
    } else {
      return marketSample
        .sort((a, b) => a.stats.pChange - b.stats.pChange)
        .slice(0, 5);
    }
  }, [data, moverTab]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="relative w-40 h-20">
          <div className="absolute bottom-0 left-0 w-full h-full flex items-end gap-1">
            {[70, 50, 40, 30, 60, 50, 60, 70].map((h, i) => (
              <div
                key={i}
                className="w-2 bg-green-400 animate-bounce"
                style={{
                  height: `${h}%`,
                  animationDelay: `${i * 0.1}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const recentlyViewed = data?.slice(50, 58) || [];
  const mostBought = data?.slice(10, 14) || [];
  const intradayStocks = data?.slice(40, 44) || [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col space-y-10 pb-20"
    >
      <div className="flex items-center gap-6 overflow-x-auto pb-6 scrollbar-hide border-b border-white/5 whitespace-nowrap">
        {[
          {
            name: "NIFTY 50",
            val: "23,990.85",
            chg: "+215.75",
            pct: "0.91%",
            pos: true,
          },
          {
            name: "SENSEX",
            val: "77,321.85",
            chg: "+690.20",
            pct: "0.90%",
            pos: true,
          },
          {
            name: "BANKNIFTY",
            val: "55,748.30",
            chg: "+926.60",
            pct: "1.69%",
            pos: true,
          },
          {
            name: "MIDCPNIFTY",
            val: "13,348.15",
            chg: "+140.85",
            pct: "1.07%",
            pos: true,
          },
          {
            name: "FINNIFTY",
            val: "26,166.40",
            chg: "-12.30",
            pct: "0.04%",
            pos: false,
          },
        ].map((idx) => (
          <div
            key={idx.name}
            className="flex items-center gap-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 py-1 px-3 rounded-lg transition-colors"
          >
            <span className="text-[11px] font-black tracking-widest text-gray-900 dark:text-gray-100 uppercase">
              {idx.name}
            </span>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300 font-mono">
              {idx.val}
            </span>
            <span
              className={`text-[11px] font-bold ${idx.pos ? "text-emerald-500" : "text-rose-500"}`}
            >
              {idx.chg} ({idx.pct})
            </span>
          </div>
        ))}
        <div className="ml-auto w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0 cursor-pointer">
          <Globe className="w-4 h-4 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors" />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 flex flex-col space-y-10">
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 liquid-text-gradient">
              Recently viewed
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-hide">
              {recentlyViewed.map((ticker) => {
                const stats = getDailyStats(ticker.symbol);
                const isPos = stats.pChange >= 0;
                return (
                  <motion.div
                    key={ticker.symbol}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(`/detail/${ticker.symbol}`)}
                    className="flex flex-col pt-2 items-center min-w-[80px] cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-2xl glass-liquid-alt flex items-center justify-center text-xl font-black text-gray-800 dark:text-white border-white/10 shadow-lg group-hover:shadow-blue-500/20 transition-all">
                      {ticker.name.charAt(0)}
                    </div>
                    <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200 mt-2 truncate w-full text-center">
                      {ticker.symbol.split(".")[0]}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${isPos ? "text-emerald-500" : "text-rose-500"}`}
                    >
                      {isPos ? "+" : ""}
                      {stats.pChange.toFixed(2)}%
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white liquid-text-gradient">
                Most bought stocks
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mostBought.map((ticker) => (
                <StockCard
                  key={ticker.symbol}
                  ticker={ticker}
                  onClick={() => navigate(`/detail/${ticker.symbol}`)}
                />
              ))}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 liquid-text-gradient">
              Top movers today
            </h2>
            <div className="flex items-center gap-2 mb-6">
              {["gainers", "losers"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMoverTab(tab as any)}
                  className={`px-5 py-2.5 rounded-full text-xs font-black tracking-widest capitalize transition-all ${
                    moverTab === tab
                      ? "bg-white text-gray-900 shadow-xl shadow-white/10 scale-105"
                      : "bg-white/5 text-gray-500 hover:bg-white/10"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="glass-liquid rounded-[2rem] overflow-hidden p-2">
              <div className="flex items-center justify-between px-6 py-4 text-[11px] uppercase tracking-[0.2em] font-black text-gray-500 dark:text-white/40 border-b border-gray-100 dark:border-white/5 mb-2">
                <div className="w-[30%]">Company</div>
                <div className="w-[20%] hidden md:block text-center">Trend</div>
                <div className="w-[25%] text-right">Mkt price</div>
                <div className="w-[25%] text-right">Volume</div>
              </div>
              <Reorder.Group
                axis="y"
                values={topMovers.map((t) => t.symbol)}
                onReorder={() => {}}
                className="flex flex-col gap-1"
              >
                <AnimatePresence mode="popLayout">
                  {topMovers.map((ticker) => (
                    <WatchlistRow
                      key={ticker.symbol}
                      ticker={ticker}
                      isEditing={false}
                      onRemove={() => {}}
                      onClick={() => navigate(`/detail/${ticker.symbol}`)}
                    />
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="pt-6"
          >
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 liquid-text-gradient">
              Top intraday stocks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {intradayStocks.map((ticker) => (
                <StockCard
                  key={ticker.symbol}
                  ticker={ticker}
                  onClick={() => navigate(`/detail/${ticker.symbol}`)}
                />
              ))}
            </div>
          </motion.section>
        </div>

        <div className="xl:col-span-4 flex flex-col space-y-8 sticky top-24 self-start">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col space-y-6"
          >
            <h2 className="text-2xl font-black text-gray-900 dark:text-white liquid-text-gradient">
              Your investments
            </h2>
            <div className="glass-liquid rounded-[2.5rem] p-10 relative overflow-hidden group border-white/10">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
              <div className="relative z-10 flex flex-col">
                <div className="flex items-center gap-2 mb-3 opacity-60">
                  <Wallet className="w-5 h-5 text-blue-500" />
                  <span className="text-xs uppercase tracking-[0.2em] font-black text-gray-500 dark:text-white">
                    Current
                  </span>
                </div>
                <div className="text-4xl font-black text-gray-900 dark:text-white font-mono mb-10 tracking-tighter">
                  ₹6,11,000.00
                </div>
                <div className="flex items-center justify-between py-4 border-t border-gray-100 dark:border-white/5">
                  <span className="text-sm font-bold text-gray-500 dark:text-white/40">
                    1D returns
                  </span>
                  <span className="font-black text-emerald-500 font-mono ">
                    +₹11,000.00(2.11%)
                  </span>
                </div>
                <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 dark:border-white/5 mb-4">
                  <span className="text-sm font-bold text-gray-500 dark:text-white/40">
                    Total returns
                  </span>
                  <span className="font-black text-emerald-500 font-mono">
                    +₹91,000.00(17.5%)
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-bold text-gray-500 dark:text-white/40">
                    Invested
                  </span>
                  <span className="font-black text-gray-900 dark:text-white font-mono">
                    ₹5,20,000.00
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 liquid-text-gradient">
              Products & Tools
            </h2>
            <div className="flex flex-col glass-liquid rounded-[2rem] overflow-hidden">
              {[
                {
                  icon: PieChart,
                  name: "IPO",
                  count: "1 open",
                  c: "text-emerald-400 bg-emerald-400/10",
                },
                {
                  icon: LineChart,
                  name: "Bonds",
                  count: "10 open",
                  c: "text-blue-400 bg-blue-400/10",
                },
                {
                  icon: Activity,
                  name: "ETFs",
                  count: null,
                  c: "text-purple-400 bg-purple-400/10",
                },
                {
                  icon: Globe,
                  name: "All Stocks screener",
                  count: null,
                  c: "text-amber-400 bg-amber-400/10",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  whileHover={{
                    x: 10,
                    backgroundColor: "rgba(255,255,255,0.05)",
                  }}
                  className={`flex items-center justify-between p-5 cursor-pointer transition-colors ${i !== 0 ? "border-t border-white/5" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${item.c}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="font-black text-sm text-gray-900 dark:text-white tracking-tight">
                      {item.name}
                    </span>
                  </div>
                  {item.count && (
                    <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">
                      {item.count}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white liquid-text-gradient">
                Trading Screens
              </h2>
            </div>

            <div className="flex flex-col glass-liquid rounded-[2rem] p-3 gap-3">
              {[
                {
                  tag: "Bullish",
                  color: "emerald",
                  name: "Resistance breakouts",
                  icon: "📈",
                },
                {
                  tag: "Bullish",
                  color: "emerald",
                  name: "MACD above signal line",
                  icon: "⚡",
                },
                {
                  tag: "Bearish",
                  color: "rose",
                  name: "RSI overbought",
                  icon: "📉",
                },
              ].map((scr) => (
                <motion.div
                  key={scr.name}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group border border-white/5"
                >
                  <div className="flex flex-col">
                    <span
                      className={`text-[8px] font-black uppercase tracking-widest mb-2 ${scr.color === "emerald" ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"} self-start px-2 py-1 rounded-md`}
                    >
                      {scr.tag}
                    </span>
                    <span className="font-black text-sm text-gray-900 dark:text-white">
                      {scr.name}
                    </span>
                  </div>
                  <div className="w-14 h-14 glass-liquid-alt relative rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-white/10 group-hover:rotate-6 transition-transform">
                    {scr.icon}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
