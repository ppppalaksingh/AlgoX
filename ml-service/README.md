---
title: StatSkill Official Statistics AI & ML Engine
emoji: 🏛️
colorFrom: indigo
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
---

# StatSkill Official Statistics AI & ML Engine

Capacity building and competency telemetry AI microservice for **MoSPI**, **NSSTA**, and **iGOT Karmayogi**.

### Endpoints
- `GET /` — Health & System Check
- `POST /gap-analysis` — Cadre Monotonic Target & Skill Gap Evaluator
- `POST /recommendations` — Semantic Course Recommendations (Transformer + Cosine Similarity)
- `POST /generate-quiz` — In-Context Assessment Generation (MCQs with Explanations)
- `POST /chat` — Karmayogi Sahayak (AI Statistical Mentor)
- `GET /admin/analytics` — MoSPI Workforce Telemetry & Division Heatmaps
- `GET /catalog` — Unified MoSPI & NSSTA Course Catalog
