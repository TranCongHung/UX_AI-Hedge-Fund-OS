import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowUpRight, ArrowDownRight, Minus, RefreshCw, Target, AlertTriangle, LineChart } from 'lucide-react';
import { fetchDashboardDecisions } from '@/lib/api';
import { PriceChart } from '@/components/PriceChart';
import { TradingViewChart } from '@/components/TradingViewChart';
import { useSymbolLevels } from '@/hooks/useSymbolLevels';

interface Decision {
  symbol: string;
  original_signal: string;
  original_confidence: number | null;
  risk_level: string | null;
  risk_score: number | null;
  atr_regime: string | null;
  adjusted_signal: string;
  adjusted_confidence: number | null;
  position_size_pct: number | null;
  reason: string;
  created_at: string;
  price_at_signal: number | null;
  volatility_pct: number | null;
}

function signalBadgeVariant(signal: string) {
  if (signal === 'BUY') return 'default';
  if (signal === 'SELL') return 'destructive';
  return 'secondary';
}

function signalIcon(signal: string) {
  if (signal === 'BUY') return <ArrowUpRight className="w-3.5 h-3.5" />;
  if (signal === 'SELL') return <ArrowDownRight className="w-3.5 h-3.5" />;
  return <Minus className="w-3.5 h-3.5" />;
}

// He thong hien tai chi thu thap du lieu Crypto qua Binance (symbol dang XXXUSDT/XXXBUSD).
// Neu sau nay them nguon Forex, symbol se co dinh dang khac (vi du EURUSD, khong co hau to USDT).
// Day la heuristic don gian de phan biet, khong phai du lieu that tu 2 nguon rieng.
function isCrypto(symbol: string) {
  return /USDT$|BUSD$|USDC$/i.test(symbol);
}

function OrderSuggestionContent({ d }: { d: Decision }) {
  const levels = useSymbolLevels(d.symbol, d.adjusted_signal, d.risk_level);

  if (!isCrypto(d.symbol)) {
    return (
      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-2 rounded-md border border-warning/40 bg-warning/10 px-3 py-2">
          <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <span>He thong hien chua ket noi du lieu gia Forex that. Duoi day chi la huong dan cach tu thiet lap lenh tren san Forex ban dung.</span>
        </div>
        <ol className="list-decimal list-inside space-y-1.5">
          <li>Mo san Forex/CFD ban dang dung, tim dung cap tien <strong>{d.symbol}</strong>.</li>
          <li>Chon huong lenh: <strong>{d.adjusted_signal === 'BUY' ? 'Buy (Long)' : d.adjusted_signal === 'SELL' ? 'Sell (Short)' : 'Chua vao lenh (HOLD)'}</strong>.</li>
          <li>Dat Stop Loss va Take Profit theo ty le rui ro ban chap nhan duoc (vi du 1:2 hoac 1:3), dua tren muc do rui ro AI danh gia: <strong>{d.risk_level || 'N/A'}</strong>.</li>
          <li>Kich thuoc lenh (lot size) nen giam neu risk_level la MEDIUM/HIGH - AI de xuat position size <strong>{d.position_size_pct ?? '-'}%</strong> so voi binh thuong.</li>
        </ol>
      </div>
    );
  }

  if (levels.loading) {
    return <div className="text-sm text-muted-foreground">Dang tai gia moi nhat va tinh ATR...</div>;
  }
  if (levels.error) {
    return <div className="text-sm text-destructive">{levels.error}</div>;
  }
  if (levels.side === 'HOLD') {
    return (
      <div className="text-sm text-muted-foreground">
        Tin hieu hien tai la <strong>HOLD</strong> hoac chua du du lieu ATR - chua co goi y dat lenh Futures.
      </div>
    );
  }

  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-start gap-2 rounded-md border border-warning/40 bg-warning/10 px-3 py-2">
        <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
        <span>Entry lay theo gia dong cua nen gan nhat (luon moi), TP/SL tinh theo ATR that cua coin.
        Day chi la goi y tham khao, khong phai khuyen nghi dau tu chuyen nghiep. Ban tu kiem tra va chiu trach nhiem truoc khi dat lenh that.</span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono">
        <span className="text-muted-foreground">Vi the</span>
        <span className="font-bold">{levels.side}</span>

        <span className="text-muted-foreground">Gia hien tai (Entry)</span>
        <span>{levels.entry?.toFixed(4)}</span>

        <span className="text-muted-foreground">ATR (14 nen)</span>
        <span>{levels.atr?.toFixed(4)}</span>

        <span className="text-muted-foreground">Don bay de xuat</span>
        <span>{levels.leverage}x ({d.risk_level || 'N/A'})</span>

        <span className="text-muted-foreground">Che do ky quy</span>
        <span>Isolated (khuyen nghi, gioi han lo toi da)</span>

        <span className="text-muted-foreground">Take Profit</span>
        <span className="text-success">{levels.tp?.toFixed(4)}</span>

        <span className="text-muted-foreground">Stop Loss</span>
        <span className="text-destructive">{levels.sl?.toFixed(4)}</span>

        <span className="text-muted-foreground">Uoc tinh gia thanh ly</span>
        <span className="text-destructive">
          {levels.entry && levels.leverage
            ? (levels.side === 'LONG'
                ? levels.entry * (1 - 1 / levels.leverage)
                : levels.entry * (1 + 1 / levels.leverage)
              ).toFixed(4)
            : '-'} (uoc luong, chua tinh phi duy tri)
        </span>

        <span className="text-muted-foreground">Position size de xuat</span>
        <span>{d.position_size_pct ?? '-'}% von thong thuong</span>
      </div>
    </div>
  );
}

