from fastapi import APIRouter
from app.schemas.schemas import QuizGenerationRequest
from app.services.quiz_generator import generate_quiz_from_text

router = APIRouter()

@router.post("/generate-quiz")
def generate_quiz(req: QuizGenerationRequest):
    return generate_quiz_from_text(req.text, req.numQuestions)