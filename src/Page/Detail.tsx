import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useStockDetail, useTickers } from '../api/queries';
import { useLivePrice } from '../hooks/useLivePrice';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Table, TableBody, TableHeader, Td, Th, Tr } from '../components/Table';
import { ArrowLeft, Activity } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot
} from 'recharts';

type Duration = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';

export const Detail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading, isError } = useStockDetail(symbol || '');
  const { data: allTickers } = useTickers('XNSE');
  const [duration, setDuration] = useState<Duration>('1D');

  const fullName = useMemo(() => {
    if (location.state?.name) return location.state.name;
    const found = allTickers?.find(t => t.symbol === symbol);
    return found ? found.name : symbol?.split('.')[0];
  }, [location.state, allTickers, symbol]);

  const nseSymbol = symbol?.split('.')[0];
  const { price: livePrice, direction, data: liveData } = useLivePrice(nseSymbol);

  const marketBounds = useMemo(() => {
    const start = new Date();
    start.setHours(9, 15, 0, 0);
    const end = new Date();
    end.setHours(15, 30, 0, 0);
    return { start: start.getTime(), end: end.getTime() };
  }, []);

  const [intradayData, setIntradayData] = useState<any[]>([]);

  useEffect(() => {
    if (livePrice && liveData?.priceInfo && intradayData.length === 0) {
      const openPrice = liveData.priceInfo.open;
      const startPrice = openPrice || liveData.priceInfo.previousClose;
      const endPrice = livePrice;

      const now = Date.now();
      const startTime = marketBounds.start;
      const durationMs = now - startTime;

      if (durationMs <= 0) {
        setIntradayData([{ timestamp: startTime, close: startPrice, isSimulated: true }]);
        return;
      }

      const points = 120;
      const simulated = [];
      let currentPrice = startPrice;

      const targetDelta = (endPrice - startPrice) / points;

      for (let i = 0; i <= points; i++) {
        const timestamp = startTime + (durationMs * (i / points));

        const volatility = startPrice * 0.0008;
        const change = targetDelta + (Math.random() - 0.5) * volatility;

        currentPrice += change;

        const finalPrice = i === points ? endPrice : currentPrice;

        simulated.push({
          timestamp,
          close: Number(finalPrice.toFixed(2)),
          isSimulated: true
        });
      }
      setIntradayData(simulated);
    }
  }, [livePrice, liveData?.priceInfo.previousClose, marketBounds]);

  useEffect(() => {
    if (livePrice) {
      const now = Date.now();
      if (now > marketBounds.end) return;

      setIntradayData(prev => {
        const lastPoint = prev[prev.length - 1];
        if (lastPoint && lastPoint.close === livePrice && !lastPoint.isSimulated) return prev;

        const newPoint = { timestamp: now, close: livePrice };
        return [...prev, newPoint].slice(-2000);
      });
    }
  }, [livePrice, marketBounds]);

  const chartData = useMemo(() => {
    if (duration === '1D') return intradayData;

    if (!data) return [];
    const chronData = [...data].reverse().map(d => ({
      ...d,
      timestamp: new Date(d.date).getTime()
    }));

    switch (duration) {
      case '1W': return chronData.slice(-5);
      case '1M': return chronData.slice(-22);
      case '3M': return chronData.slice(-66);
      case '6M': return chronData.slice(-132);
      case '1Y': return chronData.slice(-252);
      default: return chronData;
    }
  }, [data, duration, intradayData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isLive = duration === '1D';
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {label ? (isLive
              ? new Date(label).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
              : new Date(label).toLocaleDateString()
            ) : ''}
          </p>
          <p className={`text-sm font-bold ${direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            ₹{payload[0].value?.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Activity className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card className="p-6 text-center text-red-500">
          Failed to load detail data for {symbol}.
        </Card>
      </div>
    );
  }

  const latest = data?.[0];

  return (
    <div className="space-y-6">


      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex flex-col gap-0.5 mb-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{fullName}</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">{symbol}</span>
              {livePrice && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider animate-pulse border border-red-200 dark:border-red-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                  Live
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            {livePrice !== null ? (
              <div className="flex items-baseline gap-3">
                <div className={`text-4xl font-black tracking-tighter transition-all duration-300 flex items-center gap-2 ${(liveData ? liveData.priceInfo.pChange >= 0 : direction === 'up') ? 'text-green-500' : 'text-red-500'
                  }`}>
                  ₹{livePrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                {liveData && (
                  <div className={`text-lg font-semibold ${liveData.priceInfo.pChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {liveData.priceInfo.pChange >= 0 ? '+' : ''}{liveData.priceInfo.pChange.toFixed(2)}%
                    <span className="ml-1 text-sm font-medium opacity-80">
                      ({liveData.priceInfo.change >= 0 ? '+' : ''}{liveData.priceInfo.change.toFixed(2)} ₹)
                    </span>
                  </div>
                )}
              </div>
            ) : latest && (
              <div className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                ₹{latest.close.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            )}
          </div>
        </div>
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Market
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold">Price History</h2>
              <div className="flex flex-wrap gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                {(['1D', '1W', '1M', '3M', '6M', '1Y'] as Duration[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${duration === d
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={direction === 'up' ? '#22c55e' : '#ef4444'}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={direction === 'up' ? '#22c55e' : '#ef4444'}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.05} />

                  <XAxis
                    dataKey="timestamp"
                    type="number"
                    domain={duration === '1D' ? [marketBounds.start, marketBounds.end] : ['auto', 'auto']}
                    tickFormatter={(val) => {
                      const date = new Date(val);
                      if (duration === '1D') {
                        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      }
                      if (duration === '1W') {
                        return date.toLocaleDateString([], { weekday: 'short' });
                      }
                      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                    }}
                    minTickGap={30}
                    tick={{ fontSize: 11 }}
                    stroke="#6b7280"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={['dataMin - 5', 'dataMax + 5']}
                    tickFormatter={(val) => `₹${Number(val).toLocaleString('en-IN')}`}
                    tick={{ fontSize: 10 }}
                    width={50}
                    stroke="#6b7280"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '3 3' }}
                    content={<CustomTooltip />}
                  />
                  <Area
                    type="monotone"
                    dataKey="close"
                    stroke={direction === 'up' ? '#10b981' : '#f43f5e'}
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                    strokeWidth={2.5}
                    animationDuration={1000}
                    isAnimationActive={duration !== '1D'}
                  />

                  {duration === '1D' && chartData.length > 0 && (
                    <ReferenceDot
                      x={chartData[chartData.length - 1].timestamp}
                      y={chartData[chartData.length - 1].close}
                      r={4}
                      fill={direction === 'up' ? '#10b981' : '#f43f5e'}
                      stroke="white"
                      strokeWidth={2}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-6 h-full flex flex-col justify-center">
            <h2 className="text-lg font-semibold mb-6">Key Statistics</h2>
            <div className="space-y-6">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Open</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  ₹{(liveData?.priceInfo.open || latest?.open)?.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">High</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {liveData?.priceInfo.previousClose ? `₹${latest?.high.toFixed(2)}` : `₹${latest?.high.toFixed(2)}`}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Prev Close</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  ₹{(liveData?.priceInfo.previousClose || latest?.close)?.toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Volume</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {(latest?.volume)?.toLocaleString()} Cr.
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="text-sm text-gray-500 dark:text-gray-400">Market Status</div>
                <div className="text-sm font-medium text-emerald-500">
                  {livePrice ? 'NSE Live Polling' : 'Market Closed'}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Historical Data Records</h2>
        <Table>
          <TableHeader>
            <Th>Date</Th>
            <Th>Open</Th>
            <Th>High</Th>
            <Th>Low</Th>
            <Th>Close</Th>
            <Th>Volume</Th>
          </TableHeader>
          <TableBody>
            {data?.slice(0, 50).map((record, i) => (
              <Tr key={i}>
                <Td>{new Date(record.date).toLocaleDateString()}</Td>
                <Td>₹{record.open.toFixed(2)}</Td>
                <Td>₹{record.high.toFixed(2)}</Td>
                <Td>₹{record.low.toFixed(2)}</Td>
                <Td>₹{record.close.toFixed(2)}</Td>
                <Td>{record.volume?.toLocaleString()}</Td>
              </Tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
