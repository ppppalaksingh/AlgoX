import json
import os
import re

DATA_DIR = os.path.dirname(__file__)

# 1. Competencies Definition
COMPETENCIES = [
    {"competency_id": "CMP001", "domain": "Statistical", "competency": "Survey Design"},
    {"competency_id": "CMP002", "domain": "Statistical", "competency": "Sampling Techniques"},
    {"competency_id": "CMP003", "domain": "Statistical", "competency": "National Accounts"},
    {"competency_id": "CMP004", "domain": "Statistical", "competency": "Price Statistics"},
    {"competency_id": "CMP005", "domain": "Statistical", "competency": "Labour Statistics"},
    {"competency_id": "CMP006", "domain": "Statistical", "competency": "Agricultural Statistics"},
    {"competency_id": "CMP007", "domain": "Statistical", "competency": "Industrial Statistics"},
    {"competency_id": "CMP008", "domain": "Statistical", "competency": "SDG Indicators"},
    {"competency_id": "CMP009", "domain": "Statistical", "competency": "Metadata Standards"},
    {"competency_id": "CMP010", "domain": "Statistical", "competency": "Data Quality Frameworks"},
    {"competency_id": "CMP011", "domain": "Technical", "competency": "Python"},
    {"competency_id": "CMP012", "domain": "Technical", "competency": "R Programming"},
    {"competency_id": "CMP013", "domain": "Technical", "competency": "SQL"},
    {"competency_id": "CMP014", "domain": "Technical", "competency": "Stata"},
    {"competency_id": "CMP015", "domain": "Technical", "competency": "SPSS"},
    {"competency_id": "CMP016", "domain": "Technical", "competency": "SAS"},
    {"competency_id": "CMP017", "domain": "Technical", "competency": "GIS"},
    {"competency_id": "CMP018", "domain": "Technical", "competency": "Data Visualization"},
    {"competency_id": "CMP019", "domain": "Technical", "competency": "AI/ML"},
    {"competency_id": "CMP020", "domain": "Technical", "competency": "Cloud Computing"},
    {"competency_id": "CMP021", "domain": "Technical", "competency": "APIs"},
    {"competency_id": "CMP022", "domain": "Technical", "competency": "Open Data"},
    {"competency_id": "CMP023", "domain": "Digital Governance", "competency": "Cybersecurity"},
    {"competency_id": "CMP024", "domain": "Digital Governance", "competency": "Data Privacy"},
    {"competency_id": "CMP025", "domain": "Digital Governance", "competency": "Digital Signatures"},
    {"competency_id": "CMP026", "domain": "Digital Governance", "competency": "Government Cloud"},
    {"competency_id": "CMP027", "domain": "Digital Governance", "competency": "Digital Public Infrastructure"},
    {"competency_id": "CMP028", "domain": "Behavioural", "competency": "Leadership"},
    {"competency_id": "CMP029", "domain": "Behavioural", "competency": "Communication"},
    {"competency_id": "CMP030", "domain": "Behavioural", "competency": "Project Management"},
    {"competency_id": "CMP031", "domain": "Behavioural", "competency": "Ethics"},
    {"competency_id": "CMP032", "domain": "Behavioural", "competency": "Decision Making"},
    {"competency_id": "CMP033", "domain": "Behavioural", "competency": "Change Management"}
]

# Write Competencies JSON
with open(os.path.join(DATA_DIR, "mospi_competencies.json"), "w", encoding="utf-8") as f:
    json.dump(COMPETENCIES, f, indent=2)

print("Saved mospi_competencies.json successfully.")
