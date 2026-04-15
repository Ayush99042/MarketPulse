import { create } from "zustand";

type Transaction = {
  id: string;
  type: "ADD" | "WITHDRAW";
  amount: number;
  date: string;
};

type WalletState = {
  balance: number;
  transactions: Transaction[];
  addMoney: (amount: number) => void;
  withdrawMoney: (amount: number) => void;
};

export const useWalletStore = create<WalletState>((set) => ({
  balance: 8086.96,
  transactions: [],

  addMoney: (amount) =>
    set((state) => ({
      balance: state.balance + amount,
      transactions: [
        {
          id: Date.now().toString(),
          type: "ADD",
          amount,
          date: new Date().toISOString(),
        },
        ...state.transactions,
      ],
    })),

  withdrawMoney: (amount) =>
    set((state) => {
      if (amount > state.balance) return state;
      return {
        balance: state.balance - amount,
        transactions: [
          {
            id: Date.now().toString(),
            type: "WITHDRAW",
            amount,
            date: new Date().toISOString(),
          },
          ...state.transactions,
        ],
      };
    }),
}));