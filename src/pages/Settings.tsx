import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon, Bell, Key, Shield } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Settings() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage platform configuration and preferences.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="flex flex-col gap-2">
          <Button variant="ghost" className="justify-start bg-secondary/50"><SettingsIcon className="w-4 h-4 mr-2"/> General</Button>
          <Button variant="ghost" className="justify-start text-muted-foreground"><Key className="w-4 h-4 mr-2"/> API Keys</Button>
          <Button variant="ghost" className="justify-start text-muted-foreground"><Bell className="w-4 h-4 mr-2"/> Notifications</Button>
          <Button variant="ghost" className="justify-start text-muted-foreground"><Shield className="w-4 h-4 mr-2"/> Security</Button>
        </div>

        <div className="md:col-span-3 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle>Trading Risk Parameters</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Max Drawdown Limit (%)</label>
                <Input defaultValue="10" className="bg-background border-border max-w-[200px]" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Max Position Size (%)</label>
                <Input defaultValue="5" className="bg-background border-border max-w-[200px]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader><CardTitle>Model Priority</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                <div>
                  <div className="font-medium">Local First (Ollama)</div>
                  <div className="text-sm text-muted-foreground">Always try local models before cloud APIs to save cost.</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                <div>
                  <div className="font-medium">Auto-Failover</div>
                  <div className="text-sm text-muted-foreground">Switch to GPT-4o if local model context limit is exceeded.</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
