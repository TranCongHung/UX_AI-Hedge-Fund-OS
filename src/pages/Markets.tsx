import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Activity, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchDashboardStatus } from '../lib/api';

export default function Markets() {
  const [loading, setLoading] = useState(false);
  const [marketData, setMarketData] = useState<any[]>([
    { symbol: 'BTC/USDT', price: '64,230.00', change24h: '+2.4%', isPositive: true, volume: '32.1B' },
    { symbol: 'ETH/USDT', price: '3,450.20', change24h: '+1.2%', isPositive: true, volume: '14.5B' },
    { symbol: 'SOL/USDT', price: '145.80', change24h: '-0.8%', isPositive: false, volume: '3.2B' },
    { symbol: 'S&P 500', price: '5,304.50', change24h: '+0.5%', isPositive: true, volume: '-' },
    { symbol: 'NASDAQ', price: '16,920.80', change24h: '+0.9%', isPositive: true, volume: '-' },
    { symbol: 'GOLD', price: '2,340.10', change24h: '-0.2%', isPositive: false, volume: '-' },
  ]);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Overview</h1>
          <p className="text-muted-foreground mt-1">Live market data and macro indicators.</p>
        </div>
        <Button variant="outline" size="sm" onClick={refreshData} disabled={loading} className="gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {marketData.map((item, idx) => (
          <Card key={idx} className="bg-card border-border hover:border-primary/30 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-lg font-bold">{item.symbol}</CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mt-2">
                <div className="text-2xl font-bold">{item.price}</div>
                <div className={`flex items-center gap-1 font-semibold ${item.isPositive ? 'text-success' : 'text-danger'}`}>
                  {item.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {item.change24h}
                </div>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Volume: {item.volume}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Top Gainers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {['PEPE/USDT', 'AR/USDT', 'RNDR/USDT'].map((symbol, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                <span className="font-bold">{symbol}</span>
                <span className="text-success font-semibold">+{Math.floor(Math.random() * 15 + 5)}.%</span>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Top Losers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {['WIF/USDT', 'TIA/USDT', 'ORDI/USDT'].map((symbol, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                <span className="font-bold">{symbol}</span>
                <span className="text-danger font-semibold">-{Math.floor(Math.random() * 10 + 2)}.%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
