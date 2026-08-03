import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Activity, Settings, Database, BrainCircuit, ShieldAlert, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AIAgents() {
  const agents = [
    {
      name: 'Alpha Quant',
      role: 'Macro Strategy & Sentiment',
      model: 'GPT-4o',
      status: 'Active',
      lastActive: '2 mins ago',
      icon: <BrainCircuit className="w-6 h-6 text-primary" />,
      tasks: ['Scrape Twitter API', 'Analyze FOMC Notes', 'Emit Buy/Sell Signals'],
    },
    {
      name: 'Risk Guardian',
      role: 'Portfolio Risk Manager',
      model: 'Claude 3.5 Sonnet',
      status: 'Active',
      lastActive: 'Just now',
      icon: <ShieldAlert className="w-6 h-6 text-success" />,
      tasks: ['Monitor Drawdown', 'Adjust Position Sizing', 'Trigger Stop Losses'],
    },
    {
      name: 'Data Harvester',
      role: 'On-chain & Price Data',
      model: 'Llama 3 (Local)',
      status: 'Idle',
      lastActive: '1 hour ago',
      icon: <Database className="w-6 h-6 text-muted-foreground" />,
      tasks: ['Fetch Binance Candles', 'Index Dune Analytics', 'Store to PostgreSQL'],
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Agent Fleet</h1>
          <p className="text-muted-foreground mt-1">Manage autonomous agents and their active parameters.</p>
        </div>
        <Button className="gap-2"><Bot className="w-4 h-4" /> Deploy New Agent</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent, idx) => (
          <Card key={idx} className="bg-card border-border hover:border-primary/50 transition-all flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center border border-border">
                {agent.icon}
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <div className="text-sm text-muted-foreground">{agent.role}</div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between pt-4">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Model Core</span>
                  <span className="font-semibold">{agent.model}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className={`flex items-center gap-1 font-semibold ${agent.status === 'Active' ? 'text-success' : 'text-muted-foreground'}`}>
                    {agent.status === 'Active' ? <Activity className="w-3 h-3 animate-pulse" /> : null}
                    {agent.status}
                  </span>
                </div>
                <div className="space-y-2 mt-4">
                  <div className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Key Tasks</div>
                  <ul className="text-sm space-y-1">
                    {agent.tasks.map((task, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <BadgeCheck className="w-3 h-3 text-primary" /> {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Last Ping: {agent.lastActive}</span>
                <Button variant="ghost" size="icon"><Settings className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
