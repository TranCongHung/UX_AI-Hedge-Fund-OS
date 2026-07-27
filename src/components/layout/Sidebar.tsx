import React from 'react';
import { NavLink } from 'react-router-dom';
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
  TerminalSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Platform' },
  { name: 'Research', path: '/research', icon: LineChart, category: 'Platform' },
  { name: 'Markets', path: '/markets', icon: BarChart2, category: 'Platform' },
  { name: 'Portfolio', path: '/portfolio', icon: Briefcase, category: 'Platform' },
  { name: 'Backtesting', path: '/backtesting', icon: TestTube, category: 'Platform' },
  { name: 'Watchlist', path: '/watchlist', icon: Eye, category: 'Platform' },
  { name: 'AI Chat', path: '/chat', icon: MessageSquare, category: 'Platform' },
  { name: 'AI Agents', path: '/agents', icon: Bot, category: 'Infrastructure' },
  { name: 'Workflow Monitor', path: '/workflows', icon: Workflow, category: 'Infrastructure' },
  { name: 'Database', path: '/database', icon: Database, category: 'Infrastructure' },
  { name: 'Reports', path: '/reports', icon: ScrollText, category: 'Infrastructure' },
  { name: 'Settings', path: '/settings', icon: Settings, category: 'Infrastructure' },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-background border-r border-border transition-all duration-300 ease-in-out shrink-0",
        sidebarOpen ? "w-56" : "w-16 hidden md:flex"
      )}
    >
      <div className="flex items-center justify-between p-5 border-b border-border h-[73px]">
        <div className={cn("flex items-center gap-3 overflow-hidden", !sidebarOpen && "hidden")}>
          <div className="flex items-center justify-center w-8 h-8 rounded bg-primary text-primary-foreground font-bold text-lg shrink-0">
            A
          </div>
          <div className="leading-tight">
            <h1 className="text-sm font-semibold tracking-wide">AI-HEDGE-OS</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Quant Architect</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className={cn("shrink-0", !sidebarOpen && "mx-auto")}
        >
          {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      <ScrollArea className="flex-1 py-4">
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item, index) => {
            const showCategory = sidebarOpen && (index === 0 || item.category !== navItems[index - 1].category);
            
            return (
              <React.Fragment key={item.name}>
                {showCategory && (
                  <div className="text-[10px] uppercase text-muted-foreground font-bold px-2 py-1 mb-1 mt-4 first:mt-0">
                    {item.category}
                  </div>
                )}
                <Tooltip>
                  <TooltipTrigger render={
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2 rounded-sm text-sm transition-colors",
                        isActive 
                           ? "bg-secondary border-l-2 border-primary text-foreground" 
                           : "text-muted-foreground hover:bg-secondary hover:text-foreground border-l-2 border-transparent",
                        !sidebarOpen && "justify-center border-l-0"
                      )}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {sidebarOpen && <span>{item.name}</span>}
                    </NavLink>
                  } />
                  {!sidebarOpen && <TooltipContent side="right">{item.name}</TooltipContent>}
                </Tooltip>
              </React.Fragment>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-border mt-auto">
        <div className={cn("flex items-center gap-3", !sidebarOpen && "justify-center")}>
          <div className="w-2 h-2 rounded-full bg-success shrink-0" />
          {sidebarOpen && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-medium">System Online</span>
              <span className="text-[10px] text-muted-foreground mt-1">v1.4.2-stable-rev9</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
