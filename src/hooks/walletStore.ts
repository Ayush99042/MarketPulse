import { create } from "zustand";

export type Transaction = {
  id: string;
  type: "ADD" | "WITHDRAW" | "STOCK_BUY" | "STOCK_SELL";
  title: string;
  description: string;
  amount: number;
  date: string;
  category: "FINANCE" | "TRADING" | "SETTLEMENT";
  balanceAfter: number;
};

type WalletState = {
  balance: number;
  transactions: Transaction[];
  addMoney: (amount: number) => void;
  withdrawMoney: (amount: number) => void;
};

export const useWalletStore = create<WalletState>((set) => ({
  balance: 20000.00,
  transactions: [
    {
      id: "m3",
      type: "ADD",
      title: "Groww Balance Deposit",
      description: "UPI/Merchant Settlement",
      amount: 20000.0,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
      category: "FINANCE",
      balanceAfter: 20000.00,
    },
  ],

  addMoney: (amount) =>
    set((state) => {
      const newBalance = state.balance + amount;
      return {
        balance: newBalance,
        transactions: [
          {
            id: crypto.randomUUID(),
            type: "ADD",
            title: "Injected Liquidity",
            description: "UPI Deposit Successful",
            amount,
            date: new Date().toISOString(),
            category: "FINANCE",
            balanceAfter: newBalance,
          },
          ...state.transactions,
        ],
      };
    }),

  withdrawMoney: (amount) =>
    set((state) => {
      if (amount > state.balance) {
        alert("Insufficient balance");
        return state;
      }
      const newBalance = state.balance - amount;
      return {
        balance: newBalance,
        transactions: [
          {
            id: crypto.randomUUID(),
            type: "WITHDRAW",
            title: "Extracted Liquidity",
            description: "Settlement in Progress",
            amount,
            date: new Date().toISOString(),
            category: "SETTLEMENT",
            balanceAfter: newBalance,
          },
          ...state.transactions,
        ],
      };
    }),
}));