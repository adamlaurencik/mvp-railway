# Iteration 3: Staging Environment on Railway

## Summary

Configured Railway deployment for staging environment with PostgreSQL, automatic migrations, and health checks.

## Files Created/Modified

```
backend/
├── Dockerfile.prod           # Production Dockerfile
├── railway.toml              # Railway service config
└── app/core/config.py        # Added postgres:// URL fix

frontend/
├── Dockerfile.prod           # Production multi-stage build
└── railway.toml              # Railway service config
```

## Railway Project Setup

### 1. Create Railway Project

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create new project
railway init
```

### 2. Add Services

In Railway dashboard, create these services:

| Service    | Type              | Source            |
|------------|-------------------|-------------------|
| PostgreSQL | Database          | Railway Managed   |
| backend    | GitHub Deployment | /backend folder   |
| frontend   | GitHub Deployment | /frontend folder  |

### 3. Configure Backend Environment Variables

In Railway backend service settings:

```
DATABASE_URL        → ${{Postgres.DATABASE_URL}}  (auto-linked)
SECRET_KEY          → <generate-secure-key>
DEBUG               → false
CORS_ORIGINS        → https://your-frontend.railway.app
```

Note: `CORS_ORIGINS` is comma-separated, e.g. `https://frontend.railway.app,http://localhost:5173`

### 4. Configure Frontend Build Args

In Railway frontend service settings:

```
VITE_API_URL        → https://your-backend.railway.app
```

### 5. Set Root Directory

For each service, set the root directory:
- Backend: `/backend`
- Frontend: `/frontend`

## Deployment Flow

1. Push to `staging` branch
2. Railway detects changes
3. Builds Docker image using `Dockerfile.prod`
4. Backend runs: `alembic upgrade head && uvicorn main:app`
5. Railway health check hits `/health`
6. Service goes live

## Key Features

### Automatic Migrations
Backend `railway.toml` runs migrations before starting:
```toml
startCommand = "alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port $PORT"
```

### Database URL Fix
Railway uses `postgres://` but SQLAlchemy 2.0 requires `postgresql://`. Config auto-converts:
```python
@field_validator("DATABASE_URL", mode="before")
def fix_database_url(cls, v: str) -> str:
    if v.startswith("postgres://"):
        return v.replace("postgres://", "postgresql://", 1)
    return v
```

### Health Checks
- `/health` - Basic check (used by Railway)
- `/health/db` - Includes database connectivity

### Secure SECRET_KEY Handling
App fails to start in production if SECRET_KEY is not set:
```python
@model_validator(mode="after")
def validate_secret_key(self) -> "Settings":
    if not self.SECRET_KEY:
        if self.DEBUG:
            # Auto-generate for development
            self.SECRET_KEY = secrets.token_urlsafe(32)
        else:
            raise ValueError("SECRET_KEY environment variable is required in production")
    return self
```

| Environment | DEBUG | SECRET_KEY required? |
|-------------|-------|----------------------|
| Local dev   | true  | No (auto-generated)  |
| Production  | false | **Yes** (fails without it) |

Generate a secure key for Railway:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Useful Commands

```bash
# View logs
railway logs

# Open shell in service
railway shell

# Run one-off command
railway run alembic upgrade head

# Open service URL
railway open
```

## Environment Variables Reference

### Backend (Required for Production)

| Variable                    | Description                    |
|-----------------------------|--------------------------------|
| DATABASE_URL                | PostgreSQL connection string   |
| SECRET_KEY                  | JWT signing key (secure!)      |
| DEBUG                       | Set to `false` in production   |
| CORS_ORIGINS                | JSON array of allowed origins  |

### Frontend (Build-time)

| Variable      | Description           |
|---------------|-----------------------|
| VITE_API_URL  | Backend API URL       |
