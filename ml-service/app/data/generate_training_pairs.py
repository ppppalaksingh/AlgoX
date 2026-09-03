import json
import os

DATA_DIR = os.path.dirname(__file__)

with open(os.path.join(DATA_DIR, "mospi_courses_catalog.json"), "r", encoding="utf-8") as f:
    courses = json.load(f)

with open(os.path.join(DATA_DIR, "mospi_competencies.json"), "r", encoding="utf-8") as f:
    competencies = json.load(f)

comp_map = {c["competency_id"]: c for c in competencies}

training_pairs = []

# Core high-precision anchor pairs
ANCHOR_PAIRS = [
    # Statistical Core
    {"query": "Planning large scale multi-stage sample surveys and primary sampling units", "target": "Planning and Designing of Large Scale Sample Surveys (NSSTA Greater Noida)", "score": 0.98},
    {"query": "NSSO sample survey design questionnaire scrutiny and multiplier weights", "target": "Planning and Designing of Large Scale Sample Surveys (NSSTA)", "score": 0.96},
    {"query": "Gross Value Added GVA compilation and National Accounts SNA 2008 deflator", "target": "National Accounts Statistics & SNA 2008 Guidelines (NSSTA)", "score": 0.97},
    {"query": "Macroeconomic Diagnostics and Financial Programming for ISS Officers", "target": "Macroeconomic Diagnostics, Financial Programming and Policies (IMF SARTTAC)", "score": 0.95},
    {"query": "All India Consumer Price Index CPI basket and modified Laspeyres formula", "target": "Price Statistics, CPI/WPI Methodology and Index Number Compilation (MoSPI)", "score": 0.98},
    {"query": "Periodic Labour Force Survey PLFS activity status and unemployment rates", "target": "Applied Labour Statistics & PLFS Indicator Calculation (iGOT Karmayogi)", "score": 0.96},
    {"query": "Agricultural Census and crop yield estimation survey methodology", "target": "Agricultural and Allied Statistics with Special Focus on Agriculture Surveys (NSSTA/IASRI)", "score": 0.97},
    {"query": "Annual Survey of Industries ASI capital formation and industrial output", "target": "Applied Industrial Statistics & ASI Survey Compilation (iGOT Karmayogi)", "score": 0.95},
    {"query": "National Indicator Framework NIF and SDG target monitoring in India", "target": "Advanced SDG Indicators & Monitoring Frameworks (NSSTA/TPAC)", "score": 0.97},
    {"query": "SDMX statistical metadata standards and microdata cataloging", "target": "Hands-on Training on Metadata Standards and SDMX (iGOT Karmayogi)", "score": 0.96},
    {"query": "Data quality assessment frameworks and sampling error audits", "target": "Applied Data Quality Frameworks & Survey Scrutiny (iGOT Karmayogi)", "score": 0.95},

    # Technical Core
    {"query": "Python automated script for survey data scrutiny and CAPI validation", "target": "Digital Skills in Python for Survey Scrutiny (iGOT Karmayogi)", "score": 0.98},
    {"query": "Python pandas data cleaning for NSSO raw microdata records", "target": "Capacity Building in Python for Statisticians (NSSTA/TPAC)", "score": 0.97},
    {"query": "Handling large scale survey data and econometric estimation in R", "target": "Handling Large Scale Data & Data Analysis using R (IIT Kanpur / IASRI)", "score": 0.98},
    {"query": "R programming regression and factor analysis using live NSSO Census data", "target": "Practical Workshop on R Programming (iGOT Karmayogi)", "score": 0.96},
    {"query": "SQL relational database queries for official census records", "target": "Advanced SQL & Database Management for Civil Services (NSSTA/TPAC)", "score": 0.96},
    {"query": "Statistical analysis of microdata in Stata and econometric modeling", "target": "Masterclass in Stata for Economic Statistics (NSSTA/TPAC)", "score": 0.95},
    {"query": "SPSS survey tabulation and cross-tabulation of district statistics", "target": "Applied SPSS for Official Statistics (State DES)", "score": 0.95},
    {"query": "GIS spatial frame sampling and satellite remote sensing in official surveys", "target": "Hands-on Training on GIS and Spatial Sampling (iGOT Karmayogi)", "score": 0.97},
    {"query": "Interactive data visualization and official dashboard storytelling in Power BI", "target": "Applied Data Visualization for Official Reports (iGOT Karmayogi)", "score": 0.96},
    {"query": "Artificial intelligence and machine learning algorithms for predictive governance", "target": "Artificial Intelligence (AI) and Machine Learning (IIT Madras)", "score": 0.98},
    {"query": "Data mining techniques and anomaly detection in administrative databases", "target": "Data Mining Techniques & Data Analytics (NSSTA)", "score": 0.97},
    {"query": "MeghRaj Government Cloud computing architecture and deployment", "target": "Applied Government Cloud Computing (iGOT Karmayogi)", "score": 0.96},
    {"query": "Open data APIs for National Data and Analytics Platform NDAP", "target": "Applied APIs and Open Government Data (iGOT Karmayogi)", "score": 0.95},

    # Digital Governance Core
    {"query": "DPDP Act 2023 compliance and personal data privacy in official statistics", "target": "Ethics, Data Governance and Integrity in Public Service (NSSTA)", "score": 0.98},
    {"query": "Digital Personal Data Protection Act compliance and microdata anonymization", "target": "Digital Skills in Data Privacy and DPDP Act (iGOT Karmayogi)", "score": 0.98},
    {"query": "Cybersecurity best practices and phishing attack mitigation for civil servants", "target": "Certificate Course in Cybersecurity for Governance (NSSTA/TPAC)", "score": 0.97},
    {"query": "Digital signatures and secure e-Office workflows for ministry operations", "target": "Advanced Digital Signatures & e-Office Standards (iGOT Karmayogi)", "score": 0.95},
    {"query": "Digital Public Infrastructure DPI and unified governance architecture", "target": "Practical Workshop on Digital Public Infrastructure (NSSTA/TPAC)", "score": 0.96},

    # Behavioural Core
    {"query": "Leadership and field team management in large scale survey operations", "target": "Special Foundation Course (SFC) in Leadership (NSSTA/MCRHRD)", "score": 0.98},
    {"query": "Effective communication of official statistical reports to policy makers", "target": "Foundations of Evidence-Based Policy Communication (iGOT Karmayogi)", "score": 0.96},
    {"query": "Training of Trainers TOT methodology for statistical system capacity building", "target": "Training of Trainers (TOT) Programme (NSSTA)", "score": 0.97},
    {"query": "Public administration ethics and UN Fundamental Principles of Official Statistics", "target": "Masterclass in Ethics, Integrity and Statistical Values (iGOT Karmayogi)", "score": 0.98},
    {"query": "Decision making and change management in digital statistical transformation", "target": "Applied Change Management for Civil Services (NSSTA/TPAC)", "score": 0.95},
    {"query": "Project management methodologies for nation-wide census surveys", "target": "Masterclass in Project Management for Government Surveys (iGOT Karmayogi)", "score": 0.96}
]

training_pairs.extend(ANCHOR_PAIRS)

# Add all 140 courses paired with their mapped competencies
for crs in courses:
    cid = crs.get("competency_id", "")
    comp_obj = comp_map.get(cid, {})
    domain = crs.get("domain", comp_obj.get("domain", "Statistical"))
    comp_name = crs.get("competency", comp_obj.get("competency", "General"))
    title = crs.get("title", "")
    audience = crs.get("target_audience", "All Officials")
    platform = crs.get("source_platform", "iGOT Karmayogi / NSSTA")
    diff = crs.get("difficulty_level", "3")

    query_1 = f"Official training in {comp_name} ({domain} domain) for {audience}"
    target_1 = f"{title} [{platform}]"
    training_pairs.append({"query": query_1, "target": target_1, "score": 0.94})

    query_2 = f"How to improve {comp_name} skills for {domain} capacity building at level {diff}"
    target_2 = f"{title} ({platform})"
    training_pairs.append({"query": query_2, "target": target_2, "score": 0.92})

# Save comprehensive dataset
output_file = os.path.join(DATA_DIR, "mospi_nssta_training_dataset.json")
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(training_pairs, f, indent=2)

print(f"Generated {len(training_pairs)} high-quality training pairs in mospi_nssta_training_dataset.json.")
