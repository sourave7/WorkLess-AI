"""
API v1 Router
Main router that includes all v1 endpoints
"""

from fastapi import APIRouter
from app.api.v1.endpoints import documents

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(
    documents.router,
    prefix="/documents",
    tags=["documents"]
)
