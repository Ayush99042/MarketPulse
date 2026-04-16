import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Wallet,
  CheckCircle,
  QrCode,
  IndianRupee,
  Send,
  ShieldCheck,
  RefreshCcw,
  Sparkles,
  ArrowDownCircle,
  ArrowUpCircle,
  Banknote,
} from "lucide-react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { useWalletStore } from "../hooks/walletStore";

type Step = "ENTER" | "QR" | "CONFIRM_WITHDRAW" | "SUCCESS";
type Mode = "ADD" | "WITHDRAW";

export const AddMoney: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode =
    searchParams.get("mode") === "withdraw" ? "WITHDRAW" : "ADD";

  const [step, setStep] = useState<Step>("ENTER");
  const [mode, setMode] = useState<Mode>(initialMode);
  const [amount, setAmount] = useState<number>(0);
  const balance = useWalletStore((state) => state.balance);
  const addMoney = useWalletStore((state) => state.addMoney);
  const withdrawMoney = useWalletStore((state) => state.withdrawMoney);
  const upiLink = `upi://pay?pa=ayushmarakana294@oksbi&pn=Ayush Marakana&am=${amount}&cu=INR`;

  const handleContinue = () => {
    if (amount <= 0) return;
    if (mode === "WITHDRAW" && amount > balance) return;
    setStep(mode === "ADD" ? "QR" : "CONFIRM_WITHDRAW");
  };

  const handleSuccess = () => {
    if (mode === "ADD") {
      addMoney(amount);
    } else {
      withdrawMoney(amount);
    }
    setStep("SUCCESS");
  };

  const quickAmounts =
    mode === "ADD" ? [1000, 2000, 5000, 10000] : [500, 1000, 2000, 5000];

  return (
    <div className="relative overflow-hidden selection:bg-blue-500/30">
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center py-10">
        <div className="w-full max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate(-1)}
              className="group flex items-center gap-3 text-gray-400 hover:text-white transition-all bg-white/5 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-md"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">
                Back
              </span>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 bg-blue-500/10 px-5 py-2.5 rounded-2xl border border-blue-500/20 backdrop-blur-md"
            >
              <Wallet className="w-5 h-5 text-blue-500" />
              <span className="text-lg font-black text-gray-900 dark:text-white font-mono leading-none">
                ₹
                {balance.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            {step === "ENTER" && (
              <motion.div
                key="enter"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{ type: "spring", bounce: 0.3 }}
              >
                <Card
                  glass={true}
                  className="p-10 border-white/10 overflow-hidden relative group "
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    {mode === "ADD" ? (
                      <IndianRupee size={120} className="text-blue-500" />
                    ) : (
                      <Banknote size={120} className="text-emerald-500" />
                    )}
                  </div>

                  <div className="relative z-10 space-y-8">
                    {/* Toggle Bar */}
                    <div className="flex p-1.5 bg-gray-100 dark:bg-black/20 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/5 max-w-sm">
                      <button
                        onClick={() => {
                          setMode("ADD");
                          setAmount(0);
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          mode === "ADD"
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        <ArrowDownCircle className="w-3.5 h-3.5" />
                        Add Money
                      </button>
                      <button
                        onClick={() => {
                          setMode("WITHDRAW");
                          setAmount(0);
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          mode === "WITHDRAW"
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                            : "text-gray-500 hover:text-gray-300"
                        }`}
                      >
                        <ArrowUpCircle className="w-3.5 h-3.5" />
                        Withdraw
                      </button>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
                        {mode === "ADD"
                          ? "Inject Liquidity"
                          : "Extract Liquidity"}
                      </h2>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] max-w-xs leading-relaxed">
                        {mode === "ADD"
                          ? "Instant availability. Safe. Secure."
                          : "Settlement in 24h. Institutional Grade."}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="relative group/input">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-blue-500 transition-colors">
                          <IndianRupee
                            className={`w-6 h-6 font-black ${mode === "WITHDRAW" ? "text-emerald-500" : "text-blue-500"}`}
                          />
                        </div>
                        <input
                          type="number"
                          placeholder="0"
                          value={amount || ""}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          className="no-spinner w-full pl-14 pr-6 py-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-white/10 text-2xl font-black text-gray-900 dark:text-white outline-none focus:border-blue-500/50 focus:bg-blue-500/[0.02] transition-all font-mono placeholder:text-gray-200 dark:placeholder:text-white/5"
                        />
                      </div>

                      <div className="grid grid-cols-4 gap-3">
                        {quickAmounts.map((amt) => (
                          <button
                            key={amt}
                            onClick={() => setAmount(amt)}
                            className={`py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-white/5 text-[10px] font-black text-gray-500 hover:text-white transition-all uppercase tracking-widest shadow-sm ${
                              mode === "ADD"
                                ? "hover:bg-blue-600"
                                : "hover:bg-emerald-600"
                            }`}
                          >
                            +{amt}
                          </button>
                        ))}
                      </div>

                      {mode === "WITHDRAW" && amount > balance && (
                        <p className="text-[9px] font-black text-red-500 uppercase tracking-widest text-center">
                          Insufficient Liquidity Available
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={handleContinue}
                      disabled={
                        amount <= 0 || (mode === "WITHDRAW" && amount > balance)
                      }
                      className={`w-full py-5 text-sm font-black uppercase tracking-[0.4em] rounded-2xl shadow-2xl group overflow-hidden relative ${
                        mode === "ADD"
                          ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
                          : "bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-emerald-500/20"
                      }`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3 leading-none text-white">
                        {mode === "ADD"
                          ? "Secure Initiation"
                          : "Request Extraction"}
                        <Send className="w-4 h-4" />
                      </span>
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-gray-500 text-[9px] font-black uppercase tracking-[0.3em]">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      Institutional Grade SSL Encrypted
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {step === "QR" && mode === "ADD" && (
              <motion.div
                key="qr"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="space-y-4"
              >
                <Card
                  glass={true}
                  className="p-8 border-white/10 text-center space-y-8 relative overflow-hidden"
                >
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                      Scan QR Code
                    </h3>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">
                      Universal UPI Gateway
                    </p>
                  </div>

                  <div className="relative mx-auto w-fit p-4 bg-white rounded-3xl shadow-2xl ring-1 ring-white/20">
                    <QRCodeCanvas
                      value={upiLink}
                      size={180}
                      level="H"
                      includeMargin={true}
                      imageSettings={{
                        src: "/logo.png",
                        height: 40,
                        width: 40,
                        excavate: true,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                      <QrCode size={80} className="text-blue-900" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="text-[8px] font-black text-gray-500 uppercase tracking-[0.5em] mb-1">
                        Request Origin
                      </div>
                      <div className="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
                        ₹
                        {amount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <Button
                        onClick={handleSuccess}
                        className="w-full py-5 !bg-emerald-400 hover:!bg-emerald-700 text-white rounded-xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/40"
                      >
                        Verification Complete
                      </Button>
                      <button
                        onClick={() => setStep("ENTER")}
                        className="flex items-center justify-center gap-2 font-black text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]"
                      >
                        <RefreshCcw className="w-3 h-3" />
                        Modify Amount
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {step === "CONFIRM_WITHDRAW" && mode === "WITHDRAW" && (
              <motion.div
                key="withdraw_confirm"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="space-y-4"
              >
                <Card
                  glass={true}
                  className="p-8 border-white/10 text-center space-y-8 relative overflow-hidden"
                >
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                      Extraction Request
                    </h3>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.4em]">
                      Settlement Authorization
                    </p>
                  </div>

                  <div className="bg-emerald-500/5 p-8 rounded-3xl border border-emerald-500/10 space-y-4">
                    <div className="flex items-center justify-between text-lg font-black text-gray-500 uppercase tracking-widest px-2">
                      <span>Amount</span>
                      <span className="text-gray-900 dark:text-white font-mono">
                        ₹{amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-black text-gray-500 uppercase tracking-widest px-2">
                      <span>Fee</span>
                      <span className="text-emerald-500">₹0.00</span>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 pt-2">
                      <span>Total Extraction</span>
                      <span className="text-xl text-emerald-500 font-mono">
                        ₹{amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-3">
                      <Button
                        onClick={handleSuccess}
                        className="w-full py-5 !bg-emerald-600 hover:!bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/40"
                      >
                        Confirm Extraction
                      </Button>
                      <button
                        onClick={() => setStep("ENTER")}
                        className="flex items-center justify-center gap-2 font-black text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]"
                      >
                        <RefreshCcw className="w-3 h-3" />
                        Modify Amount
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {step === "SUCCESS" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <Card
                  glass={true}
                  className="p-12 border-white/10 space-y-8 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                    className="w-20 h-20 bg-emerald-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/40"
                  >
                    <CheckCircle size={40} className="text-white" />
                  </motion.div>

                  <div className="space-y-2 relative z-10">
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white">
                      Transmission Confirmed
                    </h3>
                    <p
                      className={`text-xs font-black uppercase tracking-[0.4em] ${mode === "ADD" ? "text-emerald-500" : "text-emerald-500"}`}
                    >
                      Successfully {mode === "ADD" ? "Injected" : "Extracted"} ₹
                      {amount.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <p className="text-[10px] text-gray-500/80 leading-relaxed font-bold max-w-[200px] mx-auto">
                    Institutional records have been updated. Your balance
                    reflects the new liquidity state.
                  </p>

                  <Button
                    onClick={() => navigate("/")}
                    className={`w-full py-5 text-white rounded-xl font-black uppercase tracking-[0.3em] shadow-xl group ${
                      mode === "ADD"
                        ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
                        : "bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-emerald-500/20"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-3">
                      Return to Command Center
                      <Sparkles className="w-3 h-3 group-hover:animate-spin" />
                    </span>
                  </Button>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
