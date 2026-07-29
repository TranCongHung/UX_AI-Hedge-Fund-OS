/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import AppLayout from '@/components/layout/AppLayout';

import Dashboard from '@/pages/Dashboard';
import Research from '@/pages/Research';
import Markets from '@/pages/Markets';
import Portfolio from '@/pages/Portfolio';
import Backtesting from '@/pages/Backtesting';
import Watchlist from '@/pages/Watchlist';
import AIChat from '@/pages/AIChat';
import AIAgents from '@/pages/AIAgents';
import Workflows from '@/pages/Workflows';
import Database from '@/pages/Database';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';


export default function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Platform */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="research" element={<Research />} />
            <Route path="markets" element={<Markets />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="backtesting" element={<Backtesting />} />
            <Route path="watchlist" element={<Watchlist />} />
            <Route path="chat" element={<AIChat />} />
            
            {/* Infrastructure */}
            <Route path="agents" element={<AIAgents />} />
            <Route path="workflows" element={<Workflows />} />
            <Route path="database" element={<Database />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}
