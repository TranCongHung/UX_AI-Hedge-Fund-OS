import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const allocationData = [
  { name: 'Bitcoin (BTC)', value: 45, color: '#f59e0b' },
  { name: 'Ethereum (ETH)', value: 25, color: '#4f46e5' },
  { name: 'Tech Stocks (QQQ)', value: 20, color: '#22c55e' },
  { name: 'Cash (USDC)', value: 10, color: '#a1a1aa' },
];

export default function Portfolio() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Management</h1>
        <p className="text-muted-foreground mt-1">Cross-asset holdings and risk metrics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Equity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$1,245,600.00</div>
            <p className="text-sm text-success mt-1">+14.2% YTD</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-sm text-muted-foreground mt-1">8 Long, 4 Short</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sharpe Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2.14</div>
            <p className="text-sm text-muted-foreground mt-1">Rolling 90-day</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111114', borderColor: '#222', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Active Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allocationData.map((asset) => (
                <div key={asset.name} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }}></div>
                    <span className="font-medium">{asset.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono">{asset.value}%</div>
                    <div className="text-xs text-muted-foreground">${(1245600 * (asset.value / 100)).toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
