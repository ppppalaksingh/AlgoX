from pydantic import BaseModel
from typing import List, Optional, Any

class UserProfileInput(BaseModel):
    designation: str
    department: Optional[str] = None
    experienceYears: Optional[int] = 0
    qualifications: Optional[List[str]] = []
    pastTrainings: Optional[List[str]] = []
    quizAttempts: Optional[List[dict]] = []
    completedCourses: Optional[List[str]] = []

class SkillGap(BaseModel):
    skillName: str
    currentLevel: float
    requiredLevel: float
    gap: float
    percent: Optional[int] = None
    status: Optional[str] = None

class GapAnalysisResponse(BaseModel):
    matchedDesignation: Optional[str] = None
    department: Optional[str] = None
    experienceYears: Optional[int] = None
    overallReadiness: Optional[int] = 80
    domainScores: dict
    domainTargets: Optional[dict] = None
    domainPercentages: Optional[dict] = None
    skillGaps: List[SkillGap]
    subCompetencies: Optional[List[dict]] = None
    highestGap: Optional[dict] = None
    topStrength: Optional[dict] = None
    aiExecutiveInsight: Optional[str] = None

class RecommendationRequest(BaseModel):
    domainScores: Optional[dict] = None
    skillGaps: Optional[List[SkillGap]] = []
    sourceFilter: Optional[str] = None
    domainFilter: Optional[str] = None
    topN: Optional[int] = 12

class QuizGenerationRequest(BaseModel):
    text: str
    numQuestions: Optional[int] = 5

class MentorChatRequest(BaseModel):
    query: str
    history: Optional[List[dict]] = []