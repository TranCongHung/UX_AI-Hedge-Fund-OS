import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Minus, AlertCircle, BrainCircuit, Activity, Globe, Scale, Database } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const mockPriceData = Array.from({ length: 50 }).map((_, i) => ({
  time: i,
  price: 60000 + Math.random() * 5000 + (i * 100),
}));

export default function Research() {
  return (
    <div className="flex flex-col h-full gap-4 pb-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">BTC/USD</h2>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">LONG</Badge>
          </div>
          <div className="h-8 w-px bg-border hidden md:block"></div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-muted-foreground">Current Price</div>
            <div className="text-lg font-mono text-foreground">$64,230.00</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Overall AI Confidence</div>
            <div className="flex items-center gap-2">
              <Progress value={85} className="w-24 h-2" />
              <span className="text-sm font-mono text-primary">85%</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
            <BrainCircuit className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 flex-1 min-h-0">
        
        {/* Left Column: Manager & Signals */}
        <div className="xl:col-span-1 flex flex-col gap-4 min-h-0">
          {/* Manager Decision */}
          <Card className="bg-card border-border shadow-none">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-semibold">Investment Committee</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                <span className="text-xl font-bold text-success tracking-tight">STRONG BUY</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                The consensus across all sub-agents indicates a high probability of upward continuation. Macro conditions are easing, while technicals show a confirmed breakout with strong momentum.
              </p>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Key Catalysts</div>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-success mt-0.5">•</span>
                    <span>ETF inflows accelerated by 24% WoW.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success mt-0.5">•</span>
                    <span>DXY breaking below 104 support level.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning mt-0.5">•</span>
                    <span>Funding rates elevated (monitor for flush).</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Sub-Agent Signals */}
          <Card className="flex-1 flex flex-col bg-card border-border shadow-none overflow-hidden min-h-[300px]">
            <CardHeader className="py-3 border-b border-border/50 bg-secondary/20">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span>Agent Signals</span>
                <span className="text-xs font-normal text-muted-foreground">Real-time</span>
              </CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {/* Tech Agent */}
                <div className="p-3 bg-background rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-semibold">Technical Agent</span>
                    </div>
                    <Badge variant="outline" className="text-success border-success/30 bg-success/10">BULLISH</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Price action broke structure at $63.5K. RSI at 68 (not overbought). MACD histogram expanding.
                  </div>
                </div>

                {/* Macro Agent */}
                <div className="p-3 bg-background rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-semibold">Macro Agent</span>
                    </div>
                    <Badge variant="outline" className="text-success border-success/30 bg-success/10">BULLISH</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Global liquidity index ticking up. Expected rate cut probabilities increased to 72% for September.
                  </div>
                </div>

                {/* Sentiment Agent */}
                <div className="p-3 bg-background rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-semibold">Sentiment Agent</span>
                    </div>
                    <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">NEUTRAL</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Social volume extremely high. Fear & Greed at 74 (Greed). High risk of retail trap, but institutional flow offsets it.
                  </div>
                </div>
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Right Column: Deep Dive & Data */}
        <Card className="xl:col-span-2 flex flex-col bg-card border-border shadow-none min-h-[500px]">
          <Tabs defaultValue="chart" className="flex-1 flex flex-col min-h-0">
            <div className="px-4 pt-2 border-b border-border/50 bg-secondary/10">
              <TabsList className="bg-transparent h-10 p-0 border-b-0 space-x-6">
                <TabsTrigger value="chart" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 h-10 text-muted-foreground">
                  Technical Chart
                </TabsTrigger>
                <TabsTrigger value="data" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 h-10 text-muted-foreground">
                  Raw Data & Metrics
                </TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-0 h-10 text-muted-foreground">
                  Historical Research
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="chart" className="flex-1 p-4 m-0 flex flex-col min-h-0">
              <div className="w-full flex-1 bg-background rounded-lg border border-border p-4 relative min-h-[300px]">
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  <Badge variant="secondary" className="bg-card border-border">1D</Badge>
                  <Badge variant="secondary" className="bg-card border-border text-success">EMA(20)</Badge>
                  <Badge variant="secondary" className="bg-card border-border text-warning">EMA(50)</Badge>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockPriceData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="time" hide />
                    <YAxis domain={['auto', 'auto']} stroke="#52525b" fontSize={11} tickLine={false} axisLine={false} orientation="right" tickFormatter={(val) => `$${val.toLocaleString()}`} />
                    <Area type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mt-4 shrink-0">
                <div className="p-3 bg-secondary/30 rounded border border-border">
                  <div className="text-xs text-muted-foreground mb-1">RSI (14)</div>
                  <div className="text-lg font-mono text-warning">68.5</div>
                </div>
                <div className="p-3 bg-secondary/30 rounded border border-border">
                  <div className="text-xs text-muted-foreground mb-1">MACD</div>
                  <div className="text-lg font-mono text-success">Bullish</div>
                </div>
                <div className="p-3 bg-secondary/30 rounded border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Support</div>
                  <div className="text-lg font-mono">$62.8K</div>
                </div>
                <div className="p-3 bg-secondary/30 rounded border border-border">
                  <div className="text-xs text-muted-foreground mb-1">Resistance</div>
                  <div className="text-lg font-mono">$65.1K</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="data" className="flex-1 p-0 m-0">
               <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                 <Database className="w-12 h-12 mb-4 opacity-20" />
                 <p>Raw quantitative metrics will be populated here by the DB connector.</p>
               </div>
            </TabsContent>
            
            <TabsContent value="history" className="flex-1 p-0 m-0">
               <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                 <p>Historical research reports coming soon.</p>
               </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
