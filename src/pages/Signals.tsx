import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowUpRight, ArrowDownRight, Target, ShieldAlert, Zap } from 'lucide-react';

const mockSignals = [
  { id: '1', symbol: 'BTC/USD', price: '$64,230', signal: 'LONG', confidence: 85, risk: 'Medium', reward: 'High', reason: 'EMA Crossover + Volume Spike', time: '10 mins ago', pnl: '+0.5%' },
  { id: '2', symbol: 'ETH/USD', price: '$3,420', signal: 'SHORT', confidence: 72, risk: 'High', reward: 'High', reason: 'Resistance Rejection at 3450', time: '1 hour ago', pnl: '-0.2%' },
  { id: '3', symbol: 'SOL/USD', price: '$142.10', signal: 'LONG', confidence: 91, risk: 'Low', reward: 'Medium', reason: 'Oversold RSI Divergence', time: '3 hours ago', pnl: '+2.1%' },
  { id: '4', symbol: 'NVDA', price: '$128.50', signal: 'LONG', confidence: 68, risk: 'Medium', reward: 'Medium', reason: 'Earnings anticipation flow', time: '4 hours ago', pnl: '+0.8%' },
  { id: '5', symbol: 'EUR/USD', price: '1.0842', signal: 'SHORT', confidence: 79, risk: 'Low', reward: 'Low', reason: 'Macro divergence EUR vs USD', time: '5 hours ago', pnl: '+0.1%' },
  { id: '6', symbol: 'AAPL', price: '$210.40', signal: 'SHORT', confidence: 62, risk: 'Medium', reward: 'Low', reason: 'Momentum waning pre-event', time: '1 day ago', pnl: '-1.2%' },
];

export default function Signals() {
  const [selectedSignal, setSelectedSignal] = useState<typeof mockSignals[0] | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trading Signals</h1>
          <p className="text-muted-foreground mt-1">AI-generated entry and exit opportunities.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Filter</Button>
          <Button>Run AI Scan Now</Button>
        </div>
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Symbol</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Signal</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Risk/Reward</TableHead>
              <TableHead className="hidden md:table-cell">Reason</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockSignals.map((signal) => (
              <TableRow 
                key={signal.id} 
                className="border-border cursor-pointer hover:bg-secondary/40 transition-colors"
                onClick={() => setSelectedSignal(signal)}
              >
                <TableCell className="font-medium">{signal.symbol}</TableCell>
                <TableCell className="font-mono">{signal.price}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={signal.signal === 'LONG' ? 'text-success border-success/30 bg-success/10' : 'text-danger border-danger/30 bg-danger/10'}>
                    {signal.signal === 'LONG' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {signal.signal}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-background rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${signal.confidence > 80 ? 'bg-success' : signal.confidence > 70 ? 'bg-primary' : 'bg-warning'}`} 
                        style={{ width: `${signal.confidence}%` }} 
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{signal.confidence}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs">
                    <span className={signal.risk === 'Low' ? 'text-success' : signal.risk === 'High' ? 'text-danger' : 'text-warning'}>{signal.risk}</span>
                    <span className="text-muted-foreground mx-1">/</span>
                    <span className={signal.reward === 'High' ? 'text-success' : signal.reward === 'Low' ? 'text-muted-foreground' : 'text-primary'}>{signal.reward}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[200px] truncate">
                  {signal.reason}
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {signal.time}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!selectedSignal} onOpenChange={(open) => !open && setSelectedSignal(null)}>
        <DialogContent className="bg-card border-border sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              {selectedSignal?.symbol} 
              <Badge variant="outline" className={selectedSignal?.signal === 'LONG' ? 'text-success border-success/30 bg-success/10 text-sm' : 'text-danger border-danger/30 bg-danger/10 text-sm'}>
                {selectedSignal?.signal}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Generated {selectedSignal?.time} by AI Pattern Engine v4.2
            </DialogDescription>
          </DialogHeader>
          
          {selectedSignal && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-background border-border/50 p-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><Target className="w-3 h-3"/> Entry Price</div>
                  <div className="font-mono text-lg">{selectedSignal.price}</div>
                </Card>
                <Card className="bg-background border-border/50 p-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><Zap className="w-3 h-3"/> Target</div>
                  <div className="font-mono text-lg text-success">
                    {selectedSignal.signal === 'LONG' ? '$68,500' : '$3,200'}
                  </div>
                </Card>
                <Card className="bg-background border-border/50 p-3">
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><ShieldAlert className="w-3 h-3"/> Stop Loss</div>
                  <div className="font-mono text-lg text-danger">
                    {selectedSignal.signal === 'LONG' ? '$61,200' : '$3,550'}
                  </div>
                </Card>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">AI Thesis</h4>
                <div className="p-4 bg-secondary/50 rounded-lg text-sm text-muted-foreground leading-relaxed">
                  The quantitative model identified a {selectedSignal.reason.toLowerCase()} pattern. Volume profile analysis supports this move with a 2.4x standard deviation spike on the latest hourly candle. Correlated assets are also showing similar strength, confirming the validity of the breakout.
                  <br/><br/>
                  <strong>Risk Assessment:</strong> Macro data release in 2 hours could cause volatility. Position sizing should be kept to {selectedSignal.risk === 'High' ? '0.5%' : selectedSignal.risk === 'Medium' ? '1%' : '2%'} of portfolio equity.
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border/50">
                <Button className="flex-1 bg-primary hover:bg-primary/90">Execute Trade</Button>
                <Button variant="outline" className="flex-1">Send to Workflow</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
