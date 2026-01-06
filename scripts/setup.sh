#!/bin/bash
set -e

echo "=== Barber Reservation System - First Time Setup ==="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "Building and starting services..."
docker compose up -d --build

echo "Waiting for database to be ready..."
sleep 5

echo "Running database migrations..."
docker compose exec backend alembic upgrade head || echo "No migrations to run yet"

echo ""
echo "=== Setup Complete ==="
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Run 'docker compose logs -f' to view logs"
