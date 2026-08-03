import React, { useEffect, useState, useMemo } from 'react';
import { fetchDashboardStatus, fetchDashboardSignals } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Activity, 
  Server, 
  Cpu, 
  HardDrive, 
  Database, 
  TerminalSquare, 
  Workflow, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Play, 
  CheckSquare, 
  Square, 
  BarChart3, 
  LineChart as LineChartIcon, 
  ShieldAlert, 
  Zap,
  Check,
  Eye
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface QuantSignal {
  id: string;
  symbol: string;
  assetClass: 'CRYPTO' | 'EQUITIES' | 'FX' | 'MACRO';
  signal: 'LONG' | 'SHORT' | 'NEUTRAL';
  priceAtSignal: string;
  targetPrice: string;
  stopLoss: string;
  confidence: number;
  strategy: string;
  createdAt: string;
  pnlContribution: string;
}

interface DashboardStatus {
  postgresOnline: boolean;
  n8nOnline: boolean;
  ollamaOnline: boolean;
  signalsTodayCount: number;
  activeWorkflows: number;
  watchlistCount: number;
  latencyMs: number;
}

interface EquityPoint {
  time: string;
  alphaStrategy: number;
  benchmarkBTC: number;
  benchmarkSPX: number;
}

interface SignalVolumePoint {
  category: string;
  crypto: number;
  equities: number;
  fx: number;
}

const defaultEquityData: EquityPoint[] = [
  { time: '09:00', alphaStrategy: 1000000, benchmarkBTC: 1000000, benchmarkSPX: 1000000 },
  { time: '10:00', alphaStrategy: 1004200, benchmarkBTC: 1001500, benchmarkSPX: 1000400 },
  { time: '11:00', alphaStrategy: 1008900, benchmarkBTC: 998200,  benchmarkSPX: 1001100 },
  { time: '12:00', alphaStrategy: 1014500, benchmarkBTC: 1004100, benchmarkSPX: 1001800 },
  { time: '13:00', alphaStrategy: 1012800, benchmarkBTC: 1002900, benchmarkSPX: 1000900 },
  { time: '14:00', alphaStrategy: 1019400, benchmarkBTC: 1008400, benchmarkSPX: 1002400 },
  { time: '15:00', alphaStrategy: 1024800, benchmarkBTC: 1006100, benchmarkSPX: 1003100 },
  { time: '16:00', alphaStrategy: 1031250, benchmarkBTC: 1011400, benchmarkSPX: 1004200 },
];

const defaultSignalVolume: SignalVolumePoint[] = [
  { category: '00:00 - 04:00', crypto: 8, equities: 2, fx: 4 },
  { category: '04:00 - 08:00', crypto: 12, equities: 5, fx: 9 },
  { category: '08:00 - 12:00', crypto: 15, equities: 24, fx: 14 },
  { category: '12:00 - 16:00', crypto: 18, equities: 31, fx: 12 },
  { category: '16:00 - 20:00', crypto: 14, equities: 10, fx: 8 },
  { category: '20:00 - 24:00', crypto: 11, equities: 4, fx: 6 },
];

