from pydantic import BaseModel
from typing import List, Optional, Any, Union

class UserProfileInput(BaseModel):
    designation: str
    post: Optional[str] = "Statistical Officer"
    department: Optional[str] = None
    experienceYears: Optional[int] = 0
    experience_years: Optional[int] = None
    qualifications: Optional[List[str]] = []
    pastTrainings: Optional[List[str]] = []
    past_trainings: Optional[List[str]] = None
    quizAttempts: Optional[List[dict]] = []
    quiz_attempts: Optional[List[dict]] = None
    completedCourses: Optional[List[Any]] = []
    completed_courses: Optional[List[Any]] = None

class SkillGap(BaseModel):
    id: Optional[str] = None
    skillName: Optional[str] = None
    name: Optional[str] = None
    subCompetency: Optional[str] = None
    currentLevel: Optional[float] = 2.0
    requiredLevel: Optional[float] = 4.0
    gap: Optional[float] = 2.0
    percent: Optional[Union[int, float]] = None
    status: Optional[str] = None
    domain: Optional[str] = None
    competencyType: Optional[str] = None
    nsstaCategory: Optional[str] = None
    categoryCode: Optional[str] = None

    class Config:
        extra = "allow"

class GapAnalysisResponse(BaseModel):
    matchedDesignation: Optional[str] = None
    serviceCadre: Optional[str] = None
    department: Optional[str] = None
    post: Optional[str] = None
    experienceYears: Optional[int] = None
    overallReadiness: Optional[Union[int, float]] = 25
    roleProfile: Optional[dict] = None
    alignmentFlow: Optional[dict] = None
    benchmarkDisclaimer: Optional[str] = None
    domainScores: dict
    domainTargets: Optional[dict] = None
    domainPercentages: Optional[dict] = None
    skillGaps: List[SkillGap]
    subCompetencies: Optional[List[dict]] = None
    highestGap: Optional[Any] = None
    topStrength: Optional[Any] = None
    aiExecutiveInsight: Optional[str] = None

    class Config:
        extra = "allow"

class RecommendationRequest(BaseModel):
    designation: Optional[str] = None
    serviceCadre: Optional[str] = None
    post: Optional[str] = None
    domainScores: Optional[dict] = None
    skillGaps: Optional[List[Any]] = []
    sourceFilter: Optional[str] = None
    domainFilter: Optional[str] = None
    topN: Optional[int] = 140

    class Config:
        extra = "allow"

class QuizGenerationRequest(BaseModel):
    text: str
    numQuestions: Optional[int] = 5

class MentorChatRequest(BaseModel):
    query: str
    history: Optional[List[dict]] = []