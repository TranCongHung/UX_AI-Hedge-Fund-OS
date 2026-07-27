import { Bell, Search, Menu, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store';
import { useLocation } from 'react-router-dom';

export default function TopNav() {
  const { toggleSidebar, toggleRightPanel, rightPanelOpen } = useAppStore();
  const location = useLocation();
  
  // Format the current path to display as title
  const getTitle = () => {
    const path = location.pathname.split('/')[1];
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
  };

  return (
    <header className="h-[60px] border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-4 lg:gap-8">
        <Button variant="ghost" size="icon" className="md:hidden shrink-0" onClick={toggleSidebar}>
          <Menu className="w-5 h-5" />
        </Button>
        <h2 className="text-lg font-semibold tracking-tight hidden sm:block text-foreground">{getTitle()}</h2>
        
        <div className="hidden lg:flex items-center gap-6 border-l border-border pl-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">BTC/USD</span>
            <span className="text-sm font-mono">$67,432.12</span>
            <span className="text-xs text-emerald-500 font-medium">+2.41%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ETH/USD</span>
            <span className="text-sm font-mono">$3,481.05</span>
            <span className="text-xs text-rose-500 font-medium">-0.84%</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 text-xs">
        <div className="hidden sm:flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-full border border-border">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-muted-foreground font-medium">Llama-3-70b</span>
        </div>
        
        <Button 
          variant={rightPanelOpen ? "secondary" : "ghost"} 
          size="sm" 
          className="gap-2 hidden md:flex rounded-full border border-transparent hover:border-border"
          onClick={toggleRightPanel}
        >
          <BrainCircuit className="w-4 h-4 text-primary" />
          <span>Copilot</span>
        </Button>
        
        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-xs font-bold border border-border shrink-0 ml-2">
          CH
        </div>
      </div>
    </header>
  );
}
