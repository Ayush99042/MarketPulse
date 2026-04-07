import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStockDetail } from '../api/queries';
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
  ResponsiveContainer
} from 'recharts';


type Duration = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';

export const Detail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useStockDetail(symbol || '');
  const [duration, setDuration] = useState<Duration>('1M');

  const filteredData = useMemo(() => {
    if (!data) return [];

    const chronData = [...data].reverse();

    switch (duration) {
      case '1D': return chronData.slice(-2);
      case '1W': return chronData.slice(-5);
      case '1M': return chronData.slice(-22);
      case '3M': return chronData.slice(-66);
      case '6M': return chronData.slice(-132);
      case '1Y': return chronData.slice(-252);
      default: return chronData;
    }
  }, [data, duration]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {label ? new Date(label).toLocaleDateString() : ''}
          </p>
          <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
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
          <h1 className="text-3xl font-bold tracking-tight">{symbol}</h1>
          {latest && (
            <div className="text-left">
              <div className="text-lg font-bold">₹{latest.close.toFixed(2)}</div>
            </div>
          )}
        </div>
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Market
        </Button>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Chart Section */}
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
                <AreaChart data={filteredData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(str) => {
                      const date = new Date(str);
                      if (duration === '1D' || duration === '1W') {
                        return date.toLocaleDateString([], { weekday: 'short' });
                      }
                      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                    }}
                    minTickGap={30}
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    tickFormatter={(val) => `₹${val}`}
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                    orientation="right"
                  />
                  <Tooltip
                    cursor={{ stroke: '#6b7280', strokeWidth: 1, strokeDasharray: '3 3' }}
                    content={<CustomTooltip />}
                  />
                  <Area
                    type="monotone"
                    dataKey="close"
                    stroke="#2563eb"
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                    strokeWidth={2}
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right Side: Stats Section */}
        <div className="space-y-4">
          <Card className="p-6 h-full flex flex-col justify-center">
            <h2 className="text-lg font-semibold mb-6">Key Statistics</h2>
            <div className="space-y-6">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Open</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">₹{latest?.open.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">High</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">₹{latest?.high.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Low</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">₹{latest?.low.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Close</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">₹{latest?.close.toFixed(2)}</div>
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="text-sm text-gray-500 dark:text-gray-400">Volume</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{latest?.volume?.toLocaleString()}</div>
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
