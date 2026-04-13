import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "./ThemeProvider";
import {
  Moon,
  Sun,
  LayoutDashboard,
  TrendingUp,
  Bookmark,
  Bell,
  ChevronRight,
  Wallet,
  ClipboardList,
  Building2,
  Headset,
  FileText,
  LogOut,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboard },
    { label: "Stocks", path: "/stocks", icon: TrendingUp },
    { label: "Watchlist", path: "/watchlist", icon: Bookmark },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 font-sans transition-colors duration-200 selection:bg-blue-500/30">
      <header className="sticky top-0 z-50 w-full border-b border-black/5 dark:border-white/5 bg-white/70 backdrop-blur-3xl dark:bg-gray-950/70">
        <div className="container mx-auto flex h-16 lg:h-20 items-center justify-between px-4 lg:px-10">
          <div className="flex items-center gap-10">
            <Link
              to="/"
              className="flex items-center gap-2 transition-transform active:scale-95 shrink-0"
            >
              <div className="text-xl lg:text-2xl font-black flex items-center">
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Market
                </span>
                <span className="bg-gradient-to-r from-emerald-500 to-green-400 bg-clip-text text-transparent ml-0.5">
                  Pulse
                </span>
              </div>
            </Link>

            <div className="hidden xl:flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-xl transition-all font-bold text-sm ${
                    isActive(item.path)
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 flex-1 justify-end max-w-2xl">
            <nav className="flex items-center gap-3">
              <button className="relative p-2.5 rounded-2xl text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-white dark:border-gray-950" />
              </button>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-400 p-[1px] hover:shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-95"
                >
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                    <div className="flex items-center justify-center w-full h-full bg-emerald-500/10 text-emerald-500 font-black text-xs">
                      AM
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-4 w-80 bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl shadow-black/20 border border-black/5 dark:border-white/10 overflow-hidden z-[100]"
                    >
                      <div className="p-6 pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-black text-gray-900 dark:text-white text-lg leading-tight">
                              Ayush Dineshbhai Marakana
                            </h3>
                            <p className="text-xs text-gray-500 font-medium mt-1">
                              ayushmarakana294@gmail.com
                            </p>
                          </div>
                          <button className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            <Settings className="w-5 h-5 text-gray-400" />
                          </button>
                        </div>
                      </div>

                      <div className="mx-4 h-px bg-black/5 dark:bg-white/5" />

                      <div className="p-4 px-2">
                        <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group">
                          <div className="flex items-center gap-4 text-left">
                            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                              <Wallet className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="text-lg font-black text-gray-900 dark:text-white font-mono">
                                ₹8,086.96
                              </div>
                              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                Stocks, F&O balance
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                        </button>
                      </div>

                      <div className="mx-4 h-px bg-black/5 dark:bg-white/5" />

                      <div className="p-2 flex flex-col gap-1">
                        {[
                          { icon: ClipboardList, label: "All Orders" },
                          { icon: Building2, label: "Bank Details" },
                          { icon: Headset, label: "24 x 7 Customer Support" },
                          { icon: FileText, label: "Reports" },
                        ].map((item) => (
                          <button
                            key={item.label}
                            className="w-full flex items-center justify-between p-3.5 px-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all group text-left"
                          >
                            <div className="flex items-center gap-4">
                              <item.icon className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                {item.label}
                              </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" />
                          </button>
                        ))}
                      </div>

                      <div className="bg-gray-50 dark:bg-white/5 p-4 py-3 flex items-center justify-between">
                        <button
                          onClick={() =>
                            setTheme(theme === "light" ? "dark" : "light")
                          }
                          className="flex items-center gap-3 p-2 px-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                        >
                          {theme === "light" ? (
                            <Moon className="w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                          ) : (
                            <Sun className="w-5 h-5 text-gray-400 group-hover:text-white" />
                          )}
                        </button>

                        <button className="flex items-center gap-2 p-2 px-4 rounded-xl text-gray-950 dark:text-white font-black text-xs hover:bg-black/5 dark:hover:bg-white/10 transition-colors border-b-2 border-black/10 dark:border-white/10 active:border-b-0 translate-y-0 active:translate-y-[2px]">
                          <LogOut className="w-4 h-4" />
                          <span>Log out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 pb-24 lg:pb-8">
        {children}
      </main>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2">
        <nav className="mx-auto max-w-md flex items-center justify-around p-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-black/5 dark:border-white/5 rounded-3xl shadow-2xl shadow-black/20">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all duration-300 ${
                  active
                    ? "text-blue-600 dark:text-blue-400 bg-blue-500/10"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-transform duration-300 ${active ? "scale-110" : "scale-100"}`}
                />
                <span className="text-[10px] font-black uppercase tracking-tighter">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
