import bcrypt
if not hasattr(bcrypt, "__about__"):
    class About:
        __version__ = bcrypt.__version__
    bcrypt.__about__ = About()

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ──────────────────────────────────────────────────────────────
    try:
        from app.judge.worker import start_background_worker
        worker_thread = start_background_worker()
        logger.info("Judge worker thread started: %s", worker_thread.name)
    except Exception as e:
        logger.warning("Could not start judge worker (running without Docker?): %s", e)
    yield
    # ── Shutdown ─────────────────────────────────────────────────────────────
    try:
        from app.judge.worker import stop_worker
        stop_worker()
        logger.info("Judge worker stopped")
    except Exception:
        pass


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex="https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to CodeForge API"}

# Include routers
from app.api.api_v1.api import api_router
app.include_router(api_router, prefix=settings.API_V1_STR)