const defaultSignals: QuantSignal[] = [
  {
    id: 'sig-001',
    symbol: 'BTC/USD',
    assetClass: 'CRYPTO',
    signal: 'LONG',
    priceAtSignal: '$67,432.10',
    targetPrice: '$71,200.00',
    stopLoss: '$65,100.00',
    confidence: 94.2,
    strategy: 'Transformer-Momentum-v4',
    createdAt: '10:14:22',
    pnlContribution: '+$4,820.40'
  },
  {
    id: 'sig-002',
    symbol: 'NVDA',
    assetClass: 'EQUITIES',
    signal: 'LONG',
    priceAtSignal: '$128.45',
    targetPrice: '$138.00',
    stopLoss: '$123.50',
    confidence: 89.7,
    strategy: 'Earnings-Sentiment-Llama3',
    createdAt: '09:48:05',
    pnlContribution: '+$3,140.00'
  },
  {
    id: 'sig-003',
    symbol: 'ETH/USD',
    assetClass: 'CRYPTO',
    signal: 'SHORT',
    priceAtSignal: '$3,481.05',
    targetPrice: '$3,290.00',
    stopLoss: '$3,580.00',
    confidence: 81.4,
    strategy: 'Orderflow-Imbalance-L1',
    createdAt: '09:30:11',
    pnlContribution: '+$1,980.25'
  },
  {
    id: 'sig-004',
    symbol: 'EUR/USD',
    assetClass: 'FX',
    signal: 'SHORT',
    priceAtSignal: '1.08420',
    targetPrice: '1.07600',
    stopLoss: '1.08900',
    confidence: 78.5,
    strategy: 'Macro-Rates-Differential',
    createdAt: '08:55:40',
    pnlContribution: '+$910.15'
  },
  {
    id: 'sig-005',
    symbol: 'SOL/USD',
    assetClass: 'CRYPTO',
    signal: 'LONG',
    priceAtSignal: '$178.20',
    targetPrice: '$198.50',
    stopLoss: '$169.00',
    confidence: 88.0,
    strategy: 'Transformer-Momentum-v4',
    createdAt: '08:42:19',
    pnlContribution: '+$2,450.80'
  },
  {
    id: 'sig-006',
    symbol: 'AAPL',
    assetClass: 'EQUITIES',
    signal: 'NEUTRAL',
    priceAtSignal: '$226.30',
    targetPrice: '$226.30',
    stopLoss: '$221.00',
    confidence: 64.0,
    strategy: 'Mean-Reversion-StatArb',
    createdAt: '08:15:00',
    pnlContribution: '$0.00'
  },
  {
    id: 'sig-007',
    symbol: 'XAU/USD',
    assetClass: 'MACRO',
    signal: 'LONG',
    priceAtSignal: '$2,412.50',
    targetPrice: '$2,460.00',
    stopLoss: '$2,385.00',
    confidence: 86.3,
    strategy: 'Macro-Rates-Differential',
    createdAt: '07:50:12',
    pnlContribution: '+$1,680.00'
  },
  {
    id: 'sig-008',
    symbol: 'MSFT',
    assetClass: 'EQUITIES',
    signal: 'LONG',
    priceAtSignal: '$452.10',
    targetPrice: '$472.00',
    stopLoss: '$441.50',
    confidence: 91.1,
    strategy: 'Earnings-Sentiment-Llama3',
    createdAt: '07:22:38',
    pnlContribution: '+$2,890.30'
  }
];

