// Cấu hình địa chỉ n8n - đổi trong file .env.local nếu n8n chạy ở địa chỉ khác
export const N8N_URL = import.meta.env.VITE_N8N_URL || 'http://localhost:5678';

export const API = {
  chat: `${N8N_URL}/webhook/ai-chat`,
  dashboardStatus: `${N8N_URL}/webhook/dashboard-status`,
  dashboardSignals: `${N8N_URL}/webhook/dashboard-signals`,
};

export interface Signal {
  symbol: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  reason: string;
  price_at_signal: number | null;
  created_at: string;
}

export interface WorkflowRun {
  workflow_id: string;
  status: string;
  created_at: string;
  duration_ms: number | null;
}

export interface BacktestSummaryRow {
  symbol: string;
  total_trades: number;
  wins: number;
  losses: number;
  win_rate_pct: number;
  avg_rr_achieved: number;
}

export interface DashboardStatus {
  postgres_online: boolean;
  watchlist: { symbol: string; score: number; cross_direction: string | null }[];
  watchlist_count: number;
  workflow_runs: WorkflowRun[];
  signals_today_count: number;
  backtest_summary: BacktestSummaryRow[];
}
