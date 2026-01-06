import os
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import settings

router = APIRouter()

VERSION = "1.0.0"


@router.get("/health")
def health_check():
    """Basic health check endpoint for Railway."""
    return {
        "status": "healthy",
        "service": "barberco-api",
        "version": VERSION,
    }


@router.get("/health/db")
def health_check_db(db: Session = Depends(get_db)):
    """Health check endpoint that also verifies database connectivity."""
    try:
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "healthy" if db_status == "connected" else "unhealthy",
        "service": "barberco-api",
        "version": VERSION,
        "database": db_status,
        "environment": "production" if not settings.DEBUG else "development",
    }