function AIChartTab({ d }: { d: Decision }) {
  const levels = useSymbolLevels(d.symbol, d.adjusted_signal, d.risk_level);
  return (
    <PriceChart
      symbol={d.symbol}
      entry={levels.entry}
      tp={levels.tp}
      sl={levels.sl}
      className="h-full"
    />
  );
}

export default function Signals() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Decision | null>(null);
  const [orderTarget, setOrderTarget] = useState<Decision | null>(null);
  const [chartTarget, setChartTarget] = useState<Decision | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDashboardDecisions();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setDecisions(data.decisions || []);
    } catch (err) {
      setError('Khong ket noi duoc voi n8n webhook WF-080 (dashboard-decisions). Kiem tra workflow da Active va co du lieu trong risk_adjusted_decisions chua.');
      setDecisions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trading Signals</h1>
          <p className="text-muted-foreground mt-1">
            Tin hieu cuoi cung sau AI Debate (WF-023) + dieu chinh rui ro (WF-050/WF-060).
          </p>
        </div>
        <Button variant="outline" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card className="bg-card border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Symbol</TableHead>
              <TableHead>Tin hieu goc</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Tin hieu da dieu chinh</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Position Size</TableHead>
              <TableHead>Thoi gian</TableHead>
              <TableHead className="text-right">Hanh dong</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="font-mono text-sm">
            {decisions.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground/60">
                  Chua co du lieu. Kiem tra WF-000 da chay xong chu ky gan nhat chua.
                </TableCell>
              </TableRow>
            )}
            {decisions.map((d) => (
              <TableRow key={d.symbol} className="border-border/40 hover:bg-secondary/30">
                <TableCell
                  className="font-bold cursor-pointer hover:underline"
                  onClick={() => setSelected(d)}
                >
                  {d.symbol}
                </TableCell>
                <TableCell>
                  <Badge variant={signalBadgeVariant(d.original_signal) as any} className="gap-1">
                    {signalIcon(d.original_signal)} {d.original_signal}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={d.risk_level === 'HIGH' ? 'destructive' : d.risk_level === 'MEDIUM' ? 'secondary' : 'default'}>
                    {d.risk_level || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={signalBadgeVariant(d.adjusted_signal) as any} className="gap-1">
                    {signalIcon(d.adjusted_signal)} {d.adjusted_signal}
                  </Badge>
                </TableCell>
                <TableCell>{d.adjusted_confidence ?? '-'}</TableCell>
                <TableCell>{d.position_size_pct ?? '-'}%</TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {new Date(d.created_at).toLocaleString('vi-VN')}
                </TableCell>
                <TableCell className="text-right space-x-2 whitespace-nowrap">
                  <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => setChartTarget(d)}>
                    <LineChart className="w-3.5 h-3.5" /> Chart
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setOrderTarget(d)}>
                    <Target className="w-3.5 h-3.5" /> Dat lenh
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Modal chi tiet ly do */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.symbol}</DialogTitle>
            <DialogDescription>Chi tiet ly do dieu chinh rui ro</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-2 text-sm">
              <p><strong>Tin hieu goc:</strong> {selected.original_signal} (confidence: {selected.original_confidence ?? '-'})</p>
              <p><strong>Risk score:</strong> {selected.risk_score ?? '-'} ({selected.risk_level ?? 'N/A'})</p>
              <p><strong>ATR regime:</strong> {selected.atr_regime ?? '-'}</p>
              <p><strong>Ly do:</strong> {selected.reason}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal goi y dat lenh */}
      <Dialog open={!!orderTarget} onOpenChange={(open) => !open && setOrderTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Goi y dat lenh - {orderTarget?.symbol}</DialogTitle>
            <DialogDescription>
              {orderTarget && isCrypto(orderTarget.symbol) ? 'Thong so tham khao cho lenh Futures' : 'Huong dan thiet lap lenh Forex thu cong'}
            </DialogDescription>
          </DialogHeader>
          {orderTarget && <OrderSuggestionContent d={orderTarget} />}
        </DialogContent>
      </Dialog>

      {/* Modal chart hop nhat: Tab 1 = AI tu ve Entry/TP/SL/Ho tro-Khang cu, Tab 2 = TradingView that */}
      <Dialog open={!!chartTarget} onOpenChange={(open) => !open && setChartTarget(null)}>
        <DialogContent className="!max-w-[98vw] !w-[98vw] !h-[92vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{chartTarget?.symbol} - Chart</DialogTitle>
            <DialogDescription>
              Tab "AI" tu ve Entry/Take Profit/Stop Loss/Ho tro-Khang cu tu du lieu he thong.
              Tab "TradingView" la chart chuyen nghiep that tu Binance Futures.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="ai" className="flex-1 min-h-0 flex flex-col">
            <TabsList className="shrink-0 w-fit">
              <TabsTrigger value="ai">AI (Entry/TP/SL/Ho tro-Khang cu)</TabsTrigger>
              <TabsTrigger value="tradingview">TradingView</TabsTrigger>
            </TabsList>
            <TabsContent value="ai" className="flex-1 min-h-0">
              {chartTarget && <AIChartTab d={chartTarget} />}
            </TabsContent>
            <TabsContent value="tradingview" className="flex-1 min-h-0">
              {chartTarget && isCrypto(chartTarget.symbol) ? (
                <TradingViewChart symbol={chartTarget.symbol} className="h-full" />
              ) : (
                <div className="text-sm text-muted-foreground py-8 text-center">
                  Chua ho tro chart cho cap tien Forex nay.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
