from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.authz import require_store_owner
from app.models import Customer
from app.schemas.customer import CustomerFilter
from app.services.export_service import apply_customer_filters, export_customers

router = APIRouter(prefix="/api/export", tags=["export"])


@router.post("/customers")
def export_customer_data(
    filters: CustomerFilter,
    format: str = Query(default="csv", pattern="^(csv|xlsx)$"),
    db: Session = Depends(get_db),
    session=Depends(require_store_owner),
):
    query = db.query(Customer)
    filtered = apply_customer_filters(query, session.user_id, filters).all()
    return export_customers(filtered, format)
