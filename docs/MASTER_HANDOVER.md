# AI-Hedge-Fund-OS
# MASTER HANDOVER v2.0

> **Single Source of Truth**
>
> Tài liệu này là tài liệu chính thức của dự án.
>
> Mọi AI tham gia phát triển phải đọc toàn bộ tài liệu trước khi viết code.

---

# 1. Project Information
**Tên**: AI-Hedge-Fund-OS
**Loại**: Multi-Agent Quant Research Platform
**Triết lý**: Local First, Open Source, AI First, Low Hardware, Research Driven, Data Driven
**Mục tiêu**: Không phải Bot Trade. Không phải AI Chat. Không phải Dashboard. Đây là hệ điều hành nghiên cứu định lượng bằng AI.

# 2. Vision
Price + News + Macro -> Research AI -> Multi-Agent Debate -> Investment Committee -> Signals -> Backtesting -> Quant Engine -> Portfolio -> Dashboard -> AI Assistant

**Tầm nhìn**: 
2026: Research Platform -> 2027: Semi-Autonomous AI Analyst -> 2028: Autonomous Quant Operating System

# 3. Philosophy
- 100% Local First
- Windows 10
- 6GB RAM
- No GPU
- Docker
- Open Source
- Không cần VPS trong thời gian nghĩa vụ quân sự.
- Ưu tiên: Free, OSS, Stable, Maintainable

# 4. Technology Stack
- **Backend**: n8n, PostgreSQL, Docker, FastAPI, Python
- **AI**: Groq, Ollama, Qwen2.5 3B, Qwen2.5 Coder 3B
- **Frontend**: React, TypeScript, TailwindCSS, Shadcn, Recharts
- **Deployment**: Docker Compose

# 5. Folder Structure
- docker/
- docs/
- database/
- workflows/
- api/
- scripts/
- README.md
- CHANGELOG.md
- VERSION

**UX**:
- UX_AI-Hedge-Fund-OS
- src/
- src/pages/
- src/components/
- src/hooks/
- src/services/
- src/types/
- src/assets/

# 6. Sprint History
- Sprint 1: Docker
- Sprint 2: PostgreSQL
- Sprint 3: Historical Collector (WF-001)
- Sprint 4: RSS Collector (WF-003)
- Sprint 5: Macro Collector (WF-010)
- Sprint 6: Technical Agent (WF-020)
- Sprint 7: Sentiment Agent (WF-021)
- Sprint 8: Macro Agent (WF-022)
- Sprint 9: Investment Committee (WF-023)
- Sprint 10: Signal Evaluator (WF-025)
- Sprint 11: Backtest (WF-030)
- Sprint 12: Quant Engine (WF-035)
- Sprint 13: AI Chat (WF-070)
- Sprint 14: Dashboard API (WF-080)

# 7. Workflow Map
WF-001 (market_prices) -> WF-020 (signals) -> WF-023 (final_decisions) -> WF-025 (signal_outcomes) -> WF-030 (backtest_summary) -> WF-035 (quant_metrics) -> WF-080 (Dashboard)

# 8. Workflow Details
Mỗi Workflow gồm: Purpose, Trigger, Input, Output, Database, Dependencies, Future Improvements.

# 9. Database Schema
Các bảng cơ bản: market_prices, signals, final_decisions,...

# 10. APIs
Binance, RSS, FRED, Groq, Ollama, FastAPI...

# 11. AI Architecture
Technical Agent -> Sentiment Agent -> Macro Agent -> Investment Committee -> Risk Manager -> Portfolio Manager -> Execution

# 12. Quant Engine
Metrics: Sharpe, Sortino, Calmar, Kelly, Expectancy, Profit Factor, Win Rate, Recovery Factor, Drawdown, CAGR

# 13. UX Architecture
Trang: Dashboard, Research, Chat, Portfolio, Signals, Backtesting, Workflow Monitor, Settings, Admin

# 14. API Between Backend & UX
GET /api/dashboard, GET /api/signals, GET /api/backtest, POST /api/chat

# 15. Docker
Containers: Postgres, n8n, FastAPI, Ollama. Volumes, Networks, Ports, Recovery.

# 16. Lessons Learned
- Không hardcode API Key
- Merge dùng Append
- Loop Over Items
- Không dùng fetch()
- CMD thay PowerShell
- Docker Volume giữ dữ liệu

# 17. Coding Rules
- Không rename Workflow
- Không rename DB
- Backward Compatible
- Comment rõ
- Commit nhỏ

# 18. Git Rules
Commit Convention: feat, fix, docs, refactor, style, test, chore

# 19. Recovery Guide
Docker, Postgres, n8n, Workflow, Database, Git

# 20. Roadmap
- Phase 1: Research Platform ✅
- Phase 2: Dashboard 🚧
- Phase 3: Portfolio 🚧
- Phase 4: Autonomous AI ⏳
- Phase 5: Execution Engine ⏳
- Phase 6: Institutional Platform 🔮

# 21. Outstanding Tasks
Portfolio Dashboard, Workflow Monitor, Notification, Paper Trading, Risk Dashboard, Authentication, FastAPI, RAG, Multi-round Debate, Vector Database

# 22. Prompt Rules
Claude, Gemini, Kimi, OpenAI. Tất cả AI đều phải:
- Không đổi Workflow ID.
- Không đổi Database.
- Không viết mock data nếu đã có API.
- Ưu tiên code production.
- Không tạo duplicate Workflow.
- Giữ backward compatibility.

# 23. Appendix
Danh sách Workflow, PostgreSQL, Docker Commands, Git Commands, n8n Commands, API Reference, v.v.
