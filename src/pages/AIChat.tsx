import { fetchAiChat } from '../lib/api';
import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Paperclip, Send, Settings, StopCircle, RefreshCw, Copy, BrainCircuit, User, MessageSquare } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function AIChat() {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState([
    { role: 'system', content: 'System initialized. Ready for quantitative analysis.' },
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const currentInput = input;
    const newMessage = { role: 'user', content: currentInput };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsGenerating(true);
    
    try {
      const res = await fetchAiChat(currentInput);
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.reply || 'No reply received.'
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Error: Connection failed.'
        }]);
      }
    } catch(err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Error: Could not fetch from AI backend. Make sure n8n is running and CORS is enabled.'
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const ChatHistoryContent = () => (
    <>
      <div className="p-4 border-b border-border">
        <Button variant="outline" className="w-full justify-start gap-2 border-border/50 bg-background hover:bg-secondary">
          <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center"><span className="text-[10px] font-bold text-primary">+</span></div>
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {/* LUU Y: chua co co che luu lich su chat that (chua ket noi database/localStorage).
              Truoc day co 4 muc hardcode gia ("BTC Correlation Analysis"...) da bi xoa vi
              khong phai cuoc hoi thoai that nao. */}
          <div className="px-3 py-6 text-center text-xs text-muted-foreground/60">
            Chua co lich su chat duoc luu.
          </div>
        </div>
      </ScrollArea>
    </>
  );

  return (
    <div className="flex h-[calc(100vh-9.5rem)] gap-4">
      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col bg-card border-border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border bg-card/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger render={
                <Button variant="outline" size="icon" className="lg:hidden shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              } />
              <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 flex flex-col">
                <SheetHeader className="p-4 border-b border-border text-left">
                  <SheetTitle>Chat History</SheetTitle>
                </SheetHeader>
                <ChatHistoryContent />
              </SheetContent>
            </Sheet>

            <Select defaultValue="groq-oss-20b">
              <SelectTrigger className="w-[200px] bg-background border-border">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="groq-oss-20b">GROQ-OSS-20B (WF-070)</SelectItem>
                <SelectItem value="qwen2-5-3b" disabled>QWEN2.5:3B (Ollama - chua noi)</SelectItem>
              </SelectContent>
            </Select>
            {/* LUU Y: hien tai dropdown nay chi mang tinh hien thi, chua thuc su chuyen doi
                model thuc te trong WF-070 (webhook n8n luon goi co dinh GROQ-OSS-20B).
                Da bo cac lua chon gia (Claude/Gemini/DeepSeek/Llama) khong ton tai that. */}

          </div>
          
          <Sheet>
            <SheetTrigger render={
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </Button>
            } />
            <SheetContent className="w-[400px] sm:w-[540px] bg-card border-l-border">
              <SheetHeader>
                <SheetTitle>Model Parameters</SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">System Prompt</label>
                  <Textarea 
                    className="min-h-[150px] bg-background border-border" 
                    defaultValue="You are an expert quantitative researcher and algorithmic trading assistant..."
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Temperature</label>
                    <span className="text-sm text-muted-foreground">0.2</span>
                  </div>
                  <Slider defaultValue={[20]} max={100} step={1} />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Top P</label>
                    <span className="text-sm text-muted-foreground">0.9</span>
                  </div>
                  <Slider defaultValue={[90]} max={100} step={1} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <ScrollArea className="flex-1 min-h-0" ref={scrollRef}>
          <div className="max-w-3xl mx-auto space-y-6 p-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                    <BrainCircuit className="w-5 h-5 text-primary" />
                  </div>
                )}
                
                <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === 'system' ? 'w-full text-center max-w-full' : ''}`}>
                  {msg.role === 'system' ? (
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{msg.content}</span>
                  ) : (
                    <div className={`p-4 rounded-xl ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                        : 'bg-secondary/50 border border-border rounded-tl-sm'
                    }`}>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  )}
                  
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-6 w-6"><Copy className="w-3 h-3" /></Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6"><RefreshCw className="w-3 h-3" /></Button>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        <div className="p-4 bg-background border-t border-border">
          <div className="max-w-3xl mx-auto relative flex items-end gap-2 bg-secondary/50 border border-border rounded-xl p-2 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
            <Tooltip>
              <TooltipTrigger render={
                <Button variant="ghost" size="icon" className="shrink-0 rounded-full text-muted-foreground hover:text-foreground">
                  <Paperclip className="w-5 h-5" />
                </Button>
              } />
              <TooltipContent>Attach Image / CSV</TooltipContent>
            </Tooltip>
            
            <Textarea 
              placeholder="Ask anything about markets, strategies, or data..."
              className="min-h-[44px] max-h-[200px] bg-transparent border-none focus-visible:ring-0 resize-none p-2 custom-scrollbar shadow-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            
            {isGenerating ? (
              <Button size="icon" variant="destructive" className="shrink-0 rounded-full">
                <StopCircle className="w-5 h-5" />
              </Button>
            ) : (
              <Button 
                size="icon" 
                className="shrink-0 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground" 
                disabled={!input.trim()}
                onClick={handleSendMessage}
              >
                <Send className="w-5 h-5" />
              </Button>
            )}
          </div>
          <div className="max-w-3xl mx-auto mt-2 text-center">
            <span className="text-xs text-muted-foreground">AI can make mistakes. Verify important financial data.</span>
          </div>
        </div>
      </Card>
      
      {/* History Sidebar - visible on lg screens */}
      <Card className="w-64 hidden lg:flex flex-col bg-card border-border overflow-hidden shrink-0">
        <ChatHistoryContent />
      </Card>
    </div>
  );
}
