import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Calendar, Mail, FileLineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Reports() {
  const reports = [
    { title: 'Weekly Alpha Summary - Week 30', date: 'Jul 28, 2026', type: 'PDF', size: '2.4 MB' },
    { title: 'Monthly Risk Assessment - June', date: 'Jul 01, 2026', type: 'PDF', size: '5.1 MB' },
    { title: 'Daily Trading Ledger', date: 'Jul 29, 2026', type: 'CSV', size: '145 KB' },
    { title: 'Q2 Algorithmic Strategy Review', date: 'Jul 15, 2026', type: 'PDF', size: '8.2 MB' },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Exports</h1>
          <p className="text-muted-foreground mt-1">Generated documents and historical summaries.</p>
        </div>
        <Button className="gap-2"><FileLineChart className="w-4 h-4" /> Generate New Report</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reports.map((report, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{report.title}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {report.date}</span>
                      <span>• {report.type}</span>
                      <span>• {report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" title="Email"><Mail className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" title="Download"><Download className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Automated Reporting Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border-b border-border">
                <div>
                  <div className="font-semibold">Daily PnL Summary</div>
                  <div className="text-sm text-muted-foreground">Emailed every day at 23:59 UTC</div>
                </div>
                <div className="text-success text-sm font-bold bg-success/20 px-2 py-1 rounded">Active</div>
              </div>
              <div className="flex justify-between items-center p-3 border-b border-border">
                <div>
                  <div className="font-semibold">Weekly Risk Metrics</div>
                  <div className="text-sm text-muted-foreground">Saved to Drive every Sunday</div>
                </div>
                <div className="text-success text-sm font-bold bg-success/20 px-2 py-1 rounded">Active</div>
              </div>
              <div className="flex justify-between items-center p-3">
                <div>
                  <div className="font-semibold">Monthly Tax Ledger</div>
                  <div className="text-sm text-muted-foreground">Emailed on the 1st of every month</div>
                </div>
                <div className="text-muted-foreground text-sm font-bold bg-secondary px-2 py-1 rounded">Paused</div>
              </div>
            </div>
            <Button variant="outline" className="w-full">Manage Schedules in n8n</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
