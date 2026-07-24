import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Play, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const equityCurve = Array.from({ length: 100 }).map((_, i) => ({
  date: `Day ${i}`,
  value: 10000 + (Math.sin(i / 10) * 1000) + (i * 50) + (Math.random() * 500)
}));

export default function Backtesting() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Backtesting Engine</h1>
          <p className="text-muted-foreground mt-1">Simulate strategy performance on historical data.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Settings2 className="w-4 h-4 mr-2"/> Config</Button>
          <Button><Play className="w-4 h-4 mr-2"/> Run Test</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Win Rate</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-success">62.4%</div></CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Profit Factor</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-success">1.84</div></CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Max Drawdown</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-danger">-12.5%</div></CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Trades</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">1,248</div></CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Equity Curve</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityCurve}>
                <defs>
                  <linearGradient id="colorEq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="date" hide />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `$${v.toLocaleString()}`}/>
                <Tooltip contentStyle={{ backgroundColor: '#111114', borderColor: '#222' }} />
                <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorEq)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
