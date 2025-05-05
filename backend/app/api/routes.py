from fastapi import APIRouter
from app.api.endpoints import analyzer, insights, upload, export

router = APIRouter()
router.include_router(upload.router, prefix="/upload", tags=["Upload"])
router.include_router(analyzer.router, prefix="/analyzer", tags=["Analyzer"])
router.include_router(insights.router, prefix="/insights", tags=["Insights"])
router.include_router(export.router, prefix="/export", tags=["Export"])