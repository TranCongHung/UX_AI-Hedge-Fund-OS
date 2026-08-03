import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database as DbIcon, Search, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Database() {
  const tableData = [
    { id: 'TRD-1029', time: '2026-07-29 10:32:00', pair: 'BTC/USDT', side: 'BUY', size: '0.15', price: '64,230.00', pnl: '-' },
    { id: 'TRD-1028', time: '2026-07-29 08:15:22', pair: 'ETH/USDT', side: 'SELL', size: '2.50', price: '3,450.20', pnl: '+$145.20' },
    { id: 'TRD-1027', time: '2026-07-28 22:10:05', pair: 'SOL/USDT', side: 'BUY', size: '50.0', price: '142.10', pnl: '-' },
    { id: 'TRD-1026', time: '2026-07-28 14:05:55', pair: 'BTC/USDT', side: 'SELL', size: '0.20', price: '63,100.50', pnl: '-$45.00' },
    { id: 'TRD-1025', time: '2026-07-27 09:30:00', pair: 'AAPL', side: 'BUY', size: '100', price: '215.30', pnl: '-' },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PostgreSQL Data Viewer</h1>
          <p className="text-muted-foreground mt-1">Direct read-only access to the trade log tables.</p>
        </div>
        <Button variant="outline" className="gap-2"><Download className="w-4 h-4" /> Export CSV</Button>
      </div>

      <Card className="bg-card border-border overflow-hidden">
        <CardHeader className="bg-secondary/30 border-b border-border flex flex-row items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <DbIcon className="w-5 h-5 text-primary" />
            <CardTitle className="text-base font-semibold">Table: public.trade_history</CardTitle>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search records..." className="h-8 pl-8 text-sm bg-background border-border w-[200px]" />
            </div>
            <Button variant="secondary" size="sm" className="h-8 gap-2"><Filter className="w-3 h-3" /> Filter</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-secondary/10 border-b border-border">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Timestamp</th>
                  <th className="px-4 py-3 font-medium">Asset</th>
                  <th className="px-4 py-3 font-medium">Side</th>
                  <th className="px-4 py-3 font-medium">Size</th>
                  <th className="px-4 py-3 font-medium">Exec. Price</th>
                  <th className="px-4 py-3 font-medium">Realized PnL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {tableData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-muted-foreground">{row.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{row.time}</td>
                    <td className="px-4 py-3 font-semibold">{row.pair}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${row.side === 'BUY' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                        {row.side}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono">{row.size}</td>
                    <td className="px-4 py-3 font-mono">${row.price}</td>
                    <td className={`px-4 py-3 font-bold ${row.pnl.startsWith('+') ? 'text-success' : row.pnl.startsWith('-') && row.pnl.length > 1 ? 'text-danger' : 'text-muted-foreground'}`}>
                      {row.pnl}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-border bg-secondary/10 text-xs text-muted-foreground flex justify-between items-center">
            <span>Showing 1 to 5 of 1,204 entries</span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="h-6 text-xs px-2" disabled>Prev</Button>
              <Button variant="outline" size="sm" className="h-6 text-xs px-2">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
