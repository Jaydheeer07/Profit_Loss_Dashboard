from fastapi import APIRouter
from app.api.endpoints import analyzer, insights, upload, export, auth, reports

router = APIRouter()
router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
router.include_router(reports.router, prefix="/reports", tags=["Reports"])
router.include_router(upload.router, prefix="/upload", tags=["Upload"])
router.include_router(analyzer.router, prefix="/analyzer", tags=["Analyzer"])
router.include_router(insights.router, prefix="/insights", tags=["Insights"])
router.include_router(export.router, prefix="/export", tags=["Export"])