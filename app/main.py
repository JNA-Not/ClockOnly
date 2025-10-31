from fastapi import FastAPI
from api.core.config import settings

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug
)

@app.get("/")
async def root():
    return {
        "app_name": settings.app_name,
        "debug_mode": settings.debug,
        "host": settings.host,
        "port": settings.port
    }

@app.get("/info")
async def info():
    return {
        "database_url": settings.database_url,
        "secret_key_length": len(settings.secret_key)
    }