import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, Server, Cpu, HardDrive, Database, TerminalSquare, Workflow, Bot, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

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
  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">System overview and real-time metrics.</p>
      </div>

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
        {/* Services */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Postgres</CardTitle>
            <Database className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-lg font-bold">Online</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">12ms latency</p>
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
            <p className="text-xs text-muted-foreground mt-1">8 Active Webhooks</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Running Agents</CardTitle>
            <Bot className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">Across 4 markets</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Market Sentiment</CardTitle>
            <Activity className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">Neutral-Bullish</div>
            <p className="text-xs text-muted-foreground mt-1">Score: 68/100</p>
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
              {[
                { pair: 'BTC/USD', type: 'LONG', price: '$64,230', time: '2m ago', color: 'text-success' },
                { pair: 'ETH/USD', type: 'SHORT', price: '$3,420', time: '15m ago', color: 'text-danger' },
                { pair: 'NVDA', type: 'LONG', price: '$128.50', time: '1h ago', color: 'text-success' },
                { pair: 'EUR/USD', type: 'SHORT', price: '1.0842', time: '2h ago', color: 'text-danger' },
                { pair: 'SOL/USD', type: 'LONG', price: '$142.10', time: '3h ago', color: 'text-success' },
              ].map((signal, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                  <div>
                    <div className="font-semibold">{signal.pair}</div>
                    <div className="text-xs text-muted-foreground">{signal.time}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${signal.color}`}>{signal.type}</div>
                    <div className="text-sm">{signal.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
