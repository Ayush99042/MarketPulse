import { AnimatePresence, Reorder } from "framer-motion";
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

  if (isLoading || !data) {
    return (
      <div className="flex justify-center py-40">
        <Activity className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  const recentlyViewed = data.slice(50, 58);
  const mostBought = data.slice(10, 14);
  const intradayStocks = data.slice(40, 44);

  return (
    <div className="flex flex-col space-y-6 pb-20 animate-in fade-in duration-700">
      <div className="flex items-center gap-6 overflow-x-auto pb-4 scrollbar-hide border-b border-black/5 dark:border-white/5 whitespace-nowrap">
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
          <section>
            <h2 className="text-xl font-black  text-gray-900 dark:text-white mb-4">
              Recently viewed
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 pt-2 scrollbar-hide">
              {recentlyViewed.map((ticker) => {
                const isPos = ticker.symbol.charCodeAt(0) % 2 === 0;
                return (
                  <div
                    key={ticker.symbol}
                    onClick={() => navigate(`/detail/${ticker.symbol}`)}
                    className="flex flex-col items-center min-w-[70px] cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center text-lg font-black text-gray-800 dark:text-white border border-gray-200 dark:border-white/10 shadow-sm group-hover:-translate-y-1 transition-transform">
                      {ticker.name.charAt(0)}
                    </div>
                    <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200 mt-2 truncate w-full text-center">
                      {ticker.symbol.split(".")[0]}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${isPos ? "text-emerald-500" : "text-rose-500"}`}
                    >
                      {isPos ? "+" : "-"}
                      {(Math.random() * 5).toFixed(2)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black  text-gray-900 dark:text-white">
                Most bought stocks
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {mostBought.map((ticker) => (
                <StockCard
                  key={ticker.symbol}
                  ticker={ticker}
                  onClick={() => navigate(`/detail/${ticker.symbol}`)}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">
              Top movers today
            </h2>
            <div className="flex items-center gap-2 mb-4">
              {["gainers", "losers"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMoverTab(tab as any)}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide capitalize transition-colors ${
                    moverTab === tab
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                      : "bg-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-black text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10 mb-2 bg-gray-100 dark:bg-white/5 rounded-t-2xl">
              <div className="w-[30%]">Company</div>
              <div className="w-[20%] hidden md:block text-center">Trend</div>
              <div className="w-[25%] text-right font-bold">Mkt price (1D)</div>
              <div className="w-[25%] text-right font-bold">Volume</div>
            </div>
            <Reorder.Group
              axis="y"
              values={topMovers.map((t) => t.symbol)}
              onReorder={() => {}}
              className="flex flex-col"
            >
              <AnimatePresence mode="popLayout">
                {topMovers.map((ticker) => (
                  <div
                    key={ticker.symbol}
                    className="border-b border-gray-100 dark:border-white/[0.05] last:border-0"
                  >
                    <WatchlistRow
                      ticker={ticker}
                      isEditing={false}
                      onRemove={() => {}}
                      onClick={() => navigate(`/detail/${ticker.symbol}`)}
                    />
                  </div>
                ))}
              </AnimatePresence>
            </Reorder.Group>
          </section>

          <section className="pt-6">
            <h2 className="text-xl font-black  text-gray-900 dark:text-white mb-4">
              Top intraday stocks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {intradayStocks.map((ticker) => (
                <StockCard
                  key={ticker.symbol}
                  ticker={ticker}
                  onClick={() => navigate(`/detail/${ticker.symbol}`)}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="xl:col-span-4 flex flex-col space-y-8 sticky top-24 self-start">
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              Your investments
            </h2>
            <div className="bg-white dark:bg-gray-900 shadow-xl rounded-[2rem] p-8 border border-gray-200 dark:border-white/10 relative overflow-hidden group">
              <div className="hidden dark:block absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[40px] rounded-full pointer-events-none" />
              <div className="relative z-10 flex flex-col">
                <div className="flex items-center gap-2 mb-2 opacity-70">
                  <Wallet className="w-4 h-4 text-blue-500 dark:text-white" />
                  <span className="text-xs uppercase tracking-widest font-bold text-gray-500 dark:text-white">
                    Current
                  </span>
                </div>
                <div className="text-4xl font-black text-gray-900 dark:text-white font-mono mb-8">
                  ₹5,96,800
                </div>
                <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-white/10">
                  <span className="text-xs font-bold text-gray-500 dark:text-white/50">
                    1D returns
                  </span>
                  <span className="font-black text-emerald-500 font-mono">
                    +₹5,600.00 (1.02%)
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-t border-b border-gray-200 dark:border-white/10 mb-3">
                  <span className="text-xs font-bold text-gray-500 dark:text-white/50">
                    Total returns
                  </span>
                  <span className="font-black text-emerald-500 font-mono">
                    +₹45,800.00 (8.31%)
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold text-gray-500 dark:text-white/50">
                    Invested
                  </span>
                  <span className="font-black text-gray-900 dark:text-white font-mono">
                    ₹5,51,000
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <h2 className="text-xl font-black  text-gray-900 dark:text-white mb-4">
              Products & Tools
            </h2>
            <div className="flex flex-col border border-black/10 dark:border-white/10 rounded-3xl bg-white/50 dark:bg-gray-950/80 backdrop-blur-xl">
              {[
                {
                  icon: PieChart,
                  name: "IPO",
                  count: "1 open",
                  c: "text-emerald-500 bg-emerald-500/10",
                },
                {
                  icon: LineChart,
                  name: "Bonds",
                  count: "10 open",
                  c: "text-blue-500 bg-blue-500/10",
                },
                {
                  icon: Activity,
                  name: "ETFs",
                  count: null,
                  c: "text-purple-500 bg-purple-500/10",
                },
                {
                  icon: Globe,
                  name: "All Stocks screener",
                  count: null,
                  c: "text-amber-500 bg-amber-500/10",
                },
              ].map((item, i) => (
                <div
                  key={item.name}
                  className={`flex items-center justify-between p-4 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${i !== 0 ? "border-t border-black/5 dark:border-white/5" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${item.c}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm  text-gray-900 dark:text-white">
                      {item.name}
                    </span>
                  </div>
                  {item.count && (
                    <span className="text-[10px] uppercase font-black tracking-widest text-emerald-500">
                      {item.count}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black  text-gray-900 dark:text-white">
                Trading Screens
              </h2>
            </div>

            <div className="flex flex-col border border-black/10 dark:border-white/10 rounded-3xl bg-white/50 dark:bg-gray-950/80 backdrop-blur-xl p-2 gap-2">
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
                <div
                  key={scr.name}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="flex flex-col">
                    <span
                      className={`text-[8px] font-black uppercase tracking-widest mb-1 ${scr.color === "emerald" ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10"} self-start px-2 py-0.5 rounded-md`}
                    >
                      {scr.tag}
                    </span>
                    <span className="font-bold text-sm  text-gray-900 dark:text-white group-hover:underline">
                      {scr.name}
                    </span>
                  </div>
                  <div className="w-12 h-12 bg-black/5 dark:bg-black relative rounded-xl flex items-center justify-center text-xl shadow-inner border border-white/5">
                    {scr.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
