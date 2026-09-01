from pydantic import BaseModel
from typing import List, Optional

class UserProfileInput(BaseModel):
    designation: str
    department: Optional[str] = None
    experienceYears: Optional[int] = 0
    qualifications: Optional[List[str]] = []
    pastTrainings: Optional[List[str]] = []

class SkillGap(BaseModel):
    skillName: str
    currentLevel: float
    requiredLevel: float
    gap: float

class GapAnalysisResponse(BaseModel):
    domainScores: dict
    skillGaps: List[SkillGap]

class RecommendationRequest(BaseModel):
    domainScores: dict
    skillGaps: List[SkillGap]

class QuizGenerationRequest(BaseModel):
    text: str
    numQuestions: Optional[int] = 5