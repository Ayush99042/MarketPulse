import React from 'react';
import { useTheme } from './ThemeProvider';
import { Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';


export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 font-sans transition-colors duration-200 selection:bg-blue-500/30">
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/40 backdrop-blur-2xl dark:bg-gray-950/40">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2 group transition-transform active:scale-95">

            <div className="text-2xl font-black tracking-tight flex items-center">
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Market</span>
              <span className="bg-gradient-to-r from-emerald-500 to-green-400 bg-clip-text text-transparent">Pulse</span>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
};
