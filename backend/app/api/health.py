from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.database import get_db

router = APIRouter()


@router.get("/health")
def health_check():
    """Basic health check endpoint."""
    return {"status": "healthy", "service": "barberco-api"}


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
        "database": db_status,
    }
