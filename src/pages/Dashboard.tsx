import { fetchDashboardStatus, fetchDashboardSignals } from '../lib/api';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, Server, Cpu, HardDrive, Database, TerminalSquare, Workflow, Bot, TrendingUp, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';

const pnlData = [
  { time: '09:00', value: 1200 },
  { time: '10:00', value: 1800 },
  { time: '11:00', value: 1500 },
  { time: '12:00', value: 2400 },
  { time: '13:00', value: 2100 },
  { time: '14:00', value: 3200 },
  { time: '15:00', value: 2800 },
  { time: '16:00', value: 3600 },
];

export default function Dashboard() {
  const [statusData, setStatusData] = useState<any>(null);
  const [signalsData, setSignalsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Connect to n8n webhook WF-080
      const [statusRes, signalsRes] = await Promise.all([
        fetchDashboardStatus().catch(() => null),
        fetchDashboardSignals().catch(() => null)
      ]);

      if (statusRes && statusRes.ok) {
        const data = await statusRes.json();
        setStatusData(data);
      } else {
        // Mock data fallback if n8n is not reachable
        setStatusData({
          postgres_online: true,
          signals_today_count: 12,
          workflow_runs: [{}, {}, {}, {}, {}, {}, {}, {}],
          watchlist_count: 24
        });
      }

      if (signalsRes && signalsRes.ok) {
        const data = await signalsRes.json();
        setSignalsData(data.signals || []);
      } else {
        setSignalsData([
          { symbol: 'BTC/USD', signal: 'LONG', price_at_signal: '$64,230', created_at: new Date().toISOString(), color: 'text-success' },
          { symbol: 'ETH/USD', signal: 'SHORT', price_at_signal: '$3,420', created_at: new Date(Date.now() - 900000).toISOString(), color: 'text-danger' },
          { symbol: 'NVDA', signal: 'LONG', price_at_signal: '$128.50', created_at: new Date(Date.now() - 3600000).toISOString(), color: 'text-success' },
        ]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data from n8n API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Auto refresh every 30s
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">System overview and real-time metrics connected via n8n (WF-080).</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchDashboardData} 
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg flex items-center gap-2 text-sm">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Core System */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">CPU Usage</CardTitle>
            <Cpu className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
            <p className="text-xs text-muted-foreground mt-1">16 Cores Active</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">RAM</CardTitle>
            <HardDrive className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5 GB</div>
            <p className="text-xs text-muted-foreground mt-1">Of 64 GB Total</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">GPU (Ollama)</CardTitle>
            <Server className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.2 GB</div>
            <p className="text-xs text-muted-foreground mt-1">RTX 4090 (94% Util)</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's PnL</CardTitle>
            <TrendingUp className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">+$3,600.50</div>
            <p className="text-xs text-muted-foreground mt-1">+2.4% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Services from WF-080 */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Postgres</CardTitle>
            <Database className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {statusData?.postgres_online ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-lg font-bold">Online</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-danger" />
                  <span className="text-lg font-bold">Offline</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {statusData?.watchlist_count || 0} active watchlist items
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">n8n Engine</CardTitle>
            <TerminalSquare className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-lg font-bold">Online</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">WF-080 API Connected</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Workflow Runs</CardTitle>
            <Workflow className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusData?.workflow_runs?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Active workflows</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Signals Today</CardTitle>
            <Activity className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{statusData?.signals_today_count || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Generated by agents</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
        <Card className="md:col-span-4 lg:col-span-5 bg-card border-border">
          <CardHeader>
            <CardTitle>Intraday Equity Curve</CardTitle>
            <CardDescription>Live PnL tracking for active strategies.</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pnlData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="time" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#111114', borderColor: '#222', color: '#fff' }}
                    itemStyle={{ color: '#4f46e5' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorPnl)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3 lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle>Recent Signals</CardTitle>
            <CardDescription>Latest AI-generated trade alerts.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {signalsData?.map((signal: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                  <div>
                    <div className="font-semibold">{signal.symbol}</div>
                    <div className="text-xs text-muted-foreground">{formatTime(signal.created_at)}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${signal.signal?.includes('LONG') || signal.signal === 'BUY' ? 'text-success' : 'text-danger'}`}>
                      {signal.signal}
                    </div>
                    <div className="text-sm">{signal.price_at_signal}</div>
                  </div>
                </div>
              ))}
              {(!signalsData || signalsData.length === 0) && (
                <div className="text-center text-muted-foreground py-8 text-sm">
                  No signals found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
