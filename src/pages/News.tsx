import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

export default function News() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Market Intelligence</h1>
        <p className="text-muted-foreground mt-1">AI summarized news and economic events.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Bot className="w-5 h-5" />
                AI Daily Briefing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm leading-relaxed text-foreground/90 space-y-4">
                <p><strong>Macro:</strong> Markets are pricing in a 75% probability of a rate cut at the next FOMC meeting following softer-than-expected CPI data (3.1% vs 3.2% est). Treasury yields have compressed across the curve.</p>
                <p><strong>Crypto:</strong> Bitcoin continues to consolidate above $60k. Institutional flow remains net positive despite GBTC outflows. Altcoins are showing relative weakness, indicating risk-off behavior within the digital asset space.</p>
                <p><strong>Equities:</strong> Tech sector rotation continues as capital moves towards small caps (IWM) on rate cut hopes. NVDA earnings next week remain the key catalyst for the broader market.</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xl font-bold">Latest Headlines</h3>
            {[
              { source: 'Bloomberg', time: '10 mins ago', title: 'Fed Chair Signals Potential Policy Shift in Late Q3', impact: 'High', type: 'Macro' },
              { source: 'CoinDesk', time: '1 hour ago', title: 'Ethereum Spot ETF Approvals Could Come Earlier Than Expected', impact: 'Medium', type: 'Crypto' },
              { source: 'Reuters', time: '3 hours ago', title: 'Oil Prices Surge on Geopolitical Tensions in Middle East', impact: 'High', type: 'Commodities' },
              { source: 'WSJ', time: '5 hours ago', title: 'Tech Giants Face New Regulatory Scrutiny in EU', impact: 'Low', type: 'Tech' },
            ].map((news, i) => (
              <Card key={i} className="bg-card border-border hover:bg-secondary/20 transition-colors cursor-pointer">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-primary">{news.source}</span>
                      <span className="text-xs text-muted-foreground">• {news.time}</span>
                      <Badge variant="outline" className="text-[10px] h-4 px-1 ml-2">{news.type}</Badge>
                    </div>
                    <h4 className="text-base font-medium">{news.title}</h4>
                  </div>
                  <div className="shrink-0 flex sm:flex-col items-center gap-2 sm:items-end">
                    <span className="text-xs text-muted-foreground">Impact</span>
                    <Badge variant="outline" className={news.impact === 'High' ? 'text-danger border-danger/30' : news.impact === 'Medium' ? 'text-warning border-warning/30' : 'text-muted-foreground border-muted-foreground/30'}>
                      {news.impact}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                Economic Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col">
                {[
                  { time: '08:30 AM', event: 'Core CPI (MoM)', act: '0.2%', est: '0.3%', prev: '0.3%', impact: 'high' },
                  { time: '08:30 AM', event: 'Initial Jobless Claims', act: '210k', est: '215k', prev: '212k', impact: 'medium' },
                  { time: '10:00 AM', event: 'Fed Chair Powell Speaks', act: '-', est: '-', prev: '-', impact: 'high' },
                  { time: 'Tomorrow', event: 'Retail Sales (MoM)', act: '-', est: '0.4%', prev: '0.6%', impact: 'medium' },
                ].map((ev, i) => (
                  <div key={i} className="p-4 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-muted-foreground">{ev.time}</span>
                      {ev.impact === 'high' && <AlertTriangle className="w-3 h-3 text-danger" />}
                    </div>
                    <div className="text-sm font-semibold mb-2">{ev.event}</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div><span className="text-muted-foreground">Act:</span> {ev.act}</div>
                      <div><span className="text-muted-foreground">Est:</span> {ev.est}</div>
                      <div><span className="text-muted-foreground">Prev:</span> {ev.prev}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
