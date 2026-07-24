import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function Admin() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Admin</h1>
        <p className="text-muted-foreground mt-1">Infrastructure and user management.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader><CardTitle>Docker Containers</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uptime</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">ai-hedge-frontend</TableCell>
                  <TableCell><Badge className="bg-success/20 text-success border-success/30">Running</Badge></TableCell>
                  <TableCell className="text-muted-foreground">12d 4h</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">ai-hedge-fastapi</TableCell>
                  <TableCell><Badge className="bg-success/20 text-success border-success/30">Running</Badge></TableCell>
                  <TableCell className="text-muted-foreground">12d 4h</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">postgres-db</TableCell>
                  <TableCell><Badge className="bg-success/20 text-success border-success/30">Running</Badge></TableCell>
                  <TableCell className="text-muted-foreground">45d 1h</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">ollama-gpu</TableCell>
                  <TableCell><Badge className="bg-success/20 text-success border-success/30">Running</Badge></TableCell>
                  <TableCell className="text-muted-foreground">12d 4h</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader><CardTitle>Recent Logs</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex gap-2 text-success"><span>[INFO]</span><span className="text-muted-foreground">10:42:01</span><span>FastAPI initialized on 0.0.0.0:8000</span></div>
              <div className="flex gap-2 text-success"><span>[INFO]</span><span className="text-muted-foreground">10:42:05</span><span>Connected to Postgresql</span></div>
              <div className="flex gap-2 text-success"><span>[INFO]</span><span className="text-muted-foreground">10:42:10</span><span>Ollama model llama3:8b loaded in 4.2s</span></div>
              <div className="flex gap-2 text-warning"><span>[WARN]</span><span className="text-muted-foreground">10:45:22</span><span>Binance API rate limit approaching (95%)</span></div>
              <div className="flex gap-2 text-danger"><span>[ERR]</span><span className="text-muted-foreground">11:02:14</span><span>Failed to fetch Reddit sentiment. Timeout.</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
