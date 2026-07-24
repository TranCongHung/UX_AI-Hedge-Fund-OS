import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';

const mockPriceData = Array.from({ length: 50 }).map((_, i) => ({
  time: i,
  price: 60000 + Math.random() * 5000 + (i * 100),
}));

export default function Research() {
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-6rem)] gap-4 pb-4">
      {/* Left: Market List */}
      <Card className="w-full lg:w-64 flex flex-col bg-card border-border shrink-0 h-64 lg:h-full">
        <div className="p-3 border-b border-border">
          <input 
            type="text" 
            placeholder="Search markets..." 
            className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            {[
              { sym: 'BTC/USD', price: '64,230', change: '+2.4%', up: true, active: true },
              { sym: 'ETH/USD', price: '3,420', change: '-0.8%', up: false },
              { sym: 'SOL/USD', price: '142.10', change: '+5.2%', up: true },
              { sym: 'NVDA', price: '128.50', change: '+1.2%', up: true },
              { sym: 'AAPL', price: '210.40', change: '-0.3%', up: false },
              { sym: 'EUR/USD', price: '1.0842', change: '-0.1%', up: false },
              { sym: 'GOLD', price: '2,340', change: '+0.5%', up: true },
            ].map((m) => (
              <button 
                key={m.sym}
                className={`flex items-center justify-between p-3 border-b border-border/50 hover:bg-secondary/50 transition-colors text-left ${m.active ? 'bg-secondary border-l-2 border-l-primary' : ''}`}
              >
                <div>
                  <div className="font-semibold text-sm">{m.sym}</div>
                  <div className="text-xs text-muted-foreground">Vol: 1.2B</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{m.price}</div>
                  <div className={`text-xs ${m.up ? 'text-success' : 'text-danger'}`}>{m.change}</div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Center: AI Research & Charts */}
      <Card className="flex-1 flex flex-col bg-card border-border min-h-[400px]">
        <div className="p-4 border-b border-border flex justify-between items-center bg-card/50 backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">BTC/USD</h2>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">BULLISH</Badge>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">AI Conf: 85%</Badge>
            </div>
            <div className="text-muted-foreground text-sm mt-1">Bitcoin / US Dollar • Binance</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-success">$64,230.00</div>
            <div className="text-sm text-success">+2.4% (24h)</div>
          </div>
        </div>

        <Tabs defaultValue="chart" className="flex-1 flex flex-col">
          <div className="px-4 pt-2 border-b border-border">
            <TabsList className="bg-transparent h-10 p-0 border-b-0 space-x-4">
              <TabsTrigger value="chart" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-10">Chart View</TabsTrigger>
              <TabsTrigger value="ai" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-10 flex gap-2">
                <AlertCircle className="w-4 h-4" /> AI Analysis
              </TabsTrigger>
              <TabsTrigger value="news" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 h-10">News Flow</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="chart" className="flex-1 p-4 m-0">
            <div className="w-full h-full bg-background rounded-lg border border-border p-2 relative">
              {/* Chart Placeholder simulating TradingView */}
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <Badge variant="secondary" className="bg-card">1D</Badge>
                <Badge variant="secondary" className="bg-card text-success">EMA(20)</Badge>
                <Badge variant="secondary" className="bg-card text-warning">EMA(50)</Badge>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockPriceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={['auto', 'auto']} stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} orientation="right" />
                  <Line type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="flex-1 p-4 m-0 overflow-auto custom-scrollbar">
            <div className="prose prose-invert max-w-none">
              <h3 className="text-lg font-semibold text-primary">Quantitative Summary</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The current market structure for BTC/USD indicates a strong continuation pattern following the recent breakout above the $62k resistance zone. Order book analysis shows significant bid liquidity resting at $63,500, providing a solid floor.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                  <h4 className="text-sm font-medium mb-2">Bull Case (Probability: 65%)</h4>
                  <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                    <li>ETF inflows remain structurally positive.</li>
                    <li>Macro environment shifting towards rate cuts.</li>
                    <li>SOPR metric reset, indicating exhaustion of short-term sellers.</li>
                  </ul>
                </div>
                <div className="p-4 bg-secondary/30 rounded-lg border border-border">
                  <h4 className="text-sm font-medium mb-2">Bear Case (Probability: 35%)</h4>
                  <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                    <li>Miner selling pressure post-halving.</li>
                    <li>Potential regulatory headwinds in EU.</li>
                    <li>Overextended funding rates in perp markets.</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Right: Indicators */}
      <Card className="w-full lg:w-72 flex flex-col bg-card border-border shrink-0 overflow-hidden h-[500px] lg:h-full">
        <CardHeader className="py-3 border-b border-border bg-card/50">
          <CardTitle className="text-sm">Technical Indicators</CardTitle>
        </CardHeader>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase">Key Levels</h4>
              <div className="flex justify-between items-center p-2 bg-background rounded border border-border">
                <span className="text-sm">Resistance 1</span>
                <span className="text-sm font-mono text-danger">$65,100</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-background rounded border border-border">
                <span className="text-sm">Support 1</span>
                <span className="text-sm font-mono text-success">$62,800</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-background rounded border border-border">
                <span className="text-sm">Support 2</span>
                <span className="text-sm font-mono text-success">$60,500</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase">Oscillators</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>RSI (14)</span>
                  <span className="font-mono text-warning">68.5</span>
                </div>
                <div className="w-full bg-background rounded-full h-1.5">
                  <div className="bg-warning h-1.5 rounded-full" style={{ width: '68.5%' }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm pt-2">
                <span>MACD (12,26)</span>
                <span className="font-mono text-success flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> Bullish</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2">
                <span>Momentum</span>
                <span className="font-mono text-success flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> High</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase">Moving Averages</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-center">
                <div className="p-2 bg-success/10 text-success rounded border border-success/20">
                  <div className="text-xs text-muted-foreground mb-1">EMA 20</div>
                  <div className="font-mono">Buy</div>
                </div>
                <div className="p-2 bg-success/10 text-success rounded border border-success/20">
                  <div className="text-xs text-muted-foreground mb-1">EMA 50</div>
                  <div className="font-mono">Buy</div>
                </div>
                <div className="p-2 bg-success/10 text-success rounded border border-success/20">
                  <div className="text-xs text-muted-foreground mb-1">SMA 100</div>
                  <div className="font-mono">Buy</div>
                </div>
                <div className="p-2 bg-secondary text-foreground rounded border border-border">
                  <div className="text-xs text-muted-foreground mb-1">SMA 200</div>
                  <div className="font-mono">Neutral</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase">Market Sentiment</h4>
              <div className="p-4 bg-background rounded-xl border border-border text-center">
                <div className="text-3xl font-bold text-success mb-1">74</div>
                <div className="text-sm font-medium text-success">Greed</div>
                <div className="text-xs text-muted-foreground mt-2">Fear & Greed Index</div>
              </div>
            </div>

          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
