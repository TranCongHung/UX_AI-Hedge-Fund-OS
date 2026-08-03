import React from 'react';
import { Bell, Search, Menu, BrainCircuit, Zap, Terminal, Activity, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function TopNav() {
  const { toggleSidebar, toggleRightPanel, rightPanelOpen } = useAppStore();
  const location = useLocation();
  
  const getBreadcrumbs = () => {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.map((part, i) => ({
      name: part.charAt(0).toUpperCase() + part.slice(1).replace('-', ' '),
      path: '/' + parts.slice(0, i + 1).join('/')
    }));
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-14 border-b border-border bg-background/50 backdrop-blur-xl flex items-center justify-between px-4 lg:px-6 shrink-0 sticky top-0 z-40">
      <div className="flex items-center gap-4 lg:gap-6">
        <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={toggleSidebar}>
          <Menu className="w-4 h-4" />
        </Button>
        
        {/* Professional Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">OS</Link>
          {breadcrumbs.map((bc, i) => (
            <React.Fragment key={bc.path}>
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              <Link 
                to={bc.path} 
                className={cn(
                  "hover:text-foreground transition-colors",
                  i === breadcrumbs.length - 1 ? "text-foreground font-bold" : ""
                )}
              >
                {bc.name}
              </Link>
            </React.Fragment>
          ))}
        </nav>
        
        {/* Live Tickers */}
        <div className="hidden xl:flex items-center gap-5 border-l border-border pl-6 ml-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider font-mono">BTC</span>
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-sm font-bold">$67,432</span>
              <span className="text-[10px] text-success font-bold">+2.4%</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider font-mono">NVDA</span>
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-sm font-bold">$128.45</span>
              <span className="text-[10px] text-success font-bold">+3.1%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Model Status */}
        <div className="hidden md:flex items-center gap-2.5 px-2.5 py-1 rounded-md bg-secondary/40 border border-border/50">
          <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(37,99,235,0.4)] animate-pulse" />
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Model</span>
            <span className="text-[11px] font-bold text-foreground font-mono">GPT-4o-RESEARCH</span>
          </div>
        </div>

        <div className="h-6 w-px bg-border mx-1" />
        
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "h-8 px-2.5 gap-2 transition-all rounded-md text-xs font-bold",
            rightPanelOpen ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
          )}
          onClick={toggleRightPanel}
        >
          <BrainCircuit className="w-4 h-4" />
          <span className="hidden lg:inline uppercase tracking-tight">Copilot</span>
        </Button>
        
        <div className="h-8 w-8 bg-gradient-to-br from-primary to-indigo-600 rounded flex items-center justify-center text-[11px] font-bold text-white border border-border shadow-sm cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
          CH
        </div>
      </div>
    </header>
  );
}
