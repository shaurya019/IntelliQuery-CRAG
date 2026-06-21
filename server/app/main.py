from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.services.db.dynamodb import ensure_users_table

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
)

cors_origins = [origin.strip() for origin in settings.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    ensure_users_table()


@app.get("/", tags=["health"])
def root() -> dict[str, str]:
    return {"message": "FastAPI server is running"}


@app.get(f"{settings.API_V1_PREFIX}/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(api_router, prefix=settings.API_V1_PREFIX)
