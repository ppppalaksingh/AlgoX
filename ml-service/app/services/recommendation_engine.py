import json
import os
import torch
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
CUSTOM_MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models", "custom_stats_embedder")
IGOT_PATH = os.path.join(DATA_DIR, "igot_courses_real.json")
TPAC_PATH = os.path.join(DATA_DIR, "tpac_training_programs.json")

# --- Load real iGOT Karmayogi courses ---------------------------------------
with open(IGOT_PATH, encoding="utf-8") as f:
    igot_courses = json.load(f)
    for c in igot_courses:
        c["source_type"] = "iGOT"
        if "institute" not in c:
            c["institute"] = c.get("provider", "iGOT Karmayogi")

# --- Load real NSSTA TPAC training programmes --------------------------------
with open(TPAC_PATH, encoding="utf-8") as f:
    tpac_courses = json.load(f)
    for c in tpac_courses:
        c["source_type"] = "TPAC"
        if "provider" not in c:
            c["provider"] = c.get("institute", "NSSTA / MoSPI")

# Combined pool the recommendation engine searches over
COURSES = igot_courses + tpac_courses

# --- Load Model: Use Fine-Tuned Custom Official Stats Embedder if present ---
if os.path.exists(CUSTOM_MODEL_DIR):
    print(f"[recommendation_engine] Loading Fine-Tuned Official Statistics Model from: {CUSTOM_MODEL_DIR}")
    model = SentenceTransformer(CUSTOM_MODEL_DIR)
else:
    print("[recommendation_engine] Loading Base Transformer: all-MiniLM-L6-v2")
    model = SentenceTransformer("all-MiniLM-L6-v2")

def _course_text(c: dict) -> str:
    detail = c.get("description") or c.get("provider") or ""
    tags = " ".join(c.get("tags", []))
    domain = c.get("domain", "")
    return f"{c['title']} {domain} {detail} {tags}"

course_texts = [_course_text(c) for c in COURSES]
course_embeddings = model.encode(course_texts)

def recommend_courses(skill_gaps: list, top_n: int = 8, source_filter: str = None, domain_filter: str = None) -> list:
    """
    Takes the list of skill gaps and returns the top_n most semantically relevant courses,
    pulled from both the real iGOT catalog and real NSSTA TPAC training programmes.
    """
    if not skill_gaps:
        filtered = COURSES
        if source_filter:
            filtered = [c for c in filtered if c.get("source_type") == source_filter]
        if domain_filter:
            filtered = [c for c in filtered if c.get("domain") == domain_filter]
        return filtered[:top_n]

    gap_query = " ".join(
        f"{g['skillName']} official statistics skill gap requirement level {g.get('gap', 2.0)}"
        for g in skill_gaps[:4]
    )
    query_embedding = model.encode([gap_query])

    similarities = cosine_similarity(query_embedding, course_embeddings)[0]
    
    scored_courses = []
    for idx, course in enumerate(COURSES):
        if source_filter and course.get("source_type") != source_filter:
            continue
        if domain_filter and domain_filter.lower() != "all" and course.get("domain", "").lower() != domain_filter.lower():
            continue
            
        score = float(similarities[idx])
        
        if skill_gaps and skill_gaps[0]["skillName"].lower() in course.get("domain", "").lower():
            score += 0.05
            
        scored_courses.append({
            **course,
            "matchScore": round(min(score, 0.98), 3),
            "matchPercent": int(round(min(score, 0.98) * 100))
        })

    scored_courses.sort(key=lambda x: x["matchScore"], reverse=True)
    return scored_courses[:top_n]

def get_all_catalog() -> list:
    return COURSES