import csv
import json
import os
import random

DATA_DIR = os.path.dirname(__file__)

# 1. Load Competencies
with open(os.path.join(DATA_DIR, "mospi_competencies.json"), "r", encoding="utf-8") as f:
    competencies = json.load(f)

# 2. Load Employees
with open(os.path.join(DATA_DIR, "mospi_employees_3000.json"), "r", encoding="utf-8") as f:
    employees = json.load(f)

# 3. Load Courses
with open(os.path.join(DATA_DIR, "mospi_courses_catalog.json"), "r", encoding="utf-8") as f:
    courses = json.load(f)

random.seed(42)

csv_path = os.path.join(DATA_DIR, "competency_scores_and_gaps.csv")
rows = []

for emp in employees:
    exp = emp["experience_years"]
    sen = emp["seniority_level"]
    dept = emp["department"]
    desig = emp["designation"]

    # Sample 15 competencies for this official
    sampled_comps = random.sample(competencies, 15)
    for comp in sampled_comps:
        cid = comp["competency_id"]
        cname = comp["competency"]
        cdomain = comp["domain"]

        # Core determination
        is_core = (cdomain == "Statistical" and ("CSO" in dept or "NSSO" in dept or "Accounts" in dept or "Price" in dept)) or \
                  (cdomain == "Technical" and "Data" in dept) or \
                  (sen >= 7 and cdomain == "Behavioural")
        
        # Calculate target based on seniority and core
        base_target = 2 if sen <= 2 else 3 if sen <= 5 else 4 if sen <= 7 else 5
        target = min(5, base_target + (1 if is_core else 0))

        # Calculate current score based on experience and qualification
        has_qual = (cname in emp["qualification"]) or (cdomain == "Statistical" and "Statistics" in emp["qualification"])
        base_curr = 1 if exp < 4 else 2 if exp < 10 else 3 if exp < 18 else 4
        current = min(5, max(1, base_curr + (1 if has_qual else 0) + random.choice([-1, 0, 1])))
        
        gap = max(0, target - current)
        is_gap = "Yes" if gap > 0 else "No"

        rows.append({
            "employee_id": emp["employee_id"],
            "competency_id": cid,
            "domain": cdomain,
            "competency": cname,
            "is_core_for_role": is_core,
            "current_score": current,
            "target_score": target,
            "gap": gap,
            "is_gap": is_gap
        })

with open(csv_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=[
        "employee_id", "competency_id", "domain", "competency",
        "is_core_for_role", "current_score", "target_score", "gap", "is_gap"
    ])
    writer.writeheader()
    writer.writerows(rows)

print(f"Generated {len(rows)} rows in competency_scores_and_gaps.csv successfully.")
