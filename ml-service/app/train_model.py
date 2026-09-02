"""
Official Statistics AI/ML Model Training Pipeline
===================================================
Dataset Sources:
- National Statistical Systems Training Academy (nssta.gov.in)
- Ministry of Statistics and Programme Implementation (mospi.gov.in)
- iGOT Karmayogi Course Repository (portal.igotkarmayogi.gov.in)

Trains a deep Transformer Encoder on official statistics datasets using PyTorch
AdamW optimizer and Cosine Similarity Loss to specialize embeddings for
Indian official statistical systems, survey schedules, and civil service curricula.
"""

import os
import sys

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

import json
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Dataset
from sentence_transformers import SentenceTransformer

DATASET_PATH = os.path.join(os.path.dirname(__file__), "data", "mospi_nssta_training_dataset.json")
OUTPUT_MODEL_DIR = os.path.join(os.path.dirname(__file__), "models", "custom_stats_embedder")

class OfficialStatsDataset(Dataset):
    def __init__(self, data_path):
        with open(data_path, "r", encoding="utf-8") as f:
            self.records = json.load(f)

    def __len__(self):
        return len(self.records)

    def __getitem__(self, idx):
        item = self.records[idx]
        return item["query"], item["target"], float(item["score"])

def train_and_save_model():
    print("=" * 75)
    print(">> AI/ML Fine-Tuning with nssta.gov.in & mospi.gov.in Official Datasets")
    print("=" * 75)

    # 1. Load Dataset
    print(f"[1/4] Ingesting MoSPI & NSSTA Dataset from: {DATASET_PATH}")
    dataset = OfficialStatsDataset(DATASET_PATH)
    dataloader = DataLoader(dataset, batch_size=4, shuffle=True)
    print(f"      Loaded {len(dataset)} verified official statistics training pairs.")

    # 2. Initialize Model
    base_model_name = "all-MiniLM-L6-v2"
    print(f"[2/4] Initializing Base Transformer: {base_model_name}...")
    model = SentenceTransformer(base_model_name)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    print(f"      Compute Engine: {device}")

    # 3. Setup Optimizer & Loss
    optimizer = torch.optim.AdamW(model.parameters(), lr=2.5e-5)
    loss_fn = nn.MSELoss()

    epochs = 4
    print(f"[3/4] Fine-tuning model over {epochs} epochs with CosineSimilarityLoss...")

    model.train()
    for epoch in range(1, epochs + 1):
        total_loss = 0.0
        for queries, targets, scores in dataloader:
            optimizer.zero_grad()

            # Tokenize & encode
            tokens_q = model.tokenizer(list(queries), padding=True, truncation=True, return_tensors="pt")
            tokens_q = {k: v.to(device) for k, v in tokens_q.items()}
            out_q = model(tokens_q)
            emb_q = out_q["sentence_embedding"]

            tokens_t = model.tokenizer(list(targets), padding=True, truncation=True, return_tensors="pt")
            tokens_t = {k: v.to(device) for k, v in tokens_t.items()}
            out_t = model(tokens_t)
            emb_t = out_t["sentence_embedding"]

            # Compute Cosine Similarity
            cos_sim = torch.cosine_similarity(emb_q, emb_t)
            target_scores = scores.to(dtype=torch.float32, device=device)

            loss = loss_fn(cos_sim, target_scores)
            loss.backward()
            optimizer.step()

            total_loss += loss.item()

        avg_loss = total_loss / len(dataloader)
        print(f"      Epoch {epoch}/{epochs} - Training Loss (MSE): {avg_loss:.5f}")

    # 4. Save Fine-Tuned Model
    print(f"[4/4] Saving Fine-Tuned Official Model Checkpoint to: {OUTPUT_MODEL_DIR}")
    os.makedirs(OUTPUT_MODEL_DIR, exist_ok=True)
    model.save(OUTPUT_MODEL_DIR)

    # 5. Evaluate Inference on Real nssta.gov.in & mospi.gov.in Queries
    print("\n-- Model Validation on Official Statistical Queries --")
    model.eval()
    test_cases = [
        ("NSSO Multi-stage cluster sampling and multipliers calculation", "Planning and Designing of Large Scale Sample Surveys (NSSTA, Greater Noida)"),
        ("Gross Value Added GVA and National Accounts compilation", "National Accounts Statistics & SNA 2008 Guidelines (NSSTA)"),
        ("All India CPI item basket and modified Laspeyres formula", "Price Statistics, CPI/WPI Methodology and Index Number Compilation (MoSPI / NSSTA)"),
        ("Python pandas script for automated survey schedule scrutiny", "Python Training for Statisticians (C R Rao AIMSC, Hyderabad)"),
        ("DPDP Act 2023 compliance for official microdata release", "Data Privacy and DPDP Act in Governance (Data Security Council of India & iGOT)"),
        ("Time Use Survey TUS and gender statistics", "Social Statistics, Gender Indicators and Time Use Survey Methodology (NSSTA)")
    ]

    for q, target in test_cases:
        with torch.no_grad():
            q_emb = model.encode([q], convert_to_tensor=True)
            t_emb = model.encode([target], convert_to_tensor=True)
            sim = float(torch.cosine_similarity(q_emb, t_emb)[0])
            print(f"  * Query: \"{q}\"")
            print(f"    Target: \"{target}\" -> Match Score: {sim:.4f} ({sim*100:.1f}%)")

    print("\n[SUCCESS] AI/ML Model Training on nssta.gov.in & mospi.gov.in Datasets Completed Successfully!")

if __name__ == "__main__":
    train_and_save_model()
