# Iteration 2: Local Development Setup (Docker Compose)

## Summary

Containerized the entire development environment using Docker Compose for consistent, easy local development.

## Files Created

```
barberco-mvp/
├── docker-compose.yml        # All services configuration
├── backend/Dockerfile        # FastAPI container
├── frontend/Dockerfile       # React/Vite container
└── scripts/
    ├── setup.sh              # First-time setup
    ├── dev.sh                # Start dev environment
    ├── migrate.sh            # Create & run migrations
    └── reset-db.sh           # Reset database
```

## Services

| Service  | Port | Description               |
|----------|------|---------------------------|
| frontend | 5173 | React dev server (Vite)   |
| backend  | 8000 | FastAPI server            |
| db       | 5432 | PostgreSQL 15             |
| redis    | 6379 | Redis (commented out)     |

## Quick Start

```bash
# First time setup
./scripts/setup.sh

# Start development
./scripts/dev.sh

# View logs
docker compose logs -f

# Stop services
docker compose down
```

## Features

- **Hot Reload**: Both frontend and backend auto-reload on file changes
- **Volume Mounts**: Code changes reflect immediately without rebuilding
- **Health Checks**: Database waits for PostgreSQL to be ready
- **Isolated Dependencies**: node_modules and __pycache__ stay in containers

## Useful Commands

```bash
# Rebuild containers
docker compose up -d --build

# Run migrations
./scripts/migrate.sh "migration message"

# Reset database
./scripts/reset-db.sh

# Backend shell
docker compose exec backend bash

# Database shell
docker compose exec db psql -U postgres -d barberco
```

## URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs
