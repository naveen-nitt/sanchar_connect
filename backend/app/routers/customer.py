from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.rate_limit import limiter
from app.models import Customer, Store
from app.schemas.customer import CustomerRegisterRequest

router = APIRouter(tags=["customers"])


@router.get("/customer/{store_uuid}")
def get_store_customer_page_data(store_uuid: str, db: Session = Depends(get_db)):
    store = db.query(Store).filter(Store.store_uuid == store_uuid).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    return {"store_name": store.store_name, "store_uuid": store.store_uuid}


@router.post("/api/customer/register")
@limiter.limit("20/minute")
def register_customer(payload: CustomerRegisterRequest, request: Request, db: Session = Depends(get_db)):
    store = db.query(Store).filter(Store.store_uuid == payload.store_uuid).first()
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")

    customer = db.query(Customer).filter(Customer.store_id == store.id, Customer.mobile_number == payload.mobile_number).first()
    if customer:
        customer.visit_count += 1
        customer.modified_datetime = datetime.utcnow()
        customer.name = payload.name
        customer.age = payload.age
        customer.date_of_birth = payload.date_of_birth
        customer.tags = payload.tags
    else:
        customer = Customer(
            store_id=store.id,
            mobile_number=payload.mobile_number,
            name=payload.name,
            age=payload.age,
            date_of_birth=payload.date_of_birth,
            tags=payload.tags,
            source=payload.source,
            first_visit_datetime=datetime.utcnow(),
            modified_datetime=datetime.utcnow(),
        )
        db.add(customer)

    db.commit()
    return {"message": "Customer registered", "customer_id": customer.id}
