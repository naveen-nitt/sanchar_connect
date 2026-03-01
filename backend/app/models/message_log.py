from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class MessageLog(Base):
    __tablename__ = "message_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    store_id: Mapped[int] = mapped_column(ForeignKey("stores.id"), index=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"), index=True)
    message_content: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(Enum("sent", "failed", "delivered", name="message_status"), default="sent")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    store = relationship("Store", back_populates="messages")
    customer = relationship("Customer", back_populates="messages")
