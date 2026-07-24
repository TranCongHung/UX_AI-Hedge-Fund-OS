import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store';

export default function TopNav() {
  const { toggleSidebar } = useAppStore();

  return (
    <header className="h-[73px] border-b border-border bg-background flex items-center justify-between px-6 shrink-0 sticky top-0 z-40">
      <div className="flex items-center gap-4 lg:gap-8">
        <Button variant="ghost" size="icon" className="md:hidden shrink-0" onClick={toggleSidebar}>
          <Menu className="w-5 h-5" />
        </Button>
        <h2 className="text-lg font-medium hidden sm:block">Market Intelligence Terminal</h2>
        <div className="flex gap-4 hidden lg:flex">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">BTC/USD</span>
            <span className="text-sm terminal-font">$67,432.12</span>
            <span className="text-[10px] text-success">+2.41%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">ETH/USD</span>
            <span className="text-sm terminal-font">$3,481.05</span>
            <span className="text-[10px] text-danger">-0.84%</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs">
        <div className="hidden sm:flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded border border-border">
          <span className="text-muted-foreground">Ollama:</span>
          <span className="text-success">Llama-3-70b</span>
        </div>
        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-[10px] font-bold border border-border shrink-0">JD</div>
      </div>
    </header>
  );
}
