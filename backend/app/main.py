from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address
from starlette.responses import JSONResponse

from app.config import settings
from app.database import Base, engine
from app.middleware.rate_limit import limiter
from app.routers import admin, auth, customer, dashboard, export, whatsapp
from app.services.session_cleanup import start_cleanup_job


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    start_cleanup_job()
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request, exc):
    return JSONResponse(status_code=429, content={"detail": "Too many requests"})


app.include_router(auth.router)
app.include_router(customer.router)
app.include_router(dashboard.router)
app.include_router(export.router)
app.include_router(whatsapp.router)
app.include_router(admin.router)


@app.get("/health")
def health():
    return {"status": "ok", "ip_extractor": get_remote_address.__name__}
