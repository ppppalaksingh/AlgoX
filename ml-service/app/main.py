from fastapi import FastAPI
from dotenv import load_dotenv
from app.routers import gap_analysis, recommendation, quiz_generation, mentor, admin

load_dotenv()

app = FastAPI(title="AlgoX Official Statistics AI & ML Engine")

app.include_router(gap_analysis.router)
app.include_router(recommendation.router)
app.include_router(quiz_generation.router)
app.include_router(mentor.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {
        "status": "AlgoX Official Statistics AI & ML Engine running",
        "system": "MoSPI / NSSTA / iGOT Karmayogi Capacity Building"
    }