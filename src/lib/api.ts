export const getN8nUrl = () => {
  const url = localStorage.getItem('n8n_url') || import.meta.env.VITE_N8N_URL || 'http://localhost:5678';
  return url.replace(/\/$/, ''); // Remove trailing slash if present
};

export const isTestMode = () => {
  return localStorage.getItem('n8n_test_mode') === 'true';
}

export const getWebhookPath = (path: string) => {
  return isTestMode() ? `/webhook-test/${path}` : `/webhook/${path}`;
}

export const fetchDashboardStatus = () => fetch(`${getN8nUrl()}${getWebhookPath('dashboard-status')}`);
export const fetchDashboardSignals = () => fetch(`${getN8nUrl()}${getWebhookPath('dashboard-signals')}`);
export const fetchDashboardDecisions = () => fetch(`${getN8nUrl()}${getWebhookPath('dashboard-decisions')}`);
export const fetchAiChat = (message: string) => fetch(`${getN8nUrl()}${getWebhookPath('ai-chat')}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ message })
});