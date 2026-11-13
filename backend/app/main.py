from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database.connection import Base, engine
import app.models
from app.api.v1.auth import router as auth_router

app = FastAPI(
    title=settings.APP_NAME,
    description="Music Streaming Application API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(
    auth_router,
    prefix="/api/v1"
)


@app.get("/")
def home():
    return {
        "message": "Welcome to Music Streaming API",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
