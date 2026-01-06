#!/bin/bash
set -e

echo "Starting development environment..."
docker compose up -d

echo ""
echo "Services started:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "Run 'docker compose logs -f' to view logs"
echo "Run 'docker compose down' to stop services"
