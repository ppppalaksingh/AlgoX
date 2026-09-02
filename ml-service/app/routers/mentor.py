from fastapi import APIRouter
from app.schemas.schemas import MentorChatRequest
from app.services.ai_mentor import answer_mentor_query

router = APIRouter()

@router.post("/chat")
def chat(req: MentorChatRequest):
    result = answer_mentor_query(req.query, req.history)
    return result
