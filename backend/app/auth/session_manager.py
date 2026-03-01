from datetime import datetime, timedelta

from fastapi import HTTPException, Request
from sqlalchemy.orm import Session

from app.auth.security import generate_token
from app.config import settings
from app.models import Session as DbSession


SESSION_COOKIE = "session_id"
CSRF_COOKIE = "csrf_token"


def create_session(db: Session, user_id: int, role: str, request: Request) -> DbSession:
    now = datetime.utcnow()
    session = DbSession(
        id=generate_token(48),
        user_id=user_id,
        role=role,
        csrf_token=generate_token(16),
        created_at=now,
        last_activity=now,
        expires_at=now + timedelta(minutes=settings.session_minutes),
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


def get_valid_session(db: Session, session_id: str | None) -> DbSession:
    if not session_id:
        raise HTTPException(status_code=401, detail="Authentication required")

    session = db.get(DbSession, session_id)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    if session.expires_at < datetime.utcnow():
        db.delete(session)
        db.commit()
        raise HTTPException(status_code=401, detail="Session expired")
    session.last_activity = datetime.utcnow()
    session.expires_at = datetime.utcnow() + timedelta(minutes=settings.session_minutes)
    db.commit()
    db.refresh(session)
    return session
