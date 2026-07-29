import { fetchDashboardStatus } from '../lib/api';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Eye, TrendingUp, TrendingDown, Minus, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDashboardStatus();
      if (res.ok) {
        const data = await res.json();
        setWatchlist(data.watchlist || []);
      } else {
        // Mock fallback
        setWatchlist([
          { symbol: 'BTC/USDT', score: 85, cross_direction: 'BULLISH' },
          { symbol: 'ETH/USDT', score: 72, cross_direction: 'BULLISH' },
          { symbol: 'SOL/USDT', score: 91, cross_direction: 'BULLISH' },
          { symbol: 'AAPL', score: 45, cross_direction: 'BEARISH' },
          { symbol: 'NVDA', score: 68, cross_direction: 'NEUTRAL' }
        ]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to n8n API. Displaying fallback data.");
      setWatchlist([
        { symbol: 'BTC/USDT', score: 85, cross_direction: 'BULLISH' },
        { symbol: 'ETH/USDT', score: 72, cross_direction: 'BULLISH' },
        { symbol: 'SOL/USDT', score: 91, cross_direction: 'BULLISH' },
        { symbol: 'AAPL', score: 45, cross_direction: 'BEARISH' },
        { symbol: 'NVDA', score: 68, cross_direction: 'NEUTRAL' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDirectionIcon = (dir: string) => {
    if (dir === 'BULLISH') return <TrendingUp className="w-4 h-4 text-success" />;
    if (dir === 'BEARISH') return <TrendingDown className="w-4 h-4 text-danger" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const getDirectionColor = (dir: string) => {
    if (dir === 'BULLISH') return 'text-success';
    if (dir === 'BEARISH') return 'text-danger';
    return 'text-muted-foreground';
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Watchlist</h1>
          <p className="text-muted-foreground mt-1">Assets currently monitored by AI Agents.</p>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {watchlist.map((item, idx) => (
          <Card key={idx} className="bg-card border-border hover:border-primary/30 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg font-bold">{item.symbol}</CardTitle>
              <Eye className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <div className="text-sm text-muted-foreground">AI Score</div>
                  <div className="text-2xl font-bold">{item.score}/100</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Trend</div>
                  <div className={`flex items-center gap-1 justify-end font-semibold ${getDirectionColor(item.cross_direction)}`}>
                    {item.cross_direction}
                    {getDirectionIcon(item.cross_direction)}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.score >= 70 ? 'bg-success' : item.score <= 30 ? 'bg-danger' : 'bg-warning'}`} 
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
