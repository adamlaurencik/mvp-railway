#!/bin/bash
set -e

echo "WARNING: This will delete all data in the database!"
read -p "Are you sure? (y/N) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Stopping services..."
    docker compose down

    echo "Removing database volume..."
    docker volume rm barberco-mvp_postgres_data 2>/dev/null || true

    echo "Starting services..."
    docker compose up -d

    echo "Waiting for database..."
    sleep 5

    echo "Running migrations..."
    docker compose exec backend alembic upgrade head || echo "No migrations to run yet"

    echo "Database reset complete!"
else
    echo "Cancelled."
fi
