from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.authz import require_store_owner
from app.models import Customer, MessageTemplate, Store
from app.services.whatsapp_service import WhatsAppService

router = APIRouter(prefix="/api/whatsapp", tags=["whatsapp"])


class BulkMessageRequest(BaseModel):
    customer_ids: list[int]
    message: str
    variables: dict | None = None


class TemplateRequest(BaseModel):
    name: str
    content: str


@router.post("/bulk")
def send_bulk(payload: BulkMessageRequest, db: Session = Depends(get_db), session=Depends(require_store_owner)):
    store = db.get(Store, session.user_id)
    customers = db.query(Customer).filter(Customer.store_id == session.user_id, Customer.id.in_(payload.customer_ids)).all()
    svc = WhatsAppService(db, store)
    sent = 0
    for customer in customers:
        msg = svc.render(payload.message, customer, payload.variables)
        if svc.send_message(customer, msg) == "sent":
            sent += 1
    return {"total": len(customers), "sent": sent}


@router.post("/individual/{customer_id}")
def send_individual(customer_id: int, payload: BulkMessageRequest, db: Session = Depends(get_db), session=Depends(require_store_owner)):
    store = db.get(Store, session.user_id)
    customer = db.query(Customer).filter(Customer.store_id == session.user_id, Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    svc = WhatsAppService(db, store)
    msg = svc.render(payload.message, customer, payload.variables)
    status = svc.send_message(customer, msg)
    return {"status": status}


@router.post("/templates")
def create_template(payload: TemplateRequest, db: Session = Depends(get_db), session=Depends(require_store_owner)):
    template = MessageTemplate(store_id=session.user_id, name=payload.name, content=payload.content)
    db.add(template)
    db.commit()
    db.refresh(template)
    return template


@router.put("/templates/{template_id}")
def update_template(template_id: int, payload: TemplateRequest, db: Session = Depends(get_db), session=Depends(require_store_owner)):
    template = db.query(MessageTemplate).filter(MessageTemplate.id == template_id, MessageTemplate.store_id == session.user_id).first()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    template.name = payload.name
    template.content = payload.content
    db.commit()
    return template


@router.post("/templates/preview")
def preview_template(payload: BulkMessageRequest, db: Session = Depends(get_db), session=Depends(require_store_owner)):
    store = db.get(Store, session.user_id)
    customer = db.query(Customer).filter(Customer.store_id == session.user_id).first()
    if not customer:
        raise HTTPException(status_code=400, detail="Create at least one customer for preview")
    msg = WhatsAppService(db, store).render(payload.message, customer, payload.variables)
    return {"preview": msg}
