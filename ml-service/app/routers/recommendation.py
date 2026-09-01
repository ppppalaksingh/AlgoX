from fastapi import APIRouter
from app.schemas.schemas import RecommendationRequest
from app.services.recommendation_engine import recommend_courses

router = APIRouter()

@router.post("/recommendations")
def recommendations(req: RecommendationRequest):
    courses = recommend_courses([g.dict() for g in req.skillGaps], top_n=12)
    return {"recommendedCourses": courses}