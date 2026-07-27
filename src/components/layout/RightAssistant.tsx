import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { X, Send, Bot, BrainCircuit, Activity, BarChart2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function RightAssistant() {
  const { rightPanelOpen, toggleRightPanel } = useAppStore();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 right-0 z-50 flex flex-col bg-background/95 backdrop-blur-md border-l border-border transition-all duration-300 ease-in-out shrink-0",
        rightPanelOpen ? "w-80 translate-x-0" : "w-80 translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border h-[60px]">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-semibold">AI Copilot</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleRightPanel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div className="text-xs text-center text-muted-foreground my-2">Today, 09:41 AM</div>
          
          <div className="flex flex-col gap-2">
            <div className="bg-secondary/50 rounded-xl rounded-tr-sm p-3 self-end max-w-[85%] text-sm">
              Any major macro events impacting tech stocks today?
            </div>
            
            <div className="flex items-start gap-3 mt-2">
              <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30 mt-1">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="bg-secondary border border-border rounded-xl rounded-tl-sm p-3 text-sm">
                <p>Yes. The CPI report came in slightly hotter than expected at 0.3% MoM. Bond yields are up 5bps, which is putting pressure on high-duration tech assets.</p>
                <div className="mt-2 p-2 bg-background border border-border rounded flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-medium">NDX 100 Signal: -1.2% Expectation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border bg-background">
        <div className="relative flex items-end gap-2 bg-secondary/50 border border-border rounded-xl p-1 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
          <Textarea 
            placeholder="Ask AI Copilot..."
            className="min-h-[40px] max-h-[120px] bg-transparent border-none focus-visible:ring-0 resize-none py-2 px-3 text-sm custom-scrollbar shadow-none"
          />
          <Button size="icon" className="shrink-0 w-8 h-8 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground mb-1 mr-1">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2 mt-2 px-1">
          <Tooltip>
            <TooltipTrigger render={
              <Button variant="ghost" size="icon" className="w-6 h-6 rounded bg-secondary">
                <BarChart2 className="w-3 h-3" />
              </Button>
            } />
            <TooltipContent>Analyze current chart</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </aside>
  );
}
