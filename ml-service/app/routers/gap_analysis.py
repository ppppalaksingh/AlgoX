from fastapi import APIRouter
from app.schemas.schemas import UserProfileInput, GapAnalysisResponse
from app.services.gap_logic import run_gap_analysis

router = APIRouter()

@router.post("/gap-analysis", response_model=GapAnalysisResponse)
def gap_analysis(profile: UserProfileInput):
    result = run_gap_analysis(profile.dict())
    return result