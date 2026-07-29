import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon, Bell, Key, Shield, AlertTriangle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Settings() {
  const [n8nUrl, setN8nUrl] = useState('');
  const [testMode, setTestMode] = useState(false);
  const [maxDrawdown, setMaxDrawdown] = useState('10');
  const [maxPosition, setMaxPosition] = useState('5');
  
  useEffect(() => {
    setN8nUrl(localStorage.getItem('n8n_url') || 'http://localhost:5678');
    setTestMode(localStorage.getItem('n8n_test_mode') === 'true');
  }, []);

  const handleSaveUrl = () => {
    localStorage.setItem('n8n_url', n8nUrl);
    localStorage.setItem('n8n_test_mode', testMode.toString());
    alert('API Settings saved! Please refresh the page or navigate to Dashboard to see changes.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
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
          <Card className="bg-card border-border border-primary/50 shadow-md">
            <CardHeader><CardTitle>n8n API Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              
              <div className="p-4 bg-warning/10 text-warning border border-warning/20 rounded-lg flex gap-3 text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="font-bold">Important: Mixed Content & CORS</p>
                  <p>Because this web app runs on <strong>HTTPS</strong>, your browser will block requests to <code>http://localhost:5678</code>.</p>
                  <p><strong>Solution:</strong> Expose your local n8n via a secure tunnel like <strong>ngrok</strong>:</p>
                  <code className="block bg-background p-2 rounded border border-border">ngrok http 5678</code>
                  <p>Then paste the <code>https://...ngrok-free.app</code> URL below.</p>
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">n8n Base URL</label>
                <div className="flex gap-2">
                  <Input 
                    value={n8nUrl} 
                    onChange={(e) => setN8nUrl(e.target.value)} 
                    className="bg-background border-border" 
                    placeholder="https://your-app.ngrok-free.app" 
                  />
                  <Button onClick={handleSaveUrl}>Save</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                <div>
                  <div className="font-medium">Use Test Webhooks (/webhook-test)</div>
                  <div className="text-sm text-muted-foreground">
                    Enable this if your workflows are not active and you are clicking "Execute Workflow" manually in n8n.
                  </div>
                </div>
                <Switch checked={testMode} onCheckedChange={setTestMode} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader><CardTitle>Trading Risk Parameters</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Max Drawdown Limit (%)</label>
                <Input value={maxDrawdown} onChange={e => setMaxDrawdown(e.target.value)} className="bg-background border-border max-w-[200px]" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Max Position Size (%)</label>
                <Input value={maxPosition} onChange={e => setMaxPosition(e.target.value)} className="bg-background border-border max-w-[200px]" />
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  );
}
