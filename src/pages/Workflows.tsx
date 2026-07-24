import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Play, StopCircle, RefreshCw } from 'lucide-react';

export default function Workflows() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">n8n Workflows</h1>
        <p className="text-muted-foreground mt-1">Manage and monitor automated execution pipelines.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-success">24</div>
            <p className="text-sm text-muted-foreground mt-1">Running</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">1,248</div>
            <p className="text-sm text-muted-foreground mt-1">Success (24h)</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-danger">3</div>
            <p className="text-sm text-muted-foreground mt-1">Failed (24h)</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-sm text-muted-foreground mt-1">Avg Execution Time</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader><CardTitle>Active Pipelines</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'BTC Sentiment Scraper', status: 'Running', time: 'Every 5m', execs: 288 },
              { name: 'Portfolio Rebalance', status: 'Paused', time: 'Daily 00:00', execs: 1 },
              { name: 'Whale Alert Webhook', status: 'Running', time: 'On Event', execs: 142 },
            ].map((wf, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${wf.status === 'Running' ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{wf.name}</div>
                    <div className="text-sm text-muted-foreground">Trigger: {wf.time} • {wf.execs} Executions Today</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className={wf.status === 'Running' ? 'text-success border-success/30' : 'text-muted-foreground'}>
                    {wf.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
