import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, BrainCircuit, User } from 'lucide-react';
import { API } from '@/lib/api';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export default function AIChat() {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: 'Da ket noi voi tro ly AI (Groq). Hoi ve gia hoac tin hieu cac coin trong watchlist.' },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isGenerating) return;

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsGenerating(true);

    try {
      const res = await axios.post(API.chat, { message: text }, { timeout: 30000 });
      const reply = res.data?.reply || '(khong co phan hoi)';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      const msg = axios.isAxiosError(err) ? err.message : 'Loi khong xac dinh';
      setMessages((prev) => [...prev, { role: 'system', content: `Loi ket noi toi tro ly: ${msg}` }]);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-4">
      <Card className="flex-1 flex flex-col bg-card border-border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border bg-card/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" />
            <span className="font-medium">Tro ly quy dau tu (Groq API)</span>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="max-w-3xl mx-auto space-y-6 pb-4">
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
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
            {isGenerating && (
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                  <BrainCircuit className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <div className="p-4 rounded-xl bg-secondary/50 border border-border rounded-tl-sm">
                  <p className="text-sm text-muted-foreground">Dang suy nghi...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 bg-background border-t border-border">
          <div className="max-w-3xl mx-auto relative flex items-end gap-2 bg-secondary/50 border border-border rounded-xl p-2 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
            <Textarea
              placeholder="Hoi ve gia, tin hieu, hoac watchlist..."
              className="min-h-[44px] max-h-[200px] bg-transparent border-none focus-visible:ring-0 resize-none p-2 shadow-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button
              size="icon"
              className="shrink-0 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={!input.trim() || isGenerating}
              onClick={handleSend}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <div className="max-w-3xl mx-auto mt-2 text-center">
            <span className="text-xs text-muted-foreground">AI co the sai. Kiem tra lai du lieu quan trong.</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
