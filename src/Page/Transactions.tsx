import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Headset,
  Plus,
} from "lucide-react";
import { Card } from "../components/Card";
import { useWalletStore } from "../hooks/walletStore";
import type { Transaction } from "../hooks/walletStore";

export const Transactions: React.FC = () => {
  const navigate = useNavigate();
  const balance = useWalletStore((state) => state.balance);
  const transactions = useWalletStore((state) => state.transactions);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "ADD":
        return (
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        );
      case "WITHDRAW":
        return (
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        );
      case "STOCK_BUY":
        return (
          <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
            <TrendingDown className="w-5 h-5" />
          </div>
        );
      case "STOCK_SELL":
        return (
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
            <TrendingUp className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-gray-500/10 flex items-center justify-center text-gray-500">
            <Wallet className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen pb-20 container mx-auto px-4 pt-6 max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-28 self-start z-20 bg-background dark:bg-background lg:bg-transparent">
        <div className="space-y-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-gray-400 hover:text-white transition-all bg-white/5 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Back
            </span>
          </motion.button>

          <div className="space-y-1">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white liquid-text-gradient leading-none whitespace-nowrap">
              All Transaction
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">
              Institutional Ledger
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-liquid p-5 rounded-3xl border-white/10 shadow-2xl relative overflow-hidden group"
          >
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Available Balance
              </span>
              <div className="text-4xl font-black text-gray-900 dark:text-white font-mono tracking-tighter">
                {formatCurrency(balance)}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col gap-3">
          {[
            {
              label: "Injected Liquidity",
              sub: "Add Money to Wallet",
              path: "/add-money",
              icon: Plus,
              color: "blue",
            },
            {
              label: "Extract Capital",
              sub: "Withdrawal Request",
              path: "/add-money?mode=withdraw",
              icon: ArrowUpRight,
              color: "emerald",
            },
            {
              label: "System Support",
              sub: "24/7 Priority Access",
              path: "/support",
              icon: Headset,
              color: "emerald",
            },
          ].map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="flex items-center justify-between p-6 glass-liquid rounded-2xl hover:bg-white/5 transition-all group border-white/5 text-left"
            >
              <div className="flex items-center gap-5">
                <div
                  className={`p-3 rounded-2xl bg-${action.color}-500/10 text-${action.color}-500 border border-${action.color}-500/20`}
                >
                  <action.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest block">
                    {action.label}
                  </span>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest opacity-60">
                    {action.sub}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-8 space-y-8 min-h-screen">
        <div className="space-y-4">
          <div className="flex items-center pl-2 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
            <span>Transactions</span>
          </div>

          <div className="space-y-3">
            {transactions.length === 0 ? (
              <Card glass={true} className="p-20 text-center space-y-6">
                <div className="w-24 h-24 bg-blue-500/5 dark:bg-white/5 rounded-2xl mx-auto flex items-center justify-center border border-gray-200/50 dark:border-white/5">
                  <Wallet className="w-10 h-10 text-gray-400 dark:text-gray-700" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                    Ledger Empty
                  </h3>
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em]">
                    Waiting for global connectivity...
                  </p>
                </div>
              </Card>
            ) : (
              transactions.map((tx, idx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{
                    scale: 1.02,
                    y: -4,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card
                    glass={true}
                    className="p-5 px-8 border-gray-100 dark:border-white/5 hover:border-blue-500/20 dark:hover:border-white/10 hover:bg-black/[0.01] dark:hover:bg-white/[0.03] transition-all cursor-pointer overflow-hidden relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-6">
                        {getTransactionIcon(tx.type)}
                        <div className="flex flex-col">
                          <span className="text-md font-bold text-gray-900 dark:text-white">
                            {tx.title}
                          </span>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                              {tx.description}
                            </span>
                            <div className="w-1 h-1 rounded-full bg-white/10" />
                            <span className="text-[9px] font-bold text-gray-500 uppercase">
                              {formatDate(tx.date)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <span
                          className={`text-xl font-black font-mono tracking-tighter ${
                            tx.type === "ADD" || tx.type === "STOCK_SELL"
                              ? "text-emerald-500"
                              : "text-rose-500"
                          }`}
                        >
                          {tx.type === "ADD" || tx.type === "STOCK_SELL"
                            ? "+"
                            : "-"}
                          {tx.amount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                        <span className="text-[12px] font-bold text-gray-500 uppercase">
                          Bal: {formatCurrency(tx.balanceAfter)}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
