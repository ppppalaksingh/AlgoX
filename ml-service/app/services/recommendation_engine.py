import json
import os
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
IGOT_PATH = os.path.join(DATA_DIR, "igot_courses_real.json")
TPAC_PATH = os.path.join(DATA_DIR, "tpac_training_programs.json")

# --- Load real iGOT Karmayogi courses ---------------------------------------
with open(IGOT_PATH) as f:
    igot_courses = json.load(f)
    for c in igot_courses:
        c["source_type"] = "iGOT"

# --- Load real NSSTA TPAC training programmes --------------------------------
with open(TPAC_PATH) as f:
    tpac_courses = json.load(f)
    for c in tpac_courses:
        c["source_type"] = "TPAC"

# Combined pool the recommendation engine searches over
COURSES = igot_courses + tpac_courses

# --- Load the pre-trained sentence embedding model ---------------------------
model = SentenceTransformer("all-MiniLM-L6-v2")

# Build one text blob per course for embedding.
# iGOT entries use "provider" (no long description exists in the source data);
# TPAC entries use "description". This handles both shapes safely.
def _course_text(c: dict) -> str:
    detail = c.get("description") or c.get("provider") or ""
    tags = " ".join(c.get("tags", []))
    return f"{c['title']} {detail} {tags}"

course_texts = [_course_text(c) for c in COURSES]
course_embeddings = model.encode(course_texts)


def recommend_courses(skill_gaps: list, top_n: int = 5) -> list:
    """
    Takes the list of skill gaps (as produced by gap_logic.py) and returns
    the top_n most semantically relevant courses, pulled from both the real
    iGOT catalog and real TPAC training programmes.
    """
    if not skill_gaps:
        return []

    # Build a single query string from the top 3 biggest skill gaps
    gap_query = " ".join(
        f"{g['skillName']} skill gap level {g['gap']}" for g in skill_gaps[:3]
    )
    query_embedding = model.encode([gap_query])

    similarities = cosine_similarity(query_embedding, course_embeddings)[0]
    ranked_indices = similarities.argsort()[::-1][:top_n]

    return [
        {**COURSES[i], "matchScore": round(float(similarities[i]), 3)}
        for i in ranked_indices
    ]