import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  CheckCircle2,
  ArrowLeft,
  Mail,
  MessageSquare,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export const Support: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("https://formspree.io/f/mnjlqqaa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          subject,
          message,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const data = await response.json();
        throw new Error(data.error || "Signal transmission failed.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to reach protocol hub.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-liquid p-12 rounded-[3rem] max-w-md w-full text-center space-y-6"
        >
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">
            Signal Received
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Our concierge team has been notified. We will reach out to you at{" "}
            <span className="text-blue-500 font-bold">{email}</span> within the
            next 24 hours.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="w-full h-14 rounded-2xl text-lg font-black tracking-tight mt-4"
          >
            Return to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              24/7 Concierge Support
            </h1>
            <p className="text-gray-500 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Institutional Response Protocol Active
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-12">
            <div className="glass-liquid p-8 lg:p-12 rounded-[3rem] border-white/20 shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000" />

              <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
                      Your Email ID
                    </label>
                    <div className="relative group/field">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/field:text-blue-500 transition-colors" />
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="test123@gmail.com"
                        className="w-full h-16 pl-14 pr-6 rounded-2xl bg-black/5 dark:bg-white/5 border-none focus:ring-2 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
                      Subject
                    </label>
                    <div className="relative group/field">
                      <Info className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/field:text-blue-500 transition-colors" />
                      <input
                        required
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Inquiry regarding..."
                        className="w-full h-16 pl-14 pr-6 rounded-2xl bg-black/5 dark:bg-white/5 border-none focus:ring-2 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
                    Describe your issue
                  </label>
                  <div className="relative group/field">
                    <MessageSquare className="absolute left-5 top-6 w-5 h-5 text-gray-400 group-focus-within/field:text-blue-500 transition-colors" />
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please provide as much detail as possible..."
                      className="w-full min-h-[200px] pl-14 pr-6 py-6 rounded-3xl bg-black/5 dark:bg-white/5 border-none focus:ring-2 focus:outline-none"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-bold flex items-center gap-3"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    {error}
                  </motion.div>
                )}

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="text-xs font-bold text-gray-500 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Encrypted SSL Handshake Enabled
                  </div>
                  <Button
                    disabled={isSubmitting}
                    className="w-full sm:w-64 h-16 rounded-2xl text-lg font-black tracking-tight shadow-xl shadow-blue-500/20 active:scale-95 transition-transform"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Send Support Signal</span>
                        <Send className="w-5 h-5" />
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
