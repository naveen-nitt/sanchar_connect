from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.authz import require_store_owner
from app.services.dashboard_service import age_distribution, dashboard_metrics, upcoming_birthdays, visits_over_time

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/metrics")
def metrics(db: Session = Depends(get_db), session=Depends(require_store_owner)):
    return dashboard_metrics(db, session.user_id)


@router.get("/visits-over-time")
def visits(days: int = Query(default=30, ge=7, le=365), db: Session = Depends(get_db), session=Depends(require_store_owner)):
    return visits_over_time(db, session.user_id, days)


@router.get("/age-distribution")
def ages(db: Session = Depends(get_db), session=Depends(require_store_owner)):
    return age_distribution(db, session.user_id)


@router.get("/birthday-upcoming")
def birthdays(days: int = Query(default=7, ge=1, le=30), db: Session = Depends(get_db), session=Depends(require_store_owner)):
    return upcoming_birthdays(db, session.user_id, days)
