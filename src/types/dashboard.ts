export interface QuantSignal {
  id: string;
  symbol: string;
  assetClass: 'CRYPTO' | 'EQUITIES' | 'FX' | 'MACRO';
  signal: 'LONG' | 'SHORT' | 'NEUTRAL';
  priceAtSignal: string;
  targetPrice: string;
  stopLoss: string;
  confidence: number;
  strategy: string;
  createdAt: string;
  pnlContribution: string;
}

export interface DashboardStatus {
  postgresOnline: boolean;
  n8nOnline: boolean;
  ollamaOnline: boolean;
  signalsTodayCount: number;
  activeWorkflows: number;
  watchlistCount: number;
  latencyMs: number;
}

export interface EquityPoint {
  time: string;
  alphaStrategy: number;
  benchmarkBTC: number;
  benchmarkSPX: number;
}

export interface SignalVolumePoint {
  category: string;
  crypto: number;
  equities: number;
  fx: number;
}

export const defaultEquityData: EquityPoint[] = [
  { time: '09:00', alphaStrategy: 1000000, benchmarkBTC: 1000000, benchmarkSPX: 1000000 },
  { time: '10:00', alphaStrategy: 1004200, benchmarkBTC: 1001500, benchmarkSPX: 1000400 },
  { time: '11:00', alphaStrategy: 1008900, benchmarkBTC: 998200,  benchmarkSPX: 1001100 },
  { time: '12:00', alphaStrategy: 1014500, benchmarkBTC: 1004100, benchmarkSPX: 1001800 },
  { time: '13:00', alphaStrategy: 1012800, benchmarkBTC: 1002900, benchmarkSPX: 1000900 },
  { time: '14:00', alphaStrategy: 1019400, benchmarkBTC: 1008400, benchmarkSPX: 1002400 },
  { time: '15:00', alphaStrategy: 1024800, benchmarkBTC: 1006100, benchmarkSPX: 1003100 },
  { time: '16:00', alphaStrategy: 1031250, benchmarkBTC: 1011400, benchmarkSPX: 1004200 },
];

export const defaultSignalVolume: SignalVolumePoint[] = [
  { category: '00:00 - 04:00', crypto: 8, equities: 2, fx: 4 },
  { category: '04:00 - 08:00', crypto: 12, equities: 5, fx: 9 },
  { category: '08:00 - 12:00', crypto: 15, equities: 24, fx: 14 },
  { category: '12:00 - 16:00', crypto: 18, equities: 31, fx: 12 },
  { category: '16:00 - 20:00', crypto: 14, equities: 10, fx: 8 },
  { category: '20:00 - 24:00', crypto: 11, equities: 4, fx: 6 },
];

export const defaultSignals: QuantSignal[] = [
  {
    id: 'sig-001',
    symbol: 'BTC/USD',
    assetClass: 'CRYPTO',
    signal: 'LONG',
    priceAtSignal: '$67,432.10',
    targetPrice: '$71,200.00',
    stopLoss: '$65,100.00',
    confidence: 94.2,
    strategy: 'Transformer-Momentum-v4',
    createdAt: '10:14:22',
    pnlContribution: '+$4,820.40'
  },
  {
    id: 'sig-002',
    symbol: 'NVDA',
    assetClass: 'EQUITIES',
    signal: 'LONG',
    priceAtSignal: '$128.45',
    targetPrice: '$138.00',
    stopLoss: '$123.50',
    confidence: 89.7,
    strategy: 'Earnings-Sentiment-Llama3',
    createdAt: '09:48:05',
    pnlContribution: '+$3,140.00'
  },
  {
    id: 'sig-003',
    symbol: 'ETH/USD',
    assetClass: 'CRYPTO',
    signal: 'SHORT',
    priceAtSignal: '$3,481.05',
    targetPrice: '$3,290.00',
    stopLoss: '$3,580.00',
    confidence: 81.4,
    strategy: 'Orderflow-Imbalance-L1',
    createdAt: '09:30:11',
    pnlContribution: '+$1,980.25'
  },
  {
    id: 'sig-004',
    symbol: 'EUR/USD',
    assetClass: 'FX',
    signal: 'SHORT',
    priceAtSignal: '1.08420',
    targetPrice: '1.07600',
    stopLoss: '1.08900',
    confidence: 78.5,
    strategy: 'Macro-Rates-Differential',
    createdAt: '08:55:40',
    pnlContribution: '+$910.15'
  },
  {
    id: 'sig-005',
    symbol: 'SOL/USD',
    assetClass: 'CRYPTO',
    signal: 'LONG',
    priceAtSignal: '$178.20',
    targetPrice: '$198.50',
    stopLoss: '$169.00',
    confidence: 88.0,
    strategy: 'Transformer-Momentum-v4',
    createdAt: '08:42:19',
    pnlContribution: '+$2,450.80'
  },
  {
    id: 'sig-006',
    symbol: 'AAPL',
    assetClass: 'EQUITIES',
    signal: 'NEUTRAL',
    priceAtSignal: '$226.30',
    targetPrice: '$226.30',
    stopLoss: '$221.00',
    confidence: 64.0,
    strategy: 'Mean-Reversion-StatArb',
    createdAt: '08:15:00',
    pnlContribution: '$0.00'
  },
  {
    id: 'sig-007',
    symbol: 'XAU/USD',
    assetClass: 'MACRO',
    signal: 'LONG',
    priceAtSignal: '$2,412.50',
    targetPrice: '$2,460.00',
    stopLoss: '$2,385.00',
    confidence: 86.3,
    strategy: 'Macro-Rates-Differential',
    createdAt: '07:50:12',
    pnlContribution: '+$1,680.00'
  },
  {
    id: 'sig-008',
    symbol: 'MSFT',
    assetClass: 'EQUITIES',
    signal: 'LONG',
    priceAtSignal: '$452.10',
    targetPrice: '$472.00',
    stopLoss: '$441.50',
    confidence: 91.1,
    strategy: 'Earnings-Sentiment-Llama3',
    createdAt: '07:22:38',
    pnlContribution: '+$2,890.30'
  }
];
