# ⚡ PatentGuard AI
### Real-Time Patentability & Novelty Intelligence Engine

> Reduce patent validation from months to minutes using AI.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Database | Supabase (PostgreSQL + pgvector) |
| AI | OpenAI GPT-4o + text-embedding-3-small |

## Quick Start
```bash
git clone https://github.com/parth-g04/PIH2026_404NotFound
cd patentguard-ai
cp .env.example .env
# Fill in API keys in .env
npm run install:all
# Terminal 1:
npm run dev:server
# Terminal 2:
npm run dev:client
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health: http://localhost:5000/api/health