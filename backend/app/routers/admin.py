import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.auth.security import hash_password
from app.config import settings
from app.database import get_db
from app.middleware.authz import require_admin
from app.models import Customer, Store
from app.schemas.store import StoreCreateRequest, StoreOut
from app.services.qr_service import generate_store_qr

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/stores", response_model=StoreOut)
def create_store(payload: StoreCreateRequest, db: Session = Depends(get_db), _=Depends(require_admin)):
    existing = db.query(Store).filter(Store.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="Store email already exists")

    store = Store(
        store_uuid=uuid.uuid4().hex[:12],
        store_name=payload.store_name,
        owner_name=payload.owner_name,
        email=payload.email,
        password_hash=hash_password(payload.password),
    )
    db.add(store)
    db.commit()
    db.refresh(store)
    qr_path = generate_store_qr(store.store_uuid, settings.domain_url)
    return StoreOut.model_validate({**store.__dict__, "qr_path": qr_path})


@router.get("/stats")
def admin_stats(db: Session = Depends(get_db), _=Depends(require_admin)):
    return {
        "total_stores": db.query(func.count(Store.id)).scalar() or 0,
        "total_customers": db.query(func.count(Customer.id)).scalar() or 0,
    }
