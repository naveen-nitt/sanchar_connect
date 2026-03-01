import requests
from sqlalchemy.orm import Session

from app.config import settings
from app.models import Customer, MessageLog, Store


class WhatsAppService:
    def __init__(self, db: Session, store: Store):
        self.db = db
        self.store = store

    def render(self, template: str, customer: Customer, variables: dict | None = None) -> str:
        variables = variables or {}
        content = template.replace("{{name}}", customer.name)
        for key in ["discount", "expiry_date"]:
            content = content.replace(f"{{{{{key}}}}}", str(variables.get(key, "")))
        return content

    def send_message(self, customer: Customer, content: str) -> str:
        status = "sent"
        try:
            payload = {
                "messaging_product": "whatsapp",
                "to": customer.mobile_number,
                "type": "text",
                "text": {"body": content},
            }
            url = f"{settings.whatsapp_api_base}/{self.store.whatsapp_phone_number_id}/messages"
            headers = {
                "Authorization": f"Bearer {self.store.whatsapp_access_token}",
                "Content-Type": "application/json",
            }
            resp = requests.post(url, json=payload, headers=headers, timeout=15)
            if resp.status_code >= 300:
                status = "failed"
        except Exception:
            status = "failed"

        self.db.add(MessageLog(store_id=self.store.id, customer_id=customer.id, message_content=content, status=status))
        self.db.commit()
        return status
