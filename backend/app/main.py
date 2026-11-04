from fastapi import FastAPI

from app.core.config import settings


app = FastAPI(
    title=settings.APP_NAME,
    description="Music Streaming Application API",
    version="1.0.0"
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