import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowUpRight, ArrowDownRight, Minus, RefreshCw } from 'lucide-react';
import { API, Signal } from '@/lib/api';

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'vua xong';
  if (mins < 60) return `${mins} phut truoc`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} gio truoc`;
  return `${Math.floor(hours / 24)} ngay truoc`;
}

function signalBadgeClass(signal: string) {
  if (signal === 'BUY') return 'text-success border-success/30 bg-success/10';
  if (signal === 'SELL') return 'text-danger border-danger/30 bg-danger/10';
  return 'text-muted-foreground border-border bg-secondary/50';
}

export default function Signals() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);

  async function fetchSignals() {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API.dashboardSignals, { timeout: 15000 });
      setSignals(res.data?.signals || []);
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.message : 'Loi khong xac dinh');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSignals();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tin hieu giao dich</h1>
          <p className="text-muted-foreground mt-1">Tin hieu AI moi nhat cho tung coin trong watchlist.</p>
        </div>
        <Button variant="outline" onClick={fetchSignals} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Lam moi
        </Button>
      </div>

      {error && (
        <Card className="bg-danger/10 border-danger/30">
          <CardContent className="p-4 text-sm text-danger">
            Khong the tai du lieu: {error}. Kiem tra n8n workflow WF-080 da Active chua.
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border-border overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Symbol</TableHead>
              <TableHead>Gia luc phan tich</TableHead>
              <TableHead>Tin hieu</TableHead>
              <TableHead className="hidden md:table-cell">Ly do</TableHead>
              <TableHead className="text-right">Thoi gian</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {signals.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Chua co tin hieu nao. Chay WF-020 trong n8n truoc.
                </TableCell>
              </TableRow>
            )}
            {signals.map((s) => (
              <TableRow
                key={s.symbol}
                className="border-border cursor-pointer hover:bg-secondary/40 transition-colors"
                onClick={() => setSelectedSignal(s)}
              >
                <TableCell className="font-medium">{s.symbol}</TableCell>
                <TableCell className="font-mono">{s.price_at_signal ?? '-'}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={signalBadgeClass(s.signal)}>
                    {s.signal === 'BUY' && <ArrowUpRight className="w-3 h-3 mr-1" />}
                    {s.signal === 'SELL' && <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {s.signal === 'HOLD' && <Minus className="w-3 h-3 mr-1" />}
                    {s.signal}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[300px] truncate">
                  {s.reason}
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {timeAgo(s.created_at)}
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
              <Badge variant="outline" className={selectedSignal ? signalBadgeClass(selectedSignal.signal) : ''}>
                {selectedSignal?.signal}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Phan tich {selectedSignal ? timeAgo(selectedSignal.created_at) : ''} boi WF-020 (Groq API)
            </DialogDescription>
          </DialogHeader>

          {selectedSignal && (
            <div className="grid gap-6 py-4">
              <Card className="bg-background border-border/50 p-3">
                <div className="text-xs text-muted-foreground mb-1">Gia tai thoi diem phan tich</div>
                <div className="font-mono text-lg">{selectedSignal.price_at_signal ?? 'khong ro'}</div>
              </Card>

              <div>
                <h4 className="text-sm font-semibold mb-2">Ly do cua AI</h4>
                <div className="p-4 bg-secondary/50 rounded-lg text-sm text-muted-foreground leading-relaxed">
                  {selectedSignal.reason}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
