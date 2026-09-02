from fastapi import APIRouter
from app.services.admin_analytics import get_admin_workforce_overview

router = APIRouter()

@router.get("/admin/analytics")
def admin_analytics():
    return get_admin_workforce_overview()
