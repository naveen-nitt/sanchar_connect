from pydantic import BaseModel, EmailStr


class StoreCreateRequest(BaseModel):
    store_name: str
    owner_name: str
    email: EmailStr
    password: str


class StoreOut(BaseModel):
    id: int
    store_uuid: str
    store_name: str
    owner_name: str
    email: str
    qr_path: str | None = None

    class Config:
        from_attributes = True
