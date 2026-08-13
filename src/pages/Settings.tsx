import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon, Bell, Key, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchUserSettings, saveUserSettings } from '@/lib/api';

export default function Settings() {
  const [n8nUrl, setN8nUrl] = useState('');
  const [testMode, setTestMode] = useState(false);
  const [totalCapital, setTotalCapital] = useState('1000');
  const [riskPctPerTrade, setRiskPctPerTrade] = useState('2');
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  useEffect(() => {
    setN8nUrl(localStorage.getItem('n8n_url') || 'http://localhost:5678');
    setTestMode(localStorage.getItem('n8n_test_mode') === 'true');
  }, []);

  useEffect(() => {
    const loadSettings = async () => {
      setSettingsLoading(true);
      setSettingsError(null);
      try {
        const res = await fetchUserSettings();
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.total_capital !== undefined) setTotalCapital(String(data.total_capital));
        if (data.risk_pct_per_trade !== undefined) setRiskPctPerTrade(String(data.risk_pct_per_trade));
      } catch (err) {
        setSettingsError('Khong tai duoc ke hoach von. Kiem tra webhook settings-get da Active chua.');
      } finally {
        setSettingsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSaveUrl = () => {
    localStorage.setItem('n8n_url', n8nUrl);
    localStorage.setItem('n8n_test_mode', testMode.toString());
    alert('API Settings saved! Please refresh the page or navigate to Dashboard to see changes.');
  };

  const handleSaveCapitalPlan = async () => {
    setSettingsSaved(false);
    setSettingsError(null);
    const capital = parseFloat(totalCapital);
    const riskPct = parseFloat(riskPctPerTrade);
    if (!Number.isFinite(capital) || capital <= 0) {
      setSettingsError('Tong von phai la so duong.');
      return;
    }
    if (!Number.isFinite(riskPct) || riskPct <= 0 || riskPct > 100) {
      setSettingsError('Rui ro moi lenh phai trong khoang 0-100%.');
      return;
    }
    try {
      const res = await saveUserSettings(capital, riskPct);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (err) {
      setSettingsError('Luu that bai. Kiem tra webhook settings-save da Active chua.');
    }
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
                <div className="space-y-3">
                  <p className="font-bold">n8n Connection Notes</p>
                  
                  <div>
                    <p className="font-semibold text-foreground">1. Running locally? (http://localhost:3000)</p>
                    <p className="text-muted-foreground mt-1">If you run this app locally, you can simply use <code>http://localhost:5678</code> below. Make sure to enable CORS in n8n by setting the environment variables: <code>N8N_CORS_ERROR_CHECK_ENABLED=false</code> (or configure specific allowed origins).</p>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-foreground">2. Running on AI Studio? (HTTPS)</p>
                    <p className="text-muted-foreground mt-1">Because AI Studio runs on HTTPS, your browser will block requests to local HTTP (Mixed Content). <strong>Solution:</strong> Expose your local n8n via a secure tunnel like <strong>ngrok</strong>:</p>
                    <code className="block bg-background p-2 rounded border border-border mt-1">ngrok http 5678</code>
                    <p className="text-muted-foreground mt-1">Then paste the <code>https://...ngrok-free.app</code> URL below.</p>
                  </div>
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
            <CardHeader><CardTitle>Ke Hoach Von</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Nhap tong von va % rui ro chap nhan moi lenh. He thong dung so nay de tinh Max Drawdown
                chinh xac trong WF-035 (thay vi gia dinh 100% von/lenh nhu truoc) va de goi y position size
                thuc te khi dat lenh.
              </p>

              {settingsError && (
                <div className="flex items-center gap-2 text-sm text-destructive rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> {settingsError}
                </div>
              )}
              {settingsSaved && (
                <div className="flex items-center gap-2 text-sm text-success rounded-md border border-success/40 bg-success/10 px-3 py-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Da luu ke hoach von.
                </div>
              )}

              <div className="grid gap-2">
                <label className="text-sm font-medium">Tong von (USDT)</label>
                <Input
                  type="number"
                  value={totalCapital}
                  onChange={e => setTotalCapital(e.target.value)}
                  className="bg-background border-border max-w-[200px]"
                  disabled={settingsLoading}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Rui ro moi lenh (%)</label>
                <Input
                  type="number"
                  value={riskPctPerTrade}
                  onChange={e => setRiskPctPerTrade(e.target.value)}
                  className="bg-background border-border max-w-[200px]"
                  disabled={settingsLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Vi du: von 1000 USDT, rui ro 2%/lenh = toi da 20 USDT co the mat moi lenh neu dung SL.
                </p>
              </div>
              <Button onClick={handleSaveCapitalPlan} disabled={settingsLoading}>Luu Ke Hoach Von</Button>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  );
}
