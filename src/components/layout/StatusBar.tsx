import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';
import { Activity, Database, Workflow, CheckCircle2 } from 'lucide-react';

export default function StatusBar() {
  const { sidebarOpen, rightPanelOpen } = useAppStore();

  return (
    <div 
      className={cn(
        "fixed bottom-0 z-40 h-7 bg-background/80 backdrop-blur-md border-t border-border flex items-center justify-between px-4 text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60 transition-all duration-200 ease-in-out font-mono font-bold",
        sidebarOpen ? "left-60" : "left-14",
        rightPanelOpen ? "right-80" : "right-0"
      )}
    >
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-success shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
          <span>DB_CLUSTER: STABLE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-success shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
          <span>FLOW_ENGINE: ONLINE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full bg-success shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
          <span>INFERENCE_POOL: ACTIVE</span>
        </div>
      </div>
      
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5">
          <Workflow className="w-2.5 h-2.5 text-primary opacity-60" />
          <span>ACT_THREADS: 3</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Activity className="w-2.5 h-2.5 text-primary opacity-60" />
          <span>TPS_AVG: 142</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground/40 font-normal">
          BUILD_HASH: 7F2A9
        </div>
      </div>
    </div>
  );
}
