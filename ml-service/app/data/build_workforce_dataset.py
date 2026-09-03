import csv
import json
import os
import random

DATA_DIR = os.path.dirname(__file__)

# Load 33 Competencies
with open(os.path.join(DATA_DIR, "mospi_competencies.json"), "r", encoding="utf-8") as f:
    competencies = json.load(f)

# Load 140 Courses
with open(os.path.join(DATA_DIR, "mospi_courses_catalog.json"), "r", encoding="utf-8") as f:
    courses = json.load(f)

# Generate 3000 realistic Indian Statistical System workforce profiles
FIRST_NAMES = [
    "Krish", "Amaira", "Mitali", "Charan", "Anjali", "Nikita", "Anya", "Eta", "Maanas", "Harsh",
    "Joshua", "Darsh", "Kabir", "Viraj", "Yashvi", "Zaitra", "Gaurika", "Parth", "Ranveer", "Anvi",
    "Eshana", "Hitesh", "Neelima", "Siya", "Daniel", "Krishna", "Yash", "Vyanjana", "Aahana", "Mitali",
    "Rudra", "Falak", "Manan", "Gunbir", "Rushil", "Harini", "Aadi", "Vinaya", "Amaira", "Bahadurjit",
    "Dev", "Jeet", "Varsha", "Vedhika", "Mohammed", "Leela", "Lakshit", "Utkarsh", "Bhavini", "Timothy",
    "Yatin", "Dayamai", "Jagvi", "Hiral", "Tejas", "Imaran", "Bimala", "Ekaja", "Aarush", "Libni"
]

LAST_NAMES = [
    "Nath", "Narayanan", "Nazareth", "Ahluwalia", "Bains", "Samra", "Goswami", "Joshi", "Bhatt",
    "Balasubramanian", "Luthra", "Shroff", "Mody", "Rai", "Chacko", "Singh", "Borra", "Krishnan",
    "Chhabra", "Agrawal", "Bhatti", "Gupta", "Sidhu", "Kant", "Kaur", "Dara", "Shukla", "De",
    "Prabhu", "Sem", "Dasgupta", "Dani", "Chaudhary", "Gola", "Rao", "Taneja", "Bhasin", "Dhar",
    "Dubey", "Murthy", "Tella", "Mandal", "Chaudhuri", "Mukhopadhyay", "Khare", "Talwar", "Sandhu",
    "Mital", "Bali", "Mani", "Gill", "Lata", "Seth", "Seshadri", "Tripathi", "Tiwari", "Basak", "Kapoor"
]

DEPARTMENTS = [
    "Central Statistics Office (CSO)",
    "National Sample Survey Office (NSSO)",
    "National Accounts Division (NAD)",
    "Price Statistics Division (PSD)",
    "Economic Census Division (ECD)",
    "Social Statistics Division (SSD)",
    "Data Informatics & Innovation Division (DIID)",
    "State DES - Uttar Pradesh",
    "State DES - Maharashtra",
    "State DES - Karnataka",
    "State DES - Tamil Nadu",
    "State DES - Bihar"
]

DESIGNATIONS = [
    ("Junior Statistical Officer (JSO)", 1, (1.0, 5.0)),
    ("Statistical Officer (SO)", 2, (2.0, 9.0)),
    ("Senior Statistical Officer (SSO)", 3, (4.0, 14.0)),
    ("Assistant Director", 4, (6.0, 16.0)),
    ("Deputy Director", 5, (9.0, 19.0)),
    ("Joint Director", 6, (12.0, 24.0)),
    ("Director", 7, (15.0, 27.0)),
    ("Additional Director General", 8, (18.0, 30.0)),
    ("Director General", 9, (22.0, 34.0))
]

QUALIFICATIONS = [
    "B.Sc. Statistics", "M.Sc. Statistics", "M.Sc. Mathematics", "M.Sc. Data Science",
    "M.Tech Computer Science", "M.A. Economics", "MBA", "PhD Statistics"
]

STATES = [
    "West Bengal", "Maharashtra", "Karnataka", "Tamil Nadu", "Bihar", "Uttar Pradesh",
    "Rajasthan", "Gujarat", "Kerala", "Punjab", "Haryana", "Telangana", "Andhra Pradesh",
    "Madhya Pradesh", "Odisha", "Assam", "Jharkhand", "Chhattisgarh", "Uttarakhand", "Himachal Pradesh"
]

random.seed(42)

employees = []
for i in range(1, 3001):
    emp_id = f"EMP{i:05d}"
    fn = random.choice(FIRST_NAMES)
    ln = random.choice(LAST_NAMES)
    name = f"{fn} {ln}"
    
    desig_info = random.choice(DESIGNATIONS)
    desig = desig_info[0]
    seniority = desig_info[1]
    exp_range = desig_info[2]
    exp = round(random.uniform(exp_range[0], exp_range[1]), 1)
    
    dept = random.choice(DEPARTMENTS)
    qual = random.choice(QUALIFICATIONS)
    state = random.choice(STATES)
    join_year = 2026 - int(exp)
    join_date = f"{join_year:04d}-{random.randint(1,12):02d}-{random.randint(1,28):02d}"
    
    employees.append({
        "employee_id": emp_id,
        "name": name,
        "designation": desig,
        "department": dept,
        "seniority_level": seniority,
        "experience_years": exp,
        "qualification": qual,
        "join_date": join_date,
        "state": state
    })

# Save CSV
emp_csv_path = os.path.join(DATA_DIR, "employees.csv")
with open(emp_csv_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["employee_id", "name", "designation", "department", "seniority_level", "experience_years", "qualification", "join_date", "state"])
    writer.writeheader()
    writer.writerows(employees)

# Save JSON
emp_json_path = os.path.join(DATA_DIR, "mospi_employees_3000.json")
with open(emp_json_path, "w", encoding="utf-8") as f:
    json.dump(employees, f, indent=2)

print(f"Generated and saved {len(employees)} employee profiles in employees.csv & mospi_employees_3000.json.")

# Generate Enrollments
enrollments = []
statuses = ["Completed", "In Progress", "Dropped"]
status_weights = [0.65, 0.25, 0.10]

for emp in employees:
    # 2 to 6 enrollments per employee
    num_courses = random.randint(2, 6)
    selected_courses = random.sample(courses, num_courses)
    
    for crs in selected_courses:
        status = random.choices(statuses, weights=status_weights)[0]
        rating = round(random.uniform(2.0, 5.0), 1) if status == "Completed" else ""
        hours = round(random.uniform(2.0, 40.0), 1)
        enroll_date = f"202{random.randint(4,6)}-{random.randint(1,12):02d}-{random.randint(1,28):02d}"
        
        enrollments.append({
            "employee_id": emp["employee_id"],
            "course_id": crs["course_id"],
            "enrollment_date": enroll_date,
            "completion_status": status,
            "rating": rating,
            "time_spent_hours": hours
        })

enr_csv_path = os.path.join(DATA_DIR, "enrollments.csv")
with open(enr_csv_path, "w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["employee_id", "course_id", "enrollment_date", "completion_status", "rating", "time_spent_hours"])
    writer.writeheader()
    writer.writerows(enrollments)

enr_json_path = os.path.join(DATA_DIR, "mospi_enrollments_3000.json")
with open(enr_json_path, "w", encoding="utf-8") as f:
    json.dump(enrollments, f, indent=2)

print(f"Generated and saved {len(enrollments)} enrollment records in enrollments.csv & mospi_enrollments_3000.json.")
