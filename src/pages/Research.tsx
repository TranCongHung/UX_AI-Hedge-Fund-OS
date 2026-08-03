import { fetchDashboardSignals } from '../lib/api';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Search, RefreshCw, AlertTriangle, TrendingUp, TrendingDown, Target, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Research() {
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDashboardSignals();
      if (res.ok) {
        const data = await res.json();
        setSignals(data.signals || []);
      } else {
        // Mock fallback
        setSignals([
          { symbol: 'BTC/USD', signal: 'LONG', reason: 'Bullish MA crossover with strong volume.', price_at_signal: '$64,230', created_at: new Date().toISOString() },
          { symbol: 'ETH/USD', signal: 'SHORT', reason: 'Bearish divergence on RSI.', price_at_signal: '$3,420', created_at: new Date(Date.now() - 900000).toISOString() },
          { symbol: 'NVDA', signal: 'LONG', reason: 'Strong earnings expectation and positive macro data.', price_at_signal: '$128.50', created_at: new Date(Date.now() - 3600000).toISOString() },
        ]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to n8n API. Displaying fallback data.");
      setSignals([
        { symbol: 'BTC/USD', signal: 'LONG', reason: 'Bullish MA crossover with strong volume.', price_at_signal: '$64,230', created_at: new Date().toISOString() },
        { symbol: 'ETH/USD', signal: 'SHORT', reason: 'Bearish divergence on RSI.', price_at_signal: '$3,420', created_at: new Date(Date.now() - 900000).toISOString() },
        { symbol: 'NVDA', signal: 'LONG', reason: 'Strong earnings expectation and positive macro data.', price_at_signal: '$128.50', created_at: new Date(Date.now() - 3600000).toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Research & Signals</h1>
          <p className="text-muted-foreground mt-1">Deep analysis and latest trade signals from the Investment Committee.</p>
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
      
      <div className="flex items-center gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search symbol or asset..." className="pl-9 bg-card border-border" />
        </div>
        <Button variant="secondary">Filter</Button>
      </div>

      <div className="grid gap-4">
        {signals.map((signal, idx) => {
          const isLong = signal.signal?.includes('LONG') || signal.signal === 'BUY';
          return (
            <Card key={idx} className="bg-card border-border overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="p-6 md:w-1/4 border-b md:border-b-0 md:border-r border-border bg-secondary/10 flex flex-col justify-center">
                  <div className="text-sm text-muted-foreground mb-1">{formatTime(signal.created_at)}</div>
                  <h3 className="text-2xl font-bold mb-2">{signal.symbol}</h3>
                  <div className={`inline-flex items-center gap-2 font-bold px-3 py-1.5 rounded-full w-max text-sm ${isLong ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                    {isLong ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {signal.signal}
                  </div>
                  <div className="mt-4 text-sm">
                    <span className="text-muted-foreground">Price at Signal: </span>
                    <span className="font-mono">{signal.price_at_signal}</span>
                  </div>
                </div>
                <div className="p-6 md:w-3/4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <BrainCircuit className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold text-lg">AI Reasoning</h4>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {signal.reason}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-4">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => {
                      alert(`${signal.symbol} added to Watchlist!`);
                      navigate('/watchlist');
                    }}>
                      <Target className="w-4 h-4" />
                      Add to Watchlist
                    </Button>
                    <Button size="sm" className="gap-2" onClick={() => navigate('/markets')}>
                      <LineChart className="w-4 h-4" />
                      View Chart
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
        {signals.length === 0 && !loading && (
          <div className="py-12 text-center border rounded-lg border-dashed text-muted-foreground">
            No research signals available.
          </div>
        )}
      </div>
    </div>
  );
}
