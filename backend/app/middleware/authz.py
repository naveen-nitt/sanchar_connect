from fastapi import Cookie, Depends, Header, HTTPException, Request
from sqlalchemy.orm import Session

from app.auth.session_manager import get_valid_session
from app.database import get_db
from app.models import Session as DbSession


def require_authenticated(
    request: Request,
    db: Session = Depends(get_db),
    session_id: str | None = Cookie(default=None),
) -> DbSession:
    return get_valid_session(db, session_id)


def require_store_owner(session: DbSession = Depends(require_authenticated)) -> DbSession:
    if session.role != "store_owner":
        raise HTTPException(status_code=403, detail="Store owner access required")
    return session


def require_admin(session: DbSession = Depends(require_authenticated)) -> DbSession:
    if session.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return session


def verify_csrf(
    request: Request,
    session: DbSession = Depends(require_authenticated),
    x_csrf_token: str | None = Header(default=None),
    csrf_cookie: str | None = Cookie(default=None, alias="csrf_token"),
):
    if request.method in {"POST", "PUT", "PATCH", "DELETE"}:
        if not x_csrf_token or not csrf_cookie:
            raise HTTPException(status_code=403, detail="Missing CSRF token")
        if x_csrf_token != csrf_cookie or csrf_cookie != session.csrf_token:
            raise HTTPException(status_code=403, detail="Invalid CSRF token")
