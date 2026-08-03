import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  LineChart, 
  BarChart2, 
  Activity, 
  TrendingUp, 
  TestTube, 
  Briefcase, 
  Eye, 
  Newspaper, 
  Bot, 
  Workflow, 
  Database, 
  ScrollText, 
  Settings,
  ChevronLeft,
  Menu,
  Zap,
  Terminal,
  Cpu,
  Layers,
  ShieldCheck,
  Search,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Shell' },
  { name: 'Research', path: '/research', icon: Search, category: 'Shell' },
  { name: 'Markets', path: '/markets', icon: Activity, category: 'Shell' },
  { name: 'Portfolio', path: '/portfolio', icon: Layers, category: 'Shell' },
  { name: 'Backtesting', path: '/backtesting', icon: History, category: 'Shell' },
  { name: 'Watchlist', path: '/watchlist', icon: Eye, category: 'Shell' },
  { name: 'AI Research', path: '/chat', icon: MessageSquare, category: 'Intelligence' },
  { name: 'AI Agents', path: '/agents', icon: Bot, category: 'Infrastructure' },
  { name: 'Workflows', path: '/workflows', icon: Workflow, category: 'Infrastructure' },
  { name: 'Database', path: '/database', icon: Database, category: 'Infrastructure' },
  { name: 'Audit Logs', path: '/reports', icon: ScrollText, category: 'Infrastructure' },
  { name: 'System', path: '/settings', icon: Settings, category: 'Infrastructure' },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-border transition-all duration-200 ease-in-out shrink-0",
        sidebarOpen ? "w-60" : "w-14 hidden md:flex"
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 border-b border-border h-14 bg-background/50 backdrop-blur-md">
        <div className={cn("flex items-center gap-2.5 overflow-hidden transition-all duration-200", !sidebarOpen && "opacity-0 w-0")}>
          <div className="flex items-center justify-center w-7 h-7 rounded bg-primary shadow-[0_0_12px_rgba(37,99,235,0.3)] text-primary-foreground">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[11px] font-bold tracking-tight text-foreground uppercase">AI-Quant-OS</span>
            <span className="text-[9px] text-muted-foreground/60 font-mono mt-0.5">STAFF_SHELL_v4</span>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className={cn("h-8 w-8 hover:bg-accent/50", !sidebarOpen && "mx-auto")}
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 py-3 overflow-x-hidden">
        <nav className="flex flex-col gap-0.5 px-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const showCategory = sidebarOpen && (index === 0 || item.category !== navItems[index - 1].category);
            
            return (
              <React.Fragment key={item.name}>
                {showCategory && (
                  <div className="text-[10px] uppercase text-muted-foreground/40 font-bold px-3 py-2 mt-4 mb-1 first:mt-0 tracking-[0.1em]">
                    {item.category}
                  </div>
                )}
                <Tooltip>
                  <TooltipTrigger render={
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => cn(
                        "group flex items-center gap-3 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-150",
                        isActive 
                           ? "bg-primary/10 text-primary" 
                           : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        !sidebarOpen && "justify-center px-0"
                      )}
                    >
                      <item.icon className={cn(
                        "w-4 h-4 shrink-0 transition-colors",
                        isActive ? "text-primary" : "group-hover:text-foreground"
                      )} />
                      {sidebarOpen && <span className="truncate">{item.name}</span>}
                      {isActive && sidebarOpen && (
                        <div className="ml-auto w-1 h-1 rounded-full bg-primary" />
                      )}
                    </NavLink>
                  } />
                  {!sidebarOpen && (
                    <TooltipContent side="right" className="bg-popover border-border text-xs">
                      {item.name}
                    </TooltipContent>
                  )}
                </Tooltip>
              </React.Fragment>
            );
          })}
        </nav>
      </ScrollArea>

      {/* System Status Footer */}
      <div className="p-2 border-t border-border bg-accent/10">
        <div className={cn(
          "flex flex-col gap-2 rounded-lg p-2 transition-all",
          sidebarOpen ? "bg-background/40 border border-border/50" : "items-center"
        )}>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-success animate-ping opacity-20" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col leading-none">
                <span className="text-[10px] font-bold text-foreground">SYSTEM_READY</span>
                <span className="text-[9px] text-muted-foreground font-mono mt-0.5">Latency: 12ms</span>
              </div>
            )}
          </div>
          
          {sidebarOpen && (
            <div className="flex items-center gap-2 mt-1 pt-2 border-t border-border/30">
              <Cpu className="w-3 h-3 text-muted-foreground/50" />
              <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary/60 w-1/3" />
              </div>
              <span className="text-[8px] font-mono text-muted-foreground/60">32%</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
