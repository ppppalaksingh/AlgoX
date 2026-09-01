from fastapi import FastAPI
from dotenv import load_dotenv
from app.routers import gap_analysis, recommendation, quiz_generation

load_dotenv()

app = FastAPI(title="AlgoX ML Service")

app.include_router(gap_analysis.router)
app.include_router(recommendation.router)
app.include_router(quiz_generation.router)

@app.get("/")
def root():
    return {"status": "AlgoX ML service running"}