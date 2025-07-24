# Concept Lab Monorepo

A unified fullstack monorepo to learn and demonstrate key concepts of React, Next.js, Python, FastAPI, SQL, and NoSQL — from beginner to advanced.

## Structure

```
concept-lab/
  apps/
    frontend/   # Next.js App Router frontend (TypeScript)
    backend/    # FastAPI backend (Python)
  packages/     # Shared packages (optional)
  pnpm-workspace.yaml
  package.json
  README.md
```

## Key Features

- **Monorepo** with pnpm workspaces
- **Next.js App Router** frontend (TypeScript)
- **FastAPI** backend (Python)
- **Domain-based routes** for each concept:
  - `react/*` → React hooks and rendering
  - `python/*` → Python logic (decorators, context managers)
  - `sql/*` → SQL queries (joins, group by, subqueries)
  - `nosql/*` → MongoDB-like examples
  - `api-demo/*` → FastAPI features (validation, DI, auth, websockets)
- **Interactive UI**: Each concept has a self-contained page with UI and backend interaction

## Getting Started

### Prerequisites

- [pnpm](https://pnpm.io/) (for JS/TS monorepo)
- [Poetry](https://python-poetry.org/) (for Python backend)
- Python 3.10+

### Install dependencies

#### Frontend (Next.js)

```sh
cd apps/frontend
pnpm install
```

#### Backend (FastAPI)

```sh
cd apps/backend
poetry install
```

### Run both apps locally

From the root:

```sh
# In one terminal (or use `pnpm dev` for both)
pnpm dev:frontend
# In another terminal
pnpm dev:backend
```

Or, to run both together (requires `concurrently`):

```sh
pnpm dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:8000/docs](http://localhost:8000/docs)

### Explore Concepts

- Visit `/react/use-effect` for a React useEffect demo
- Visit `/python/decorators` for a Python decorator demo
- Visit `/sql/joins` for a SQL join demo

Each page is interactive and fetches data from the FastAPI backend.

## Add Your Own Concepts

- Add a new route in `apps/frontend/app/<domain>/<concept>/page.tsx`
- Add a matching backend route in `apps/backend/app/routers/<domain>.py`
- Connect via fetch to `/api/<domain>/<concept>`

---

Happy learning and hacking!
