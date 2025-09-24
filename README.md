# Task Manager (3-tier)

Dark-themed task manager with CRUD operations.

- Backend: Express (Node.js) + better-sqlite3 (SQLite)
- Frontend: Vanilla HTML/CSS/JS, dark theme with light toggle
- Database: SQLite file stored in `data/tasks.db`

## Structure

- `backend/` — Node API server
  - `server.js`, `src/db.js`, `Dockerfile`
- `frontend/` — Static UI (served by Nginx in Docker)
  - `public/` assets, `Dockerfile`, `nginx.conf`
- `docker-compose.yml` — orchestrates `frontend` and `backend`
- `data/` — SQLite database (auto-created)

## Local (no Docker)

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Docker (split frontend/backend)

```bash
# ensure Docker Desktop is running
docker compose up -d --build
# open http://localhost:3000
```

- `frontend` (Nginx) serves UI on port 3000
- `/api` is proxied to `backend:3000`
- SQLite file persists in `dbdata` volume (mounted at `/app/data` in backend)

Stop:

```bash
docker compose down
```

Logs:

```bash
docker compose logs -f backend
# or
docker compose logs -f frontend
```

## API

- GET `/api/tasks`
- POST `/api/tasks`
- PUT `/api/tasks/:id`
- DELETE `/api/tasks/:id`
