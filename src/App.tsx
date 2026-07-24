/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import AIChat from '@/pages/AIChat';
import Research from '@/pages/Research';
import Signals from '@/pages/Signals';
import Portfolio from '@/pages/Portfolio';
import Backtesting from '@/pages/Backtesting';
import News from '@/pages/News';
import Admin from '@/pages/Admin';
import Settings from '@/pages/Settings';
import Workflows from '@/pages/Workflows';
import Ollama from '@/pages/Ollama';

export default function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="chat" element={<AIChat />} />
            <Route path="research" element={<Research />} />
            <Route path="signals" element={<Signals />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="backtesting" element={<Backtesting />} />
            <Route path="news" element={<News />} />
            <Route path="admin" element={<Admin />} />
            <Route path="settings" element={<Settings />} />
            <Route path="workflows" element={<Workflows />} />
            <Route path="ollama" element={<Ollama />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}
