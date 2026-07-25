import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Database, ListChecks, Signal as SignalIcon, Target, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { API, DashboardStatus, Signal } from '@/lib/api';

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'vua xong';
  if (mins < 60) return `${mins} phut truoc`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} gio truoc`;
  return `${Math.floor(hours / 24)} ngay truoc`;
}

export default function Dashboard() {
  const [status, setStatus] = useState<DashboardStatus | null>(null);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchAll() {
    setLoading(true);
    setError(null);
    try {
      const [statusRes, signalsRes] = await Promise.all([
        axios.get(API.dashboardStatus, { timeout: 15000 }),
        axios.get(API.dashboardSignals, { timeout: 15000 }),
      ]);
      setStatus(statusRes.data);
      setSignals((signalsRes.data?.signals || []).slice(0, 5));
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.message : 'Loi khong xac dinh');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Tong quan he thong AI-Hedge-Fund-OS.</p>
      </div>

      {error && (
        <Card className="bg-danger/10 border-danger/30">
          <CardContent className="p-4 text-sm text-danger">
            Khong the tai du lieu: {error}. Kiem tra n8n workflow WF-080 da Active chua.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Postgres</CardTitle>
            <Database className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {status?.postgres_online ? (
                <><CheckCircle2 className="w-4 h-4 text-success" /><span className="text-lg font-bold">Online</span></>
              ) : (
                <><XCircle className="w-4 h-4 text-danger" /><span className="text-lg font-bold">Offline</span></>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Watchlist</CardTitle>
            <ListChecks className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status?.watchlist_count ?? '-'}</div>
            <p className="text-xs text-muted-foreground mt-1">Coin dang theo doi (WF-005)</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tin hieu hom nay</CardTitle>
            <SignalIcon className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status?.signals_today_count ?? '-'}</div>
            <p className="text-xs text-muted-foreground mt-1">Tu WF-020 Research AI</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ty le thang (backtest)</CardTitle>
            <Target className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {status?.backtest_summary?.length
                ? `${(status.backtest_summary.reduce((a, b) => a + b.win_rate_pct, 0) / status.backtest_summary.length).toFixed(0)}%`
                : '-'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Trung binh WF-030 (mau nho)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Trang thai workflow</CardTitle>
            <CardDescription>Lan chay gan nhat cua tung workflow.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(status?.workflow_runs || []).map((w) => (
                <div key={w.workflow_id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center gap-2">
                    {w.status === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : (
                      <XCircle className="w-4 h-4 text-warning" />
                    )}
                    <span className="font-medium text-sm">{w.workflow_id}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {timeAgo(w.created_at)}
                  </div>
                </div>
              ))}
              {!status?.workflow_runs?.length && !loading && (
                <p className="text-sm text-muted-foreground text-center py-4">Chua co du lieu workflow_logs.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Tin hieu gan nhat</CardTitle>
            <CardDescription>5 tin hieu moi nhat tu AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {signals.map((s) => (
                <div key={s.symbol} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                  <div>
                    <div className="font-semibold">{s.symbol}</div>
                    <div className="text-xs text-muted-foreground">{timeAgo(s.created_at)}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${s.signal === 'BUY' ? 'text-success' : s.signal === 'SELL' ? 'text-danger' : 'text-muted-foreground'}`}>
                      {s.signal}
                    </div>
                    <div className="text-sm font-mono">{s.price_at_signal ?? '-'}</div>
                  </div>
                </div>
              ))}
              {!signals.length && !loading && (
                <p className="text-sm text-muted-foreground text-center py-4">Chua co tin hieu nao.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
