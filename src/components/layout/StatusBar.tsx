import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';
import { Activity, Database, Workflow, CheckCircle2 } from 'lucide-react';

export default function StatusBar() {
  const { sidebarOpen, rightPanelOpen } = useAppStore();

  return (
    <div 
      className={cn(
        "fixed bottom-0 z-40 h-8 bg-background border-t border-border flex items-center justify-between px-4 text-[10px] uppercase tracking-wider text-muted-foreground transition-all duration-300 ease-in-out font-medium",
        sidebarOpen ? "left-56" : "left-16",
        rightPanelOpen ? "right-80" : "right-0"
      )}
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>PostgreSQL connected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>n8n Online</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Ollama API Active</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Workflow className="w-3 h-3 text-emerald-500" />
          <span>3 Workflows Running</span>
        </div>
        <div className="flex items-center gap-2">
          <Database className="w-3 h-3 text-emerald-500" />
          <span>Latency: 12ms</span>
        </div>
        <div className="flex items-center gap-2 text-foreground/50">
          v2.0.0-beta
        </div>
      </div>
    </div>
  );
}
