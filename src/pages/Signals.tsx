import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowUpRight, ArrowDownRight, Minus, RefreshCw, Target, AlertTriangle } from 'lucide-react';
import { fetchDashboardDecisions } from '@/lib/api';

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

// Goi y don gian dua tren risk_level - KHONG PHAI khuyen nghi dau tu chuyen nghiep.
function suggestLeverage(riskLevel: string | null) {
  if (riskLevel === 'HIGH') return 2;
  if (riskLevel === 'MEDIUM') return 5;
  return 10; // LOW hoac khong ro
}

function computeFuturesSuggestion(d: Decision) {
  const price = d.price_at_signal !== null && d.price_at_signal !== undefined
    ? parseFloat(String(d.price_at_signal))
    : null;
  const validPrice = price !== null && Number.isFinite(price) ? price : null;
  const leverage = suggestLeverage(d.risk_level);
  const isLong = d.adjusted_signal === 'BUY';
  const isShort = d.adjusted_signal === 'SELL';

  if (!validPrice || (!isLong && !isShort)) {
    return { side: 'HOLD' as const, leverage, price: validPrice, tp: null, sl: null, liq: null };
  }

  // Bien do TP/SL co dinh theo risk level - vi du minh hoa, KHONG phai toi uu hoa that.
  const tpPct = d.risk_level === 'HIGH' ? 0.015 : d.risk_level === 'MEDIUM' ? 0.02 : 0.03;
  const slPct = d.risk_level === 'HIGH' ? 0.01 : d.risk_level === 'MEDIUM' ? 0.015 : 0.02;

  const tp = isLong ? validPrice * (1 + tpPct) : validPrice * (1 - tpPct);
  const sl = isLong ? validPrice * (1 - slPct) : validPrice * (1 + slPct);
  // Uoc luong don gian, BO QUA maintenance margin rate thuc te cua san - chi mang tinh tham khao.
  const liq = isLong ? validPrice * (1 - 1 / leverage) : validPrice * (1 + 1 / leverage);

  return { side: isLong ? 'LONG' : 'SHORT', leverage, price: validPrice, tp, sl, liq };
}

function OrderSuggestionContent({ d }: { d: Decision }) {
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

  const s = computeFuturesSuggestion(d);

  if (s.side === 'HOLD') {
    return (
      <div className="text-sm text-muted-foreground">
        Tin hieu hien tai la <strong>HOLD</strong> hoac thieu du lieu gia - chua co goi y dat lenh Futures.
      </div>
    );
  }

  return (
    <div className="space-y-3 text-sm">
      <div className="flex items-start gap-2 rounded-md border border-warning/40 bg-warning/10 px-3 py-2">
        <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
        <span>Day chi la goi y tinh toan don gian theo cong thuc %, khong phai khuyen nghi dau tu chuyen nghiep. Ban tu kiem tra va chiu trach nhiem truoc khi dat lenh that.</span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono">
        <span className="text-muted-foreground">Vi the</span>
        <span className="font-bold">{s.side}</span>

        <span className="text-muted-foreground">Gia tham chieu</span>
        <span>{s.price?.toFixed(4)}</span>

        <span className="text-muted-foreground">Don bay de xuat</span>
        <span>{s.leverage}x ({d.risk_level || 'N/A'})</span>

        <span className="text-muted-foreground">Che do ky quy</span>
        <span>Isolated (khuyen nghi, gioi han lo toi da)</span>

        <span className="text-muted-foreground">Take Profit</span>
        <span className="text-success">{s.tp?.toFixed(4)}</span>

        <span className="text-muted-foreground">Stop Loss</span>
        <span className="text-destructive">{s.sl?.toFixed(4)}</span>

        <span className="text-muted-foreground">Uoc tinh gia thanh ly</span>
        <span className="text-destructive">{s.liq?.toFixed(4)} (uoc luong, chua tinh phi duy tri)</span>

        <span className="text-muted-foreground">Position size de xuat</span>
        <span>{d.position_size_pct ?? '-'}% von thong thuong</span>
      </div>
    </div>
  );
}

export default function Signals() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Decision | null>(null);
  const [orderTarget, setOrderTarget] = useState<Decision | null>(null);

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
                <TableCell className="font-bold cursor-pointer" onClick={() => setSelected(d)}>{d.symbol}</TableCell>
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
                <TableCell className="text-right">
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
    </div>
  );
}
