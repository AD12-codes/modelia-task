# Modelia Fullstack Assignment

## 🚀 Quick Start

```bash

pnpm install
createdb modelia_task
pnpm db:migrate
pnpm dev

```

Visit **http://localhost:5173** to see your app!

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js, Express, PostgreSQL, Drizzle ORM, JWT |
| **Frontend** | React 18, Vite, Tailwind v4, TanStack Router, React Query |
| **Tools** | pnpm, Biome, TypeScript, AI SDK |

## 📦 Project Structure

```
packages/
├── backend/     # Node.js API with authentication
└── frontend/    # React frontend application
```

## 📡 API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user (protected)

## 🧰 Available Scripts

```bash
pnpm dev              # Start both apps
pnpm dev:backend      # Backend only
pnpm dev:frontend     # Frontend only
pnpm db:push          # Push DB schema
pnpm db:studio        # Open Drizzle Studio
pnpm check            # Format & lint
```
---
