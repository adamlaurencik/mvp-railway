# Iteration 1: Project Foundation & Database

## Summary

This iteration establishes the foundational architecture for the Barber Reservation System MVP. The goal was to set up the basic project structure, database connection, and verify that frontend-backend communication works.

## What Was Done

### Backend (FastAPI + SQLAlchemy + Alembic)

#### 1. Project Structure Created
```
backend/
├── alembic/
│   ├── versions/          # Migration files (empty for now)
│   ├── env.py             # Alembic environment configuration
│   └── script.py.mako     # Migration template
├── app/
│   ├── api/
│   │   └── health.py      # Health check endpoints
│   ├── core/
│   │   ├── config.py      # Configuration management
│   │   └── database.py    # SQLAlchemy setup
│   ├── models/            # SQLAlchemy models (to be added)
│   ├── schemas/           # Pydantic schemas (to be added)
│   └── tasks/             # Celery tasks (future)
├── alembic.ini            # Alembic configuration
├── main.py                # FastAPI application entry point
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables (local)
└── .env.example           # Environment variables template
```

#### 2. Configuration Management (`app/core/config.py`)
- Uses Pydantic Settings for type-safe configuration
- Loads from environment variables and `.env` file
- Configurable settings:
  - `APP_NAME`: Application name
  - `DEBUG`: Debug mode flag
  - `DATABASE_URL`: PostgreSQL connection string
  - `SECRET_KEY`: JWT signing key
  - `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration
  - `CORS_ORIGINS`: Allowed frontend origins

#### 3. Database Setup (`app/core/database.py`)
- SQLAlchemy engine and session configuration
- `SessionLocal` for database sessions
- `Base` declarative base for models
- `get_db()` dependency for FastAPI routes

#### 4. Alembic Migrations
- Initialized Alembic with PostgreSQL support
- `env.py` configured to read `DATABASE_URL` from settings
- Migration template ready for future schema changes

#### 5. Health Check Endpoints (`app/api/health.py`)
- `GET /health` - Basic health check (no DB)
- `GET /health/db` - Health check with database connectivity test

#### 6. Main Application (`main.py`)
- FastAPI app with CORS middleware
- Health router included
- Root endpoint with API info

### Frontend (React + Vite + TypeScript)

#### 1. Project Structure Created
```
frontend/
├── src/
│   ├── api/
│   │   └── health.ts      # Health check API client
│   ├── components/        # Reusable components (empty)
│   ├── hooks/             # Custom hooks (empty)
│   ├── pages/
│   │   └── HealthCheck.tsx # Health check display page
│   ├── types/             # TypeScript types (empty)
│   ├── App.tsx            # Main app component
│   ├── App.css            # App styles
│   ├── config.ts          # Environment config
│   ├── index.css          # Global styles
│   └── main.tsx           # Entry point
├── .env                   # Environment variables
├── .env.example           # Environment template
└── package.json           # Dependencies
```

#### 2. Environment Configuration (`config.ts`)
- `VITE_API_URL` - Backend API URL (default: http://localhost:8000)

#### 3. API Client (`api/health.ts`)
- `checkHealth()` - Calls `/health` endpoint
- `checkHealthDb()` - Calls `/health/db` endpoint
- TypeScript interfaces for responses

#### 4. Health Check Page (`pages/HealthCheck.tsx`)
- Displays system health status
- Shows service name, status, and database connectivity
- Refresh button to re-check health
- Loading and error states
- Color-coded status (green=healthy, red=unhealthy)

## How to Run

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+

### Database Setup
```bash
# Create database
createdb barberco

# Or using psql
psql -U postgres -c "CREATE DATABASE barberco;"
```

### Backend
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run the server
uvicorn main:app --reload
```

Backend will be available at http://localhost:8000

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at http://localhost:5173

## API Endpoints

| Method | Endpoint      | Description                          |
|--------|---------------|--------------------------------------|
| GET    | /             | API info and version                 |
| GET    | /health       | Basic health check                   |
| GET    | /health/db    | Health check with database test      |

## Verification

1. Start PostgreSQL and ensure the `barberco` database exists
2. Start the backend server (`uvicorn main:app --reload`)
3. Start the frontend (`npm run dev`)
4. Open http://localhost:5173 in your browser
5. You should see:
   - "Barber Reservation System" heading
   - "System Health Status" subheading
   - Green status box showing:
     - Service: barberco-api
     - Status: healthy
     - Database: connected

## Next Steps (Iteration 2)

- Create SQLAlchemy models (Barber, TimeSlot, Customer, Admin)
- Add Alembic migrations for initial schema
- Implement authentication (JWT)
- Create admin endpoints for barber management

## Dependencies Added

### Backend (requirements.txt)
- fastapi==0.109.0
- uvicorn[standard]==0.27.0
- sqlalchemy==2.0.25
- psycopg2-binary==2.9.9
- alembic==1.13.1
- pydantic==2.5.3
- pydantic-settings==2.1.0
- python-dotenv==1.0.0
- python-jose[cryptography]==3.3.0
- passlib[bcrypt]==1.7.4

### Frontend (package.json)
- react 19.x
- react-dom 19.x
- typescript 5.x
- vite 6.x
