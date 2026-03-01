from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Store(Base):
    __tablename__ = "stores"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    store_uuid: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    store_name: Mapped[str] = mapped_column(String(255))
    owner_name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), unique=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    whatsapp_access_token: Mapped[str | None] = mapped_column(Text, nullable=True)
    whatsapp_phone_number_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    customers = relationship("Customer", back_populates="store", cascade="all, delete-orphan")
    messages = relationship("MessageLog", back_populates="store", cascade="all, delete-orphan")
