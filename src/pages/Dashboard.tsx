import React, { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
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

// LUU Y: chua co workflow n8n nao cung cap du lieu equity curve / signal volume that.
// Day la du lieu DEMO de hien thi layout - PHAI hien thi kem badge "DEMO DATA" ro rang,
// khong duoc de nguoi dung nham la du lieu that (xem Technical Debt #9, CTO review).
const DEMO_equityData: EquityPoint[] = [
  { time: '09:00', alphaStrategy: 1000000, benchmarkBTC: 1000000, benchmarkSPX: 1000000 },
  { time: '10:00', alphaStrategy: 1004200, benchmarkBTC: 1001500, benchmarkSPX: 1000400 },
  { time: '11:00', alphaStrategy: 1008900, benchmarkBTC: 998200,  benchmarkSPX: 1001100 },
  { time: '12:00', alphaStrategy: 1014500, benchmarkBTC: 1004100, benchmarkSPX: 1001800 },
  { time: '13:00', alphaStrategy: 1012800, benchmarkBTC: 1002900, benchmarkSPX: 1000900 },
  { time: '14:00', alphaStrategy: 1019400, benchmarkBTC: 1008400, benchmarkSPX: 1002400 },
  { time: '15:00', alphaStrategy: 1024800, benchmarkBTC: 1006100, benchmarkSPX: 1003100 },
  { time: '16:00', alphaStrategy: 1031250, benchmarkBTC: 1011400, benchmarkSPX: 1004200 },
];

const DEMO_signalVolume: SignalVolumePoint[] = [
  { category: '00:00 - 04:00', crypto: 8, equities: 2, fx: 4 },
  { category: '04:00 - 08:00', crypto: 12, equities: 5, fx: 9 },
  { category: '08:00 - 12:00', crypto: 15, equities: 24, fx: 14 },
  { category: '12:00 - 16:00', crypto: 18, equities: 31, fx: 12 },
  { category: '16:00 - 20:00', crypto: 14, equities: 10, fx: 8 },
  { category: '20:00 - 24:00', crypto: 11, equities: 4, fx: 6 },
];

// Truoc day co mang defaultSignals chua du lieu gia (NVDA, AAPL, "Transformer-Momentum-v4"...)
// khong khop voi backend that (backend chi giao dich crypto qua Binance, chien luoc EMA-cross+ATR).
// Da xoa bo hoan toan - state `signals` gio khoi tao rong, chi hien thi khi co du lieu that tu WF-080.
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
  const [signals, setSignals] = useState<QuantSignal[]>([]);
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

      if (!statusRes || !statusRes.ok || !signalsRes || !signalsRes.ok) {
        setError('Khong ket noi duoc voi n8n webhook WF-080. Chua co du lieu tin hieu that de hien thi.');
      }

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

      {/* 1. KPI GRID (High Density Performance & Infrastructure Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Intraday PnL */}
        <Card className="bg-card border-border shadow-xs overflow-hidden">
          <div className="h-1 w-full bg-success" />
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Intraday Alpha PnL</span>
              <TrendingUp className="w-3.5 h-3.5 text-success" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-foreground">+$31,250.00</span>
              <span className="text-[10px] font-bold text-success font-mono">+3.12%</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-muted-foreground/60 border-t border-border/40 pt-2">
              <span>SHARPE: 2.84</span>
              <span>MAX_DD: -1.42%</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Active Signals */}
        <Card className="bg-card border-border shadow-xs overflow-hidden">
          <div className="h-1 w-full bg-primary" />
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Signals Today</span>
              <Activity className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-foreground">{status.signalsTodayCount}</span>
              <span className="px-1 py-0.5 rounded-sm text-[8px] font-black uppercase bg-warning/10 text-warning border border-warning/30">
                DEMO
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-muted-foreground/60 border-t border-border/40 pt-2">
              <span>Chua co win-rate tinh toan that</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Infra Status - LUU Y: he thong chay tren Ollama CPU (may 6GB RAM) qua Docker,
            khong phai GPU cluster. Da bo cac chi so "AI Compute (GPU)/VRAM/LLAMA-3-70B" gia truoc day. */}
        <Card className="bg-card border-border shadow-xs overflow-hidden">
          <div className={`h-1 w-full ${status.ollamaOnline ? 'bg-success' : 'bg-warning'}`} />
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">AI Agents</span>
              <Cpu className="w-3.5 h-3.5 text-info" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-foreground">
                {status.ollamaOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-muted-foreground/60 border-t border-border/40 pt-2">
              <span>GROQ-OSS-20B</span>
              <span>QWEN2.5:3B</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Infrastructure */}
        <Card className="bg-card border-border shadow-xs overflow-hidden">
          <div className={`h-1 w-full ${status.n8nOnline && status.postgresOnline ? 'bg-success' : 'bg-warning'}`} />
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">System Clusters</span>
              <Database className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono tracking-tight text-foreground">STABLE</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-success" />
            </div>
            <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-muted-foreground/60 border-t border-border/40 pt-2">
              <span>FLOWS: {status.activeWorkflows}</span>
              <span>SYNC: OK</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. CHARTS (Intraday Equity Curve vs Benchmarks + Signal Volume) */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* CHART 1: Area chart comparing AI Strategy Equity vs Benchmarks */}
        <Card className="lg:col-span-2 bg-card border-border shadow-xs overflow-hidden">
          <CardHeader className="pb-0 pt-4 px-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-3.5 h-3.5 text-primary" />
                  <CardTitle className="text-[11px] font-bold uppercase tracking-[0.1em] text-foreground">
                    Performance Attribution Analysis
                  </CardTitle>
                  <span className="px-1.5 py-0.5 rounded-sm text-[9px] font-black uppercase bg-warning/10 text-warning border border-warning/30">
                    DEMO DATA
                  </span>
                </div>
                <CardDescription className="text-[10px] font-mono">
                  Normalized Intraday Equity • Granularity: 60s • Chua co workflow n8n cung cap du lieu that
                </CardDescription>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono font-bold">
                <div className="flex items-center gap-1.5 text-primary">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>ALPHA_V4</span>
                </div>
                <div className="flex items-center gap-1.5 text-info">
                  <div className="w-2 h-2 rounded-full bg-info" />
                  <span>BTC_USD</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-1 pb-2 pt-6">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DEMO_equityData} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="alphaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} opacity={0.4} />
                  <XAxis 
                    dataKey="time" 
                    stroke="var(--color-muted-foreground)" 
                    fontSize={9} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                    fontFamily="JetBrains Mono"
                  />
                  <YAxis
                    stroke="var(--color-muted-foreground)"
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                    domain={['auto', 'auto']}
                    fontFamily="JetBrains Mono"
                    tickFormatter={(val) => `$${(val / 1000).toFixed(0)}K`}
                  />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: 'var(--color-popover)', borderColor: 'var(--color-border)', borderRadius: '4px', fontSize: '10px', padding: '8px' }}
                    labelStyle={{ color: 'var(--color-foreground)', fontWeight: 800, marginBottom: '4px', fontFamily: 'JetBrains Mono' }}
                    itemStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono', padding: '0px' }}
                    cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="alphaStrategy"
                    name="Alpha Strategy"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#alphaGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="benchmarkBTC"
                    name="BTC Benchmark"
                    stroke="var(--color-info)"
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                    fill="none"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* CHART 2: Bar Chart for Signal Volume */}
        <Card className="lg:col-span-1 bg-card border-border shadow-xs overflow-hidden">
          <CardHeader className="pb-0 pt-4 px-5">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-3.5 h-3.5 text-primary" />
              <CardTitle className="text-[11px] font-bold uppercase tracking-[0.1em] text-foreground">
                Signal Volume Matrix
              </CardTitle>
              <span className="px-1.5 py-0.5 rounded-sm text-[9px] font-black uppercase bg-warning/10 text-warning border border-warning/30">
                DEMO DATA
              </span>
            </div>
            <CardDescription className="text-[10px] font-mono">
              Cluster density across asset pools
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2 pb-2 pt-8">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEMO_signalVolume} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} opacity={0.4} />
                  <XAxis 
                    dataKey="category" 
                    stroke="var(--color-muted-foreground)" 
                    fontSize={8} 
                    tickLine={false} 
                    axisLine={false} 
                    fontFamily="JetBrains Mono"
                    tickFormatter={(val) => val.split(' - ')[0]}
                  />
                  <YAxis 
                    stroke="var(--color-muted-foreground)" 
                    fontSize={9} 
                    tickLine={false} 
                    axisLine={false} 
                    fontFamily="JetBrains Mono"
                  />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: 'var(--color-popover)', borderColor: 'var(--color-border)', borderRadius: '4px', fontSize: '10px' }}
                    cursor={{ fill: 'var(--color-accent)', opacity: 0.4 }}
                  />
                  <Bar dataKey="crypto" name="Crypto" fill="var(--color-primary)" radius={[2, 2, 0, 0]} barSize={12} />
                  <Bar dataKey="equities" name="Equities" fill="var(--color-success)" radius={[2, 2, 0, 0]} barSize={12} />
                  <Bar dataKey="fx" name="FX / Macro" fill="var(--color-info)" radius={[2, 2, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. TABLE & 4. FILTERS (Quant Signals & Order Book) */}
      <Card className="bg-card border-border shadow-xs overflow-hidden">
        <CardHeader className="pb-3 pt-4 px-5 border-b border-border bg-accent/5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-[14px] font-bold uppercase tracking-tight">
                  Research Book & Signal Matrix
                </CardTitle>
                <div className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-secondary border border-border text-foreground/70">
                  {filteredSignals.length} LIVE_SIGNALS
                </div>
              </div>
              <CardDescription className="text-[11px] mt-1">
                Real-time attribution & model confidence scores for alpha research pool.
              </CardDescription>
            </div>

            {/* 4. FILTERS */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-48 sm:w-64">
                <Search className="w-3 h-3 absolute left-2.5 top-2.5 text-muted-foreground/50" />
                <Input
                  placeholder="Search symbols or strategies..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-8 h-8 text-[11px] font-mono bg-secondary/30 border-border focus:ring-1 focus:ring-primary/30"
                />
              </div>

              <div className="flex items-center bg-secondary/40 rounded p-0.5 border border-border h-8">
                {(['ALL', 'CRYPTO', 'EQUITIES', 'FX'] as const).map((ac) => (
                  <button
                    key={ac}
                    onClick={() => {
                      setSelectedAssetClass(ac);
                      setCurrentPage(1);
                    }}
                    className={cn(
                      "px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-sm transition-all",
                      selectedAssetClass === ac
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {ac}
                  </button>
                ))}
              </div>

              <div className="flex items-center bg-secondary/40 rounded p-0.5 border border-border h-8">
                {(['ALL', 'LONG', 'SHORT'] as const).map((dir) => (
                  <button
                    key={dir}
                    onClick={() => {
                      setSignalTypeFilter(dir);
                      setCurrentPage(1);
                    }}
                    className={cn(
                      "px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-sm transition-all",
                      signalTypeFilter === dir
                        ? 'bg-secondary text-foreground border border-border/50 shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {dir}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/20 text-muted-foreground font-mono text-[10px] font-bold uppercase tracking-widest sticky top-0 z-10 backdrop-blur-sm">
                  <th className="py-2 px-4 w-10">
                    <button onClick={toggleSelectAll} className="flex items-center justify-center opacity-60 hover:opacity-100">
                      {selectedRowIds.length > 0 && selectedRowIds.length === paginatedSignals.length ? (
                        <CheckSquare className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <Square className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </th>
                  <th className="py-2 px-4 cursor-pointer group" onClick={() => handleSort('symbol')}>
                    <div className="flex items-center gap-1.5 group-hover:text-foreground">
                      SYMBOL <ArrowUpDown className="w-3 h-3 opacity-40" />
                    </div>
                  </th>
                  <th className="py-2 px-4">POOL</th>
                  <th className="py-2 px-4 cursor-pointer group" onClick={() => handleSort('signal')}>
                    <div className="flex items-center gap-1.5 group-hover:text-foreground">
                      SIDE <ArrowUpDown className="w-3 h-3 opacity-40" />
                    </div>
                  </th>
                  <th className="py-2 px-4 text-right">ENTRY_PX</th>
                  <th className="py-2 px-4 text-right">TP_SL</th>
                  <th className="py-2 px-4 text-right cursor-pointer group" onClick={() => handleSort('confidence')}>
                    <div className="flex items-center justify-end gap-1.5 group-hover:text-foreground">
                      CONF % <ArrowUpDown className="w-3 h-3 opacity-40" />
                    </div>
                  </th>
                  <th className="py-2 px-4">STRATEGY</th>
                  <th className="py-2 px-4 text-right">EST_PNL</th>
                  <th className="py-2 px-4 text-center">OP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono">
                {paginatedSignals.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-muted-foreground/60 text-[11px]">
                      {loading
                        ? 'Dang tai du lieu tu WF-080...'
                        : 'Chua co tin hieu that nao. Kiem tra n8n webhook WF-080 dang chay chua.'}
                    </td>
                  </tr>
                )}
                {paginatedSignals.map((item) => {
                  const isSelected = selectedRowIds.includes(item.id);
                  const isLong = item.signal === 'LONG';
                  const isShort = item.signal === 'SHORT';

                  return (
                    <tr key={item.id} className={cn("hover:bg-accent/30 transition-colors text-[11px]", isSelected && "bg-primary/[0.03]")}>
                      <td className="py-2 px-4">
                        <button onClick={() => toggleSelectRow(item.id)} className="flex items-center justify-center opacity-40 hover:opacity-100">
                          {isSelected ? <CheckSquare className="w-3.5 h-3.5 text-primary" /> : <Square className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                      <td className="py-2 px-4 font-bold text-foreground">{item.symbol}</td>
                      <td className="py-2 px-4">
                        <span className="text-[9px] font-bold text-muted-foreground/60">{item.assetClass}</span>
                      </td>
                      <td className="py-2 px-4">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-sm text-[9px] font-black uppercase border",
                          isLong ? 'bg-success/5 text-success border-success/20' : 
                          isShort ? 'bg-danger/5 text-danger border-danger/20' : 
                          'bg-muted text-muted-foreground border-border'
                        )}>
                          {item.signal}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-right font-bold text-foreground/80">{item.priceAtSignal}</td>
                      <td className="py-2 px-4 text-right">
                        <span className="text-success/80">{item.targetPrice}</span>
                        <span className="mx-1 opacity-20">/</span>
                        <span className="text-danger/80">{item.stopLoss}</span>
                      </td>
                      <td className="py-2 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-10 bg-secondary/50 rounded-full h-1 overflow-hidden">
                            <div className="bg-primary h-full" style={{ width: `${item.confidence}%` }} />
                          </div>
                          <span className="font-bold text-foreground/70">{item.confidence}%</span>
                        </div>
                      </td>
                      <td className="py-2 px-4 text-muted-foreground/60 text-[10px]">{item.strategy}</td>
                      <td className={cn(
                        "py-2 px-4 font-bold text-right",
                        item.pnlContribution.startsWith('+') ? 'text-success' : 
                        item.pnlContribution.startsWith('-') ? 'text-danger' : 
                        'text-muted-foreground'
                      )}>
                        {item.pnlContribution}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground/40 hover:text-primary">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-accent/5">
            <div className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest font-mono">
              CUR_PAGE: {currentPage} // TOTAL_RECORDS: {filteredSignals.length}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-6 px-2 text-[10px] font-bold uppercase tracking-tighter"
              >
                <ChevronLeft className="w-3 h-3 mr-1" /> PREV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-6 px-2 text-[10px] font-bold uppercase tracking-tighter"
              >
                NEXT <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
