import { fetchDashboardStatus } from '../lib/api';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TestTube, TrendingUp, TrendingDown, Percent, Activity, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Backtesting() {
  const [backtests, setBacktests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDashboardStatus();
      if (res.ok) {
        const data = await res.json();
        setBacktests(data.backtest_summary || []);
      } else {
        // Mock fallback
        setBacktests([
          { symbol: 'BTC/USDT', total_trades: 142, wins: 88, losses: 54, win_rate_pct: 61.97, avg_rr_achieved: 1.8 },
          { symbol: 'ETH/USDT', total_trades: 110, wins: 62, losses: 48, win_rate_pct: 56.36, avg_rr_achieved: 2.1 },
          { symbol: 'SOL/USDT', total_trades: 95, wins: 45, losses: 50, win_rate_pct: 47.36, avg_rr_achieved: 2.8 },
        ]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to n8n API. Displaying fallback data.");
      setBacktests([
        { symbol: 'BTC/USDT', total_trades: 142, wins: 88, losses: 54, win_rate_pct: 61.97, avg_rr_achieved: 1.8 },
        { symbol: 'ETH/USDT', total_trades: 110, wins: 62, losses: 48, win_rate_pct: 56.36, avg_rr_achieved: 2.1 },
        { symbol: 'SOL/USDT', total_trades: 95, wins: 45, losses: 50, win_rate_pct: 47.36, avg_rr_achieved: 2.8 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Backtesting Engine</h1>
          <p className="text-muted-foreground mt-1">Historical strategy performance and quant metrics.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-warning/10 text-warning border border-warning/20 rounded-lg flex items-center gap-2 text-sm">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {backtests.map((bt, idx) => (
          <Card key={idx} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
              <div className="flex items-center gap-2">
                <TestTube className="w-5 h-5 text-primary" />
                <CardTitle className="text-xl font-bold">{bt.symbol} Strategy</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Activity className="w-3 h-3" /> Trades
                  </div>
                  <div className="text-xl font-semibold">{bt.total_trades}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Percent className="w-3 h-3" /> Win Rate
                  </div>
                  <div className={`text-xl font-semibold ${Number(bt.win_rate_pct) > 50 ? 'text-success' : 'text-danger'}`}>
                    {Number(bt.win_rate_pct).toFixed(2)}%
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Wins
                  </div>
                  <div className="text-xl font-semibold text-success">{bt.wins}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" /> Losses
                  </div>
                  <div className="text-xl font-semibold text-danger">{bt.losses}</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-muted-foreground">Avg Risk/Reward Achieved: </span>
                  <span className="font-bold">1:{Number(bt.avg_rr_achieved).toFixed(2)}</span>
                </div>
                <Button variant="secondary" size="sm" onClick={() => navigate('/database')}>View Detailed Log</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {backtests.length === 0 && !loading && (
          <div className="col-span-full py-12 text-center border rounded-lg border-dashed text-muted-foreground">
            No backtest data available.
          </div>
        )}
      </div>
    </div>
  );
}
