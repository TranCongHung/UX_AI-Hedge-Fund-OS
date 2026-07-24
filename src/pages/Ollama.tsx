import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Download, Trash2, Cpu, HardDrive } from 'lucide-react';

export default function Ollama() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ollama Local Models</h1>
          <p className="text-muted-foreground mt-1">Manage local open-source models for private inference.</p>
        </div>
        <Button><Download className="w-4 h-4 mr-2"/> Pull Model</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">VRAM Usage</span>
              <Cpu className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold">14.2 / 24 GB</div>
            <Progress value={60} className="mt-3 h-2" />
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">RAM Usage</span>
              <HardDrive className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold">8.4 / 64 GB</div>
            <Progress value={15} className="mt-3 h-2" />
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">Avg Inference Speed</span>
              <Cpu className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold">42 t/s</div>
            <div className="text-sm text-success mt-1">+5 t/s vs last week</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { name: 'llama3:8b', size: '4.7 GB', loaded: true, params: '8B', quant: 'Q4_0' },
          { name: 'mistral:instruct', size: '4.1 GB', loaded: false, params: '7B', quant: 'Q4_0' },
          { name: 'deepseek-coder:6.7b', size: '3.8 GB', loaded: false, params: '6.7B', quant: 'Q4_0' },
          { name: 'qwen2:7b', size: '4.4 GB', loaded: false, params: '7B', quant: 'Q4_0' },
        ].map((model) => (
          <Card key={model.name} className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{model.name}</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-danger hover:text-danger hover:bg-danger/10"><Trash2 className="w-4 h-4"/></Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <span className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">{model.params}</span>
                <span className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">{model.quant}</span>
                <span className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">{model.size}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${model.loaded ? 'bg-success' : 'bg-muted-foreground'}`}></div>
                <span className="text-sm text-muted-foreground">{model.loaded ? 'Loaded in VRAM' : 'Idle'}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
