from datetime import date, datetime

from pydantic import BaseModel, Field


class CustomerRegisterRequest(BaseModel):
    store_uuid: str
    mobile_number: str = Field(min_length=8, max_length=20)
    name: str = Field(min_length=2, max_length=255)
    age: int | None = Field(default=None, ge=1, le=120)
    date_of_birth: date | None = None
    source: str | None = None
    tags: dict | None = None


class CustomerFilter(BaseModel):
    age_min: int | None = None
    age_max: int | None = None
    birthday_month: int | None = None
    visit_count_min: int | None = None
    last_visit_from: datetime | None = None
    tags: list[str] | None = None
