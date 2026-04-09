import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useStockDetail, useTickers } from '../api/queries';
import { useLivePrice } from '../hooks/useLivePrice';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Table, TableBody, TableHeader, Td, Th, Tr } from '../components/Table';
import { GlassBackground } from '../components/GlassBackground';
import { ArrowLeft, Activity, Info, BarChart3, Clock, Briefcase } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

type Duration = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';

const RangeBar: React.FC<{
  label: string;
  min: number;
  max: number;
  current: number;
  prefix?: string;
}> = ({ label, min, max, current, prefix = '₹' }) => {
  const percentage = Math.min(Math.max(((current - min) / (max - min)) * 100, 0), 100);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <span className="text-xs font-black text-gray-500 dark:text-gray-400/70 uppercase tracking-[0.2em]">{label}</span>
        <span className="text-base font-black text-gray-900 dark:text-gray-100">{prefix}{current.toLocaleString('en-IN')}</span>
      </div>
      <div className="relative h-2.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
        <div
          className="absolute h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.4)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs font-bold text-gray-500/60 dark:text-gray-400/40">
        <span>{prefix}{min.toLocaleString('en-IN')}</span>
        <span>{prefix}{max.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
};

export const Detail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading, isError } = useStockDetail(symbol || '');
  const { data: allTickers } = useTickers('XNSE');
  const [duration, setDuration] = useState<Duration>('1D');
  const [perfRange, setPerfRange] = useState<'monthly' | 'yearly'>('monthly');

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

      const now = Math.min(Date.now(), marketBounds.end);
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

  const chartTicks = useMemo(() => {
    if (!chartData || chartData.length < 2) return [];

    if (duration === '1D') {
      const { start, end } = marketBounds;
      const step = (end - start) / 3;
      return [start, start + step, start + 2 * step, end];
    }

    const first = chartData[0].timestamp;
    const last = chartData[chartData.length - 1].timestamp;
    const count = 4;
    return Array.from({ length: count }, (_, i) => first + ((last - first) * i) / (count - 1));
  }, [chartData, duration, marketBounds]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isLive = duration === '1D';
      return (
        <Card glass={true} className="p-4 border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-3xl">
          <p className="text-xs font-black text-gray-500 dark:text-gray-400/60 uppercase tracking-widest mb-2">
            {label ? (isLive
              ? new Date(label).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
              : new Date(label).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
            ) : ''}
          </p>
          <p className={`text-xl font-black tracking-tight ${direction === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
            ₹{payload[0].value?.toFixed(2)}
          </p>
        </Card>
      );
    }
    return null;
  };

  const isMarketOpen = useMemo(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeInMinutes = hours * 60 + minutes;
    const openTime = 9 * 60 + 15;
    const closeTime = 15 * 60 + 30;
    return timeInMinutes >= openTime && timeInMinutes < closeTime;
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Activity className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-8 space-y-4">
        <GlassBackground />
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-blue-500">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
        <Card glass={true} className="p-12 text-center text-rose-500">
          <h2 className="text-3xl font-black mb-2">Registry Offline</h2>
          <p className="opacity-70 text-lg">Unable to retrieve institutional records for {symbol}.</p>
        </Card>
      </div>
    );
  }

  const latest = data?.[0];

  return (
    <div className="relative min-h-screen pb-20">
      <GlassBackground />

      <div className="container mx-auto px-4 lg:px-8 pt-2 space-y-2 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 mb-5">
          <div className="space-y-0.5">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="px-0 hover:bg-transparent text-gray-500 dark:text-gray-400 hover:text-blue-500 group transition-all"
            >
              <ArrowLeft className="mr-2 h-5 w-5 transform group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-[0.25em]">Market Repository</span>
            </Button>

            <div className="flex flex-col">
              <h1 className="text-xl lg:text-3xl font-black tracking-tighter text-gray-900 dark:text-white leading-[1.05]">
                {fullName}
              </h1>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-sm font-black text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg uppercase tracking-[0.2em]">{symbol}</span>
                {livePrice && (
                  isMarketOpen ? (
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-[0.15em] border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-500/10 text-gray-500 dark:text-gray-400 text-xs font-black uppercase tracking-[0.15em] border border-gray-500/20">
                      Market Closed
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            {livePrice !== null ? (
              <div className="text-right">
                <div className={`text-3xl lg:text-4xl font-black tracking-tighter transition-all duration-300 leading-none ${(liveData ? liveData.priceInfo.pChange >= 0 : direction === 'up') ? 'text-emerald-500' : 'text-rose-500'}`}>
                  ₹{livePrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                {liveData && (
                  <div className={`text-sm lg:text-md font-black mt-1 ${liveData.priceInfo.pChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {liveData.priceInfo.pChange >= 0 ? '↗' : '↘'} {Math.abs(liveData.priceInfo.pChange).toFixed(2)}%
                    <span className="ml-2 py-0.5 px-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-xs font-bold opacity-80 text-gray-900 dark:text-white">
                      {liveData.priceInfo.change >= 0 ? '+' : '-'}{Math.abs(liveData.priceInfo.change).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            ) : latest && (
              <div className="text-6xl font-black tracking-tighter text-gray-900 dark:text-white">
                ₹{latest.close.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            )}
          </div>
        </div>

        <Card glass={true} className="p-4 lg:p-5 border-white/20 dark:border-white/5 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-1">
            <div className="space-y-0">
              <h2 className="text-base font-black flex items-center gap-2 tracking-tight text-gray-900 dark:text-white">
                <div className="p-1 bg-blue-500/10 rounded-lg">
                  <BarChart3 className="h-5 w-4 text-blue-500" />
                </div>
                Market Dynamic Flux
              </h2>
              <p className="text-[8px] uppercase font-black tracking-[0.3em] text-gray-500/60 ml-8">Institutional Data Feed</p>
            </div>

            <div className="flex flex-wrap gap-2 p-1.5 bg-black/5 dark:bg-white/5 rounded-[1.5rem] backdrop-blur-xl border border-white/10">
              {(['1D', '1W', '1M', '3M', '6M', '1Y'] as Duration[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`px-6 py-2.5 text-xs font-black rounded-2xl transition-all duration-500 uppercase tracking-widest ${duration === d
                    ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.45)] scale-105'
                    : 'text-gray-500/80 hover:text-gray-900 dark:hover:text-white hover:bg-white/10'
                    }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[425px] w-full mt-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 15, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={direction === 'up' ? '#10b981' : '#f43f5e'} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={direction === 'up' ? '#10b981' : '#f43f5e'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  hide={true}
                  dataKey="timestamp"
                  type="number"
                  domain={duration === '1D' ? [marketBounds.start, marketBounds.end] : ['dataMin', 'dataMax']}
                  ticks={chartTicks}
                  tickFormatter={(val) => {
                    const date = new Date(val);
                    if (duration === '1D') {
                      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    }
                    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(-2)}`;
                  }}
                  stroke="#94a3b8"
                  opacity={0.4}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 900 }}
                  padding={{ left: 10, right: 10 }}
                  name=""
                />
                <YAxis hide={true} domain={['auto', 'auto']} />
                <Tooltip
                  cursor={{ stroke: 'rgba(59, 130, 246, 0.25)', strokeWidth: 3 }}
                  content={<CustomTooltip />}
                />
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke={direction === 'up' ? '#10b981' : '#f43f5e'}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                  strokeWidth={5}
                  animationDuration={2500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
          <div className="lg:col-span-2 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <Card glass={true} className="p-10 border-white/20 dark:border-white/5">
                <h3 className="text-xs font-black text-blue-500/80 uppercase tracking-[0.4em] mb-10 flex items-center gap-3 text-gray-900 dark:text-white">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  Vital Thresholds
                </h3>
                <div className="space-y-12">
                  <RangeBar
                    label="Intraday Volatility"
                    min={liveData?.priceInfo.intraDayHighLow.min || 0}
                    max={liveData?.priceInfo.intraDayHighLow.max || 0}
                    current={livePrice || 0}
                  />
                  <RangeBar
                    label="Cyclical Year Range"
                    min={liveData?.priceInfo.weekHighLow.min || 0}
                    max={liveData?.priceInfo.weekHighLow.max || 0}
                    current={livePrice || 0}
                  />
                </div>
              </Card>

              <Card glass={true} className="p-10 border-rose-500/10 dark:border-white/5 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity text-gray-900 dark:text-white">
                  <Activity size={120} className="text-blue-500" />
                </div>
                <div className="flex justify-between items-center mb-10 relative z-10">
                  <h3 className="text-xs font-black text-rose-500/80 uppercase tracking-[0.4em]">Yield Momentum</h3>
                  <div className="flex gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-2xl border border-white/5">
                    <button onClick={() => setPerfRange('monthly')} className={`text-[10px] px-3.5 py-1.5 rounded-xl font-black transition-all ${perfRange === 'monthly' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}>MO</button>
                    <button onClick={() => setPerfRange('yearly')} className={`text-[10px] px-3.5 py-1.5 rounded-xl font-black transition-all ${perfRange === 'yearly' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}>YR</button>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center py-8 relative z-10">
                  <div className="text-7xl font-black tracking-tighter text-gray-900 dark:text-white mb-3">
                    {perfRange === 'monthly' ? '+4.8%' : '+12.4%'}
                  </div>
                  <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-10">Growth Alpha</div>

                  <div className="w-full grid grid-cols-2 gap-6 border-t border-white/10 pt-10">
                    <div className="text-center">
                      <div className="text-[9px] text-gray-500 uppercase tracking-[0.25em] mb-2 font-black">Risk Profile</div>
                      <div className="text-base font-black text-amber-500">Medium</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[9px] text-gray-500 uppercase tracking-[0.25em] mb-2 font-black">System Sentiment</div>
                      <div className="text-base font-black text-blue-500 italic">Optimistic</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Asset Valuation', value: `${((liveData?.securityInfo.issuedSize || 0) * (livePrice || 0) / 10000000).toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr.` },
                { label: 'P/E Multiplier', value: liveData?.metadata.pdSymbolPe || 24.5 },
                { label: 'Weighted VWAP', value: liveData?.priceInfo.vwap?.toFixed(2) || '-' },
                { label: 'Liquidity Vol', value: latest?.volume?.toLocaleString() || '-' },
              ].map((stat, i) => (
                <Card key={i} glass={true} className="p-6 border-white/20 dark:border-white/5 hover:scale-[1.05] transition-all duration-500 group">
                  <div className="text-[9px] font-black text-gray-500/80 uppercase mb-4 tracking-[0.3em] group-hover:text-blue-500 transition-colors">{stat.label}</div>
                  <div className="text-xl font-black text-gray-900 dark:text-gray-100 leading-none">{stat.value}</div>
                </Card>
              ))}
            </div>

            <Card glass={true} className="p-10 lg:p-14 border-white/20 dark:border-white/5">
              <h3 className="text-2xl font-black mb-12 flex items-center gap-4 text-gray-900 dark:text-white">
                <div className="p-3 bg-indigo-500/10 rounded-2xl">
                  <Briefcase className="h-7 w-7 text-indigo-500" />
                </div>
                Tactical Snapshot
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-12 gap-x-16">
                {[
                  { label: 'Cap Ceiling (UC)', value: `₹${liveData?.priceInfo.upperCP || '-'}` },
                  { label: 'Floor Limit (LC)', value: `₹${liveData?.priceInfo.lowerCP || '-'}` },
                  { label: 'Nominal Value', value: `₹${liveData?.securityInfo.faceValue || '-'}` },
                  { label: 'Historic Close', value: `₹${liveData?.priceInfo.previousClose.toLocaleString('en-IN')}` },
                  { label: 'Session Open', value: `₹${liveData?.priceInfo.open.toLocaleString('en-IN')}` },
                  { label: 'Industrial Index', value: liveData?.metadata.pdSectorInd || '-' },
                ].map((stat, i) => (
                  <div key={i} className="group relative">
                    <div className="text-[10px] text-gray-500/70 uppercase font-black mb-2 tracking-[0.2em] group-hover:text-blue-500 transition-colors">{stat.label}</div>
                    <div className="text-base font-black text-gray-900 dark:text-gray-100 font-mono tracking-tight">{stat.value}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card glass={true} className="overflow-hidden border-white/20 dark:border-white/5">
              <div className="p-8 bg-black/5 dark:bg-white/5 flex justify-between items-center border-b border-white/10 dark:border-white/5">
                <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.4em]">Historical Ledger</h3>
                <Clock className="h-5 w-5 text-gray-500" />
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-transparent border-white/5">
                    <Th className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 py-6">Timestamp</Th>
                    <Th className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-400 py-6 text-right">Opening</Th>
                    <Th className="text-[10px] uppercase tracking-[0.3em] font-black text-emerald-500/70 py-6 text-right">Maximus</Th>
                    <Th className="text-[10px] uppercase tracking-[0.3em] font-black text-rose-500/70 py-6 text-right">Minimus</Th>
                    <Th className="text-[10px] uppercase tracking-[0.3em] font-black text-blue-500/70 py-6 text-right">Finality</Th>
                  </TableHeader>
                  <TableBody>
                    {data?.slice(0, 30).map((record, i) => (
                      <Tr key={i} className="hover:bg-white/5 transition-colors border-white/5">
                        <Td className="text-xs font-black text-gray-500 py-5">{new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</Td>
                        <Td className="text-xs font-bold text-right font-mono text-gray-900 dark:text-white">₹{record.open.toFixed(1)}</Td>
                        <Td className="text-xs font-bold text-right text-emerald-600 font-mono">₹{record.high.toFixed(1)}</Td>
                        <Td className="text-xs font-bold text-right text-rose-500 font-mono">₹{record.low.toFixed(1)}</Td>
                        <Td className="text-xs font-black text-right text-blue-600 font-mono underline decoration-blue-500/30 underline-offset-4">₹{record.close.toFixed(1)}</Td>
                      </Tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>

          <div className="relative">
            <div className="space-y-10 sticky top-28 self-start transition-all duration-300">
              <Card glass={true} className="p-10 border-white/20 dark:border-white/5 relative overflow-hidden group">
                <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-blue-500/15 blur-[100px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
                <h3 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em] mb-10 flex items-center gap-4">
                  <Info className="h-5 w-5" />
                  Corp Identity
                </h3>
                <div className="space-y-10 relative z-10">
                  <div className="space-y-5">
                    <h4 className="text-3xl font-black text-gray-900 dark:text-gray-100 leading-tight">
                      {liveData?.info.companyName}
                    </h4>
                    <p className="text-xs text-gray-500/80 leading-relaxed font-bold tracking-tight">
                      Institutional entity spearheading **{liveData?.industryInfo.basicIndustry}** operations within the **{liveData?.industryInfo.sector}** framework.
                    </p>
                  </div>

                  <div className="space-y-6 pt-10 border-t border-white/15">
                    {[
                      { label: 'Market Segment', value: liveData?.industryInfo.macro },
                      { label: 'Industry Tier', value: liveData?.industryInfo.sector },
                      { label: 'Security Class', value: liveData?.info.segment || 'EQUITY' },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-4 rounded-[1.25rem] border border-white/5">
                        <span className="text-[9px] uppercase font-black text-gray-500 tracking-[0.25em]">{item.label}</span>
                        <span className="text-xs font-black text-gray-800 dark:text-gray-200">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-gradient-to-br from-blue-600/15 to-transparent rounded-[1.5rem] border border-white/10 text-center shadow-inner">
                    <div className="text-[9px] font-black text-blue-500 uppercase mb-3 tracking-[0.3em]">ISIN Protocol Hub</div>
                    <div className="text-sm font-black font-mono tracking-[0.2em] text-gray-900 dark:text-white">
                      {liveData?.info.isin}
                    </div>
                  </div>
                </div>
              </Card>

              <Card glass={true} className="p-10 bg-blue-600/20 text-white border-blue-500/20 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-6 opacity-10 blur-sm group-hover:blur-none transition-all scale-125">
                  <Activity size={140} />
                </div>
                <div className="relative z-10 space-y-8">
                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.5em] mb-2 text-blue-200">Terminal Pulse</h3>
                    <div className="text-[10px] font-bold text-blue-200/60 uppercase italic tracking-widest">Global Status Node</div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white/10 p-5 rounded-[2rem] border border-white/10 backdrop-blur-3xl shadow-xl">
                      <span className="text-[10px] font-black text-blue-50 uppercase tracking-widest">Status</span>
                      <span className="text-xs font-black uppercase tracking-widest bg-white text-blue-600 px-5 py-1.5 rounded-full shadow-lg">{liveData?.metadata.status || 'Active'}</span>
                    </div>
                    <div className="flex justify-between items-center px-4">
                      <span className="text-[10px] font-black text-blue-100 uppercase tracking-[0.3em]">Tier</span>
                      <span className="text-3xl font-black italic tracking-tighter text-white underline decoration-white/30 underline-offset-[12px]">{liveData?.metadata.series || 'EQ'}</span>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-center">
                    <div className="px-8 py-3 bg-gradient-to-r from-white to-blue-50 text-blue-700 text-xs font-black rounded-full shadow-[0_0_30px_rgba(255,255,255,0.4)] animate-bounce uppercase tracking-[0.2em]">
                      Terminal Active
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
