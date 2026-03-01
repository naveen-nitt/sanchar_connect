from datetime import date, datetime

from sqlalchemy import JSON, Boolean, Date, DateTime, ForeignKey, Index, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Customer(Base):
    __tablename__ = "customers"
    __table_args__ = (
        UniqueConstraint("store_id", "mobile_number", name="uq_store_mobile"),
        Index("ix_customers_date_of_birth", "date_of_birth"),
        Index("ix_customers_age", "age"),
        Index("ix_customers_modified_datetime", "modified_datetime"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    store_id: Mapped[int] = mapped_column(ForeignKey("stores.id"), index=True)
    mobile_number: Mapped[str] = mapped_column(String(20))
    name: Mapped[str] = mapped_column(String(255))
    age: Mapped[int | None] = mapped_column(Integer, nullable=True)
    date_of_birth: Mapped[date | None] = mapped_column(Date, nullable=True)
    visit_count: Mapped[int] = mapped_column(Integer, default=1)
    first_visit_datetime: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    modified_datetime: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_purchase_datetime: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    tags: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    source: Mapped[str | None] = mapped_column(String(50), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    store = relationship("Store", back_populates="customers")
    messages = relationship("MessageLog", back_populates="customer", cascade="all, delete-orphan")