export default function Dashboard() {
  const [status, setStatus] = useState<DashboardStatus>({
    postgresOnline: true,
    n8nOnline: true,
    ollamaOnline: true,
    signalsTodayCount: 28,
    activeWorkflows: 3,
    watchlistCount: 16,
    latencyMs: 12
  });
  const [signals, setSignals] = useState<QuantSignal[]>(defaultSignals);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 4. FILTERS state
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL'>('1D');
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [signalTypeFilter, setSignalTypeFilter] = useState<string>('ALL');

  // 3. TABLE Sorting, Pagination & Selection state
  const [sortField, setSortField] = useState<keyof QuantSignal>('confidence');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const rowsPerPage = 5;

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statusRes, signalsRes] = await Promise.all([
        fetchDashboardStatus().catch(() => null),
        fetchDashboardSignals().catch(() => null)
      ]);

      if (statusRes && statusRes.ok) {
        const data = await statusRes.json();
        setStatus({
          postgresOnline: data.postgres_online ?? true,
          n8nOnline: true,
          ollamaOnline: true,
          signalsTodayCount: data.signals_today_count ?? 28,
          activeWorkflows: data.workflow_runs?.length ?? 3,
          watchlistCount: data.watchlist_count ?? 16,
          latencyMs: 12
        });
      }

      if (signalsRes && signalsRes.ok) {
        const data = await signalsRes.json();
        if (data.signals && Array.isArray(data.signals)) {
          if (data.signals.length > 0) {
            setSignals(
              data.signals.map((s: any, idx: number) => ({
                id: `sig-api-${idx}`,
                symbol: s.symbol || 'UNKNOWN',
                assetClass: s.asset_class || 'CRYPTO',
                signal: s.signal || 'LONG',
                priceAtSignal: s.price_at_signal || '$0.00',
                targetPrice: s.target_price || '$0.00',
                stopLoss: s.stop_loss || '$0.00',
                confidence: Number(s.confidence) || 85.0,
                strategy: s.strategy || 'AI-Quant-Agent',
                createdAt: s.created_at || '00:00:00',
                pnlContribution: s.pnl_contribution || '+$0.00'
              }))
            );
          }
        }
      }
    } catch (err) {
      console.error('Error loading Quant OS Dashboard:', err);
      setError('Unable to reach n8n webhook WF-080. Displaying cached live research state.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filtered & Sorted signals
  const filteredSignals = useMemo(() => {
    return signals
      .filter((item) => {
        const matchAsset = selectedAssetClass === 'ALL' || item.assetClass === selectedAssetClass;
        const matchType = signalTypeFilter === 'ALL' || item.signal === signalTypeFilter;
        const matchSearch =
          item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.strategy.toLowerCase().includes(searchQuery.toLowerCase());
        return matchAsset && matchType && matchSearch;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return 0;
      });
  }, [signals, selectedAssetClass, signalTypeFilter, searchQuery, sortField, sortAsc]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredSignals.length / rowsPerPage) || 1;
  const paginatedSignals = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredSignals.slice(start, start + rowsPerPage);
  }, [filteredSignals, currentPage, rowsPerPage]);

  const toggleSelectAll = () => {
    if (selectedRowIds.length === paginatedSignals.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(paginatedSignals.map((item) => item.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSort = (field: keyof QuantSignal) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 5. ACTIONS & HEADER (Bloomberg / Linear inspired High-Density Header) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-primary/10 text-primary border border-primary/20">
              Live Alpha Environment
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              WF-080 Webhook • Latency {status.latencyMs}ms
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight mt-1 text-foreground">
            AI Quant Operating System
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time multi-asset signal execution, model confidence attribution, and intraday equity curves.
          </p>
        </div>

        {/* 4. FILTERS (Timeframe Selector & Actions) */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-secondary/60 rounded-md p-0.5 border border-border">
            {(['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                  timeframe === tf
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            disabled={loading}
            className="gap-2 h-8 text-xs font-mono"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Sync WF-080
          </Button>

          <Button
            size="sm"
            onClick={() => alert('Triggering instant AI Alpha Scan across 148 symbols...')}
            className="gap-2 h-8 text-xs font-mono bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Run Alpha Scan
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-danger/10 text-danger border border-danger/20 rounded-md flex items-center gap-2 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. KPI (4 Quant High-Density Performance & Infrastructure Cards) */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Intraday PnL & Sharpe */}
        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-4 space-y-0">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Intraday Alpha PnL
            </span>
            <TrendingUp className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono text-success">+$31,250.00</span>
              <span className="text-xs font-mono text-success bg-success/10 px-1.5 py-0.5 rounded border border-success/20">
                +3.12%
              </span>
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground border-t border-border/60 pt-2 font-mono">
              <span>Sharpe Ratio: 2.84</span>
              <span>Max DD: -1.42%</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Active Signals & Win Rate */}
        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-4 space-y-0">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Signals Today
            </span>
            <Activity className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono text-foreground">{status.signalsTodayCount}</span>
              <span className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                74.2% Win Rate
              </span>
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground border-t border-border/60 pt-2 font-mono">
              <span>18 Long / 10 Short</span>
              <span>Avg RR: 1:2.65</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: AI Inference Engine Health */}
        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-4 space-y-0">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              AI Compute (Ollama/GPU)
            </span>
            <Cpu className="w-4 h-4 text-info" />
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono text-foreground">14.2 ms</span>
              <span className="text-xs font-mono text-info bg-info/10 px-1.5 py-0.5 rounded border border-info/20">
                RTX 4090
              </span>
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground border-t border-border/60 pt-2 font-mono">
              <span>VRAM: 18.4 / 24 GB</span>
              <span>Llama-3-70b Active</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Infrastructure & Webhook State */}
        <Card className="bg-card border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-4 space-y-0">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Database & Workflow
            </span>
            <Database className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent className="px-4 pb-3 pt-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold font-mono text-success">ONLINE</span>
              <span className="text-xs font-mono text-success bg-success/10 px-1.5 py-0.5 rounded border border-success/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Postgres + n8n
              </span>
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground border-t border-border/60 pt-2 font-mono">
              <span>{status.activeWorkflows} Workflows Active</span>
              <span>{status.watchlistCount} Watchlist Items</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. CHARTS (2 Recharts: Intraday Equity Curve vs Benchmarks + Signal Volume by Asset Class) */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* CHART 1: Area/Line chart comparing AI Strategy Equity vs BTC & S&P */}
        <Card className="lg:col-span-4 bg-card border-border shadow-xs">
          <CardHeader className="pb-2 pt-4 px-5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold uppercase tracking-wider">
                  Intraday Strategy Equity vs. Benchmarks
                </CardTitle>
                <CardDescription className="text-xs">
                  Normalized to $1,000,000 baseline • 1-minute execution granularity
                </CardDescription>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-primary">
                  <span className="w-2.5 h-2.5 rounded-xs bg-primary inline-block" />
                  Alpha Engine
                </span>
                <span className="flex items-center gap-1.5 text-info">
                  <span className="w-2.5 h-2.5 rounded-xs bg-info inline-block" />
                  BTC/USD
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-3 pb-4">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={defaultEquityData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="alphaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="btcGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e222d" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    domain={['auto', 'auto']}
                    tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                  />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#101217', borderColor: '#1e222d', borderRadius: '6px' }}
                    labelStyle={{ color: '#f8fafc', fontWeight: 600, fontSize: '12px' }}
                    itemStyle={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
                    formatter={(val: number) => [`$${val.toLocaleString()}`, '']}
                  />
                  <Area
                    type="monotone"
                    dataKey="alphaStrategy"
                    name="Alpha Engine"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#alphaGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="benchmarkBTC"
                    name="BTC Benchmark"
                    stroke="#06b6d4"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#btcGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* CHART 2: Bar Chart for Signal Volume & Activity by Asset Class */}
        <Card className="lg:col-span-3 bg-card border-border shadow-xs">
          <CardHeader className="pb-2 pt-4 px-5">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold uppercase tracking-wider">
                  Alpha Signal Volume by Asset Class
                </CardTitle>
                <CardDescription className="text-xs">
                  Intraday distribution across Crypto, Equities & FX
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-3 pb-4">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={defaultSignalVolume} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e222d" vertical={false} />
                  <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#101217', borderColor: '#1e222d', borderRadius: '6px' }}
                    labelStyle={{ color: '#f8fafc', fontWeight: 600, fontSize: '12px' }}
                    itemStyle={{ fontSize: '12px', fontFamily: 'JetBrains Mono' }}
                  />
                  <Bar dataKey="crypto" name="Crypto" fill="#2563eb" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="equities" name="Equities" fill="#10b981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="fx" name="FX / Macro" fill="#06b6d4" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. TABLE & 4. FILTERS (Quant Signals & Order Book Table with Sticky Header, Search, Sorting, Filtering, Row Selection & Pagination) */}
      <Card className="bg-card border-border shadow-xs">
        <CardHeader className="pb-3 pt-4 px-5 border-b border-border">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold">
                  Live Research & Signal Execution Book
                </CardTitle>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-secondary border border-border text-foreground">
                  {filteredSignals.length} records
                </span>
              </div>
              <CardDescription className="text-xs">
                Real-time signals generated by Transformer & LLM research agents with attribution.
              </CardDescription>
            </div>

            {/* 4. FILTERS (Search, Asset Class dropdown, Signal direction tabs) */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-48 sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search symbol, strategy..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-8 h-8 text-xs font-mono bg-secondary/50 border-border"
                />
              </div>

              {/* Asset Class filter */}
              <div className="flex items-center bg-secondary/60 rounded-md p-0.5 border border-border">
                {(['ALL', 'CRYPTO', 'EQUITIES', 'FX'] as const).map((ac) => (
                  <button
                    key={ac}
                    onClick={() => {
                      setSelectedAssetClass(ac);
                      setCurrentPage(1);
                    }}
                    className={`px-2 py-1 text-[11px] font-mono rounded transition-colors ${
                      selectedAssetClass === ac
                        ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {ac}
                  </button>
                ))}
              </div>

              {/* Signal Type filter */}
              <div className="flex items-center bg-secondary/60 rounded-md p-0.5 border border-border">
                {(['ALL', 'LONG', 'SHORT'] as const).map((dir) => (
                  <button
                    key={dir}
                    onClick={() => {
                      setSignalTypeFilter(dir);
                      setCurrentPage(1);
                    }}
                    className={`px-2 py-1 text-[11px] font-mono rounded transition-colors ${
                      signalTypeFilter === dir
                        ? 'bg-secondary text-foreground font-semibold border border-border'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {dir}
                  </button>
                ))}
              </div>

              {/* Action for selected rows */}
              {selectedRowIds.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    alert(`Exported ${selectedRowIds.length} signals to Research JSON bundle.`);
                    setSelectedRowIds([]);
                  }}
                  className="h-8 text-xs font-mono gap-1 border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export ({selectedRowIds.length})</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Table Container with Sticky Header */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/40 text-muted-foreground font-mono sticky top-0 z-10">
                  <th className="py-2.5 px-4 w-10">
                    <button onClick={toggleSelectAll} className="flex items-center justify-center">
                      {selectedRowIds.length > 0 && selectedRowIds.length === paginatedSignals.length ? (
                        <CheckSquare className="w-4 h-4 text-primary" />
                      ) : (
                        <Square className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      )}
                    </button>
                  </th>
                  <th
                    className="py-2.5 px-4 font-semibold cursor-pointer select-none hover:text-foreground"
                    onClick={() => handleSort('symbol')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Symbol</span>
                      <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </th>
                  <th className="py-2.5 px-4 font-semibold">Asset Class</th>
                  <th
                    className="py-2.5 px-4 font-semibold cursor-pointer select-none hover:text-foreground"
                    onClick={() => handleSort('signal')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Signal</span>
                      <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </th>
                  <th className="py-2.5 px-4 font-semibold text-right">Price @ Signal</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Target / Stop</th>
                  <th
                    className="py-2.5 px-4 font-semibold text-right cursor-pointer select-none hover:text-foreground"
                    onClick={() => handleSort('confidence')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Confidence</span>
                      <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </th>
                  <th className="py-2.5 px-4 font-semibold">Quant Strategy</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Alpha PnL</th>
                  <th className="py-2.5 px-4 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedSignals.map((item) => {
                  const isSelected = selectedRowIds.includes(item.id);
                  const isLong = item.signal === 'LONG';
                  const isShort = item.signal === 'SHORT';

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-secondary/30 transition-colors ${
                        isSelected ? 'bg-primary/5' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleSelectRow(item.id)}
                          className="flex items-center justify-center"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-primary" />
                          ) : (
                            <Square className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-foreground">
                        {item.symbol}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono font-medium uppercase bg-secondary border border-border text-muted-foreground">
                          {item.assetClass}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                            isLong
                              ? 'bg-success/10 text-success border-success/30'
                              : isShort
                              ? 'bg-danger/10 text-danger border-danger/30'
                              : 'bg-muted text-muted-foreground border-border'
                          }`}
                        >
                          {item.signal}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-right text-foreground">
                        {item.priceAtSignal}
                      </td>
                      <td className="py-3 px-4 font-mono text-right text-muted-foreground">
                        <span className="text-success">{item.targetPrice}</span> /{' '}
                        <span className="text-danger">{item.stopLoss}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="w-12 bg-secondary rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full"
                              style={{ width: `${item.confidence}%` }}
                            />
                          </div>
                          <span className="font-semibold text-foreground">
                            {item.confidence}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-muted-foreground">
                        {item.strategy}
                      </td>
                      <td
                        className={`py-3 px-4 font-mono font-bold text-right ${
                          item.pnlContribution.startsWith('+')
                            ? 'text-success'
                            : item.pnlContribution.startsWith('-')
                            ? 'text-danger'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {item.pnlContribution}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary"
                          onClick={() => alert(`Opening deep quant chart inspection for ${item.symbol}...`)}
                          title="Inspect Alpha Model"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}

                {paginatedSignals.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-muted-foreground text-sm">
                      No active quant signals match your search or filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-secondary/20">
            <div className="text-xs text-muted-foreground font-mono">
              Showing <span className="font-bold text-foreground">{paginatedSignals.length}</span> of{' '}
              <span className="font-bold text-foreground">{filteredSignals.length}</span> signals
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-7 px-2.5 text-xs font-mono gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </Button>
              <span className="px-3 text-xs font-mono font-semibold text-foreground">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-7 px-2.5 text-xs font-mono gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
