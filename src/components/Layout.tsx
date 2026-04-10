import React from "react";
import { useTheme } from "./ThemeProvider";
import {
  Moon,
  Sun,
  LayoutDashboard,
  TrendingUp,
  Bookmark,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();

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
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-white/60 backdrop-blur-2xl dark:bg-gray-950/60">
        <div className="container mx-auto flex h-14 lg:h-16 items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2 transition-transform active:scale-95 shrink-0"
            >
              <div className="text-xl lg:text-2xl font-black flex items-center">
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Market
                </span>
                <span className="bg-gradient-to-r from-emerald-500 to-green-400 bg-clip-text text-transparent">
                  Pulse
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
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

          <nav className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 pb-24 lg:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
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
