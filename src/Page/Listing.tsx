import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickers } from '../api/queries';
import { Card } from '../components/Card';
import { Search, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { StockCard } from '../components/StockCard';
import { Button } from '../components/Button';
import { AnimatePresence } from 'framer-motion';

export const Listing: React.FC = () => {
  const { data, isLoading, isError } = useTickers('XNSE');
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(12);
  const [page, setPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(ticker =>
      ticker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticker.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const total = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const paginatedData = useMemo(() => {
    return filteredData.slice((page - 1) * limit, page * limit);
  }, [filteredData, page, limit]);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Card className="p-8 text-center bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20">
          <p className="text-red-600 dark:text-red-400 font-semibold text-lg">Failed to load market data</p>
          <p className="text-sm text-red-500/70 mt-1">Please check your network or try again later.</p>
          <Button variant="outline" className="mt-6 border-red-200 text-red-600" onClick={() => window.location.reload()}>
            Retry Connection
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">
            Market <span className="text-blue-600 italic">Pulse</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Explore 3,000+ NSE Stocks with Real-Time Analytics
          </p>
        </div>

        <div className="relative group max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search company or symbol..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-12 pr-12 py-3.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl shadow-sm outline-none focus:outline-none focus:ring-1 focus:border-blue-500 transition-colors duration-300 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-500"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setPage(1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 rounded-3xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : total === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 space-y-4">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">No results found</p>
              <p className="text-gray-500 text-sm mt-1 italic">"{searchTerm}" returned no matches in the NSE directory.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {paginatedData.map((ticker) => (
                <StockCard
                  key={ticker.symbol}
                  ticker={ticker}
                  onClick={() => navigate(`/detail/${ticker.symbol}`, { state: { name: ticker.name } })}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 pb-12 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4 order-2 sm:order-1">
          <div className="relative group">
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="appearance-none pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer hover:bg-white dark:hover:bg-gray-800 transition-all"
            >
              {[12, 24, 48, 96].map(v => (
                <option key={v} value={v}>{v} Per Page</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 italic">
            Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total.toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2 order-1 sm:order-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="rounded-xl px-4 font-bold border-gray-200 dark:border-gray-800 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Prev
          </Button>

          <div className="flex items-center px-4 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
            <span className="text-sm font-black text-blue-600 dark:text-blue-400">
              {page} <span className="font-medium text-gray-400 mx-1">/</span> {totalPages}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded-xl px-4 font-bold border-gray-200 dark:border-gray-800 disabled:opacity-30"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

