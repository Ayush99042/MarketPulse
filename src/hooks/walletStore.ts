import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useNotificationStore } from "./notificationStore";

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

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      balance: 20000.0,
      transactions: [
        {
          id: "m3",
          type: "ADD",
          title: "Groww Balance Deposit",
          description: "UPI/Merchant Settlement",
          amount: 20000.0,
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
          category: "FINANCE",
          balanceAfter: 20000.0,
        },
      ],

      addMoney: (amount) =>
        set((state) => {
          const newBalance = state.balance + amount;
          const { addNotification } = useNotificationStore.getState();
          addNotification(
            "Deposit Successful",
            `₹${amount.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })} has been added to your wallet.`,
            "SUCCESS"
          );
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
          const { addNotification } = useNotificationStore.getState();
          if (amount > state.balance) {
            addNotification(
              "Withdrawal Failed",
              "Insufficient balance for this withdrawal.",
              "ERROR"
            );
            alert("Insufficient balance");
            return state;
          }
          const newBalance = state.balance - amount;
          addNotification(
            "Withdrawal Initiated",
            `₹${amount.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })} is being processed for settlement.`,
            "INFO"
          );
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
    }),
    {
      name: "marketpulse-wallet-storage",
    }
  )
);
