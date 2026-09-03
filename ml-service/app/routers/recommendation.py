from fastapi import APIRouter
from app.schemas.schemas import RecommendationRequest
from app.services.recommendation_engine import recommend_courses, get_all_catalog

router = APIRouter()

@router.post("/recommendations")
def recommendations(req: RecommendationRequest):
    gaps = [g.dict() if hasattr(g, 'dict') else g for g in req.skillGaps] if req.skillGaps else []
    courses = recommend_courses(
        gaps,
        top_n=req.topN or 140,
        source_filter=req.sourceFilter,
        domain_filter=req.domainFilter
    )
    return {"recommendedCourses": courses}

@router.get("/catalog")
def full_catalog():
    return {"courses": get_all_catalog()}