import csv
import json
import os
import random
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Dataset
from sentence_transformers import SentenceTransformer

DATA_DIR = os.path.dirname(__file__)
CSV_GAPS_PATH = os.path.join(DATA_DIR, "competency_scores_and_gaps.csv")
COURSES_PATH = os.path.join(DATA_DIR, "mospi_courses_catalog.json")
OUTPUT_TRAIN_JSON = os.path.join(DATA_DIR, "mospi_nssta_training_dataset.json")
OUTPUT_MODEL_DIR = os.path.join(DATA_DIR, "..", "models", "custom_stats_embedder")

# 1. Load Courses
with open(COURSES_PATH, "r", encoding="utf-8") as f:
    courses = json.load(f)

course_by_comp = {}
for c in courses:
    cid = c.get("competency_id", "")
    if cid not in course_by_comp:
        course_by_comp[cid] = []
    course_by_comp[cid].append(c)

# 2. Ingest Gaps from competency_scores_and_gaps.csv
training_pairs = []

# Base anchor pairs
ANCHOR_PAIRS = [
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
    {"query": "DPDP Act 2023 compliance and personal data privacy in official statistics", "target": "Ethics, Data Governance and Integrity in Public Service (NSSTA)", "score": 0.98},
    {"query": "Digital Personal Data Protection Act compliance and microdata anonymization", "target": "Digital Skills in Data Privacy and DPDP Act (iGOT Karmayogi)", "score": 0.98},
    {"query": "Cybersecurity best practices and phishing attack mitigation for civil servants", "target": "Certificate Course in Cybersecurity for Governance (NSSTA/TPAC)", "score": 0.97},
    {"query": "Digital signatures and secure e-Office workflows for ministry operations", "target": "Advanced Digital Signatures & e-Office Standards (iGOT Karmayogi)", "score": 0.95},
    {"query": "Digital Public Infrastructure DPI and unified governance architecture", "target": "Practical Workshop on Digital Public Infrastructure (NSSTA/TPAC)", "score": 0.96},
    {"query": "Leadership and field team management in large scale survey operations", "target": "Special Foundation Course (SFC) in Leadership (NSSTA/MCRHRD)", "score": 0.98},
    {"query": "Effective communication of official statistical reports to policy makers", "target": "Foundations of Evidence-Based Policy Communication (iGOT Karmayogi)", "score": 0.96},
    {"query": "Training of Trainers TOT methodology for statistical system capacity building", "target": "Training of Trainers (TOT) Programme (NSSTA)", "score": 0.97},
    {"query": "Public administration ethics and UN Fundamental Principles of Official Statistics", "target": "Masterclass in Ethics, Integrity and Statistical Values (iGOT Karmayogi)", "score": 0.98},
    {"query": "Decision making and change management in digital statistical transformation", "target": "Applied Change Management for Civil Services (NSSTA/TPAC)", "score": 0.95},
    {"query": "Project management methodologies for nation-wide census surveys", "target": "Masterclass in Project Management for Government Surveys (iGOT Karmayogi)", "score": 0.96}
]

training_pairs.extend(ANCHOR_PAIRS)

# Ingest distinct gap patterns from CSV
with open(CSV_GAPS_PATH, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    seen_patterns = set()
    
    for row in reader:
        if row.get("is_gap") == "Yes":
            cid = row.get("competency_id")
            cname = row.get("competency")
            domain = row.get("domain")
            target = row.get("target_score")
            gap = row.get("gap")
            
            pattern_key = f"{cid}_{target}_{gap}"
            if pattern_key not in seen_patterns:
                seen_patterns.add(pattern_key)
                
                # Link to matching courses for this competency
                matched_courses = course_by_comp.get(cid, [])
                for mc in matched_courses[:2]:
                    title = mc.get("title", "")
                    plat = mc.get("source_platform", "iGOT/NSSTA")
                    
                    q1 = f"Official skill gap in {cname} ({domain} domain) requiring target level {target} with deficit {gap}"
                    t1 = f"{title} [{plat}]"
                    training_pairs.append({"query": q1, "target": t1, "score": 0.96})
                    
                    q2 = f"Recommended training module for civil servant lacking proficiency in {cname}"
                    t2 = f"{title} ({plat})"
                    training_pairs.append({"query": q2, "target": t2, "score": 0.93})

# Save updated dataset
with open(OUTPUT_TRAIN_JSON, "w", encoding="utf-8") as f:
    json.dump(training_pairs, f, indent=2)

print(f"[1/4] Generated {len(training_pairs)} comprehensive training pairs from competency_scores_and_gaps.csv.")

# 3. Fine-Tune PyTorch Model
class StatsGapDataset(Dataset):
    def __init__(self, pairs):
        self.pairs = pairs

    def __len__(self):
        return len(self.pairs)

    def __getitem__(self, idx):
        item = self.pairs[idx]
        return item["query"], item["target"], float(item["score"])

dataset = StatsGapDataset(training_pairs)
dataloader = DataLoader(dataset, batch_size=8, shuffle=True)

print(f"[2/4] Initializing Base Model: all-MiniLM-L6-v2 on device CPU...")
model = SentenceTransformer("all-MiniLM-L6-v2")
device = torch.device("cpu")
model.to(device)

optimizer = torch.optim.AdamW(model.parameters(), lr=3e-5)
loss_fn = nn.MSELoss()

epochs = 4
print(f"[3/4] Training model over {epochs} epochs on full competency gaps dataset...")
model.train()

for epoch in range(1, epochs + 1):
    total_loss = 0.0
    for queries, targets, scores in dataloader:
        optimizer.zero_grad()
        tokens_q = model.tokenizer(list(queries), padding=True, truncation=True, return_tensors="pt")
        tokens_q = {k: v.to(device) for k, v in tokens_q.items()}
        emb_q = model(tokens_q)["sentence_embedding"]

        tokens_t = model.tokenizer(list(targets), padding=True, truncation=True, return_tensors="pt")
        tokens_t = {k: v.to(device) for k, v in tokens_t.items()}
        emb_t = model(tokens_t)["sentence_embedding"]

        cos_sim = torch.cosine_similarity(emb_q, emb_t)
        target_scores = scores.to(dtype=torch.float32, device=device)

        loss = loss_fn(cos_sim, target_scores)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()

    avg_loss = total_loss / len(dataloader)
    print(f"      Epoch {epoch}/{epochs} - Training Loss: {avg_loss:.5f}")

# 4. Save Fine-Tuned Model
print(f"[4/4] Saving newly fine-tuned model checkpoint to: {OUTPUT_MODEL_DIR}")
os.makedirs(OUTPUT_MODEL_DIR, exist_ok=True)
model.save(OUTPUT_MODEL_DIR)

print("\n-- Model Validation on Real Competency Gap Queries --")
model.eval()
test_cases = [
    ("Official skill gap in Survey Design (CMP001)", "Planning and Designing of Large Scale Sample Surveys [NSSTA]"),
    ("Official skill gap in National Accounts (CMP003)", "National Accounts Statistics & SNA 2008 Guidelines (NSSTA)"),
    ("Official skill gap in Python for Survey Scrutiny (CMP011)", "Digital Skills in Python for Survey Scrutiny (iGOT Karmayogi)"),
    ("Official skill gap in Data Privacy and DPDP Act (CMP024)", "Ethics, Data Governance and Integrity in Public Service (NSSTA)"),
    ("Official skill gap in Leadership (CMP028)", "Special Foundation Course (SFC) in Leadership (NSSTA/MCRHRD)")
]

for q, target in test_cases:
    with torch.no_grad():
        q_emb = model.encode([q], convert_to_tensor=True)
        t_emb = model.encode([target], convert_to_tensor=True)
        sim = float(torch.cosine_similarity(q_emb, t_emb)[0])
        print(f"  * Query: \"{q}\"")
        print(f"    Target: \"{target}\" -> Match Score: {sim:.4f} ({sim*100:.1f}%)")

print("\n[SUCCESS] AI Model Training with competency_scores_and_gaps.csv Completed Successfully!")
