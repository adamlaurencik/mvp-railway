#!/bin/bash
set -e

if [ -z "$1" ]; then
    echo "Usage: ./scripts/migrate.sh <migration_message>"
    echo "Example: ./scripts/migrate.sh 'add users table'"
    exit 1
fi

echo "Creating migration: $1"
docker compose exec backend alembic revision --autogenerate -m "$1"

echo "Applying migration..."
docker compose exec backend alembic upgrade head

echo "Migration complete!"
