from datetime import datetime

from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session

from app.auth.security import verify_password
from app.auth.session_manager import CSRF_COOKIE, SESSION_COOKIE, create_session
from app.config import settings
from app.database import get_db
from app.middleware.authz import require_authenticated
from app.models import Admin, Store
from app.schemas.auth import LoginRequest, LoginResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, request: Request, response: Response, db: Session = Depends(get_db)):
    role = payload.role
    user = None
    if role == "store_owner":
        user = db.query(Store).filter(Store.email == payload.email).first()
    elif role == "admin":
        user = db.query(Admin).filter(Admin.email == payload.email).first()

    if not user or not verify_password(payload.password, user.password_hash):
        return Response(status_code=401)

    session = create_session(db, user.id, role, request)
    max_age = settings.session_minutes * 60
    response.set_cookie(SESSION_COOKIE, session.id, httponly=True, secure=settings.session_cookie_secure, samesite="lax", max_age=max_age)
    response.set_cookie(CSRF_COOKIE, session.csrf_token, httponly=False, secure=settings.session_cookie_secure, samesite="lax", max_age=max_age)
    return LoginResponse(message="Logged in", role=role)


@router.post("/logout")
def logout(response: Response, session=Depends(require_authenticated), db: Session = Depends(get_db)):
    db.delete(session)
    db.commit()
    response.delete_cookie(SESSION_COOKIE)
    response.delete_cookie(CSRF_COOKIE)
    return {"message": "Logged out", "at": datetime.utcnow()}
