import os
import re
import json
import concurrent.futures
from dotenv import load_dotenv

load_dotenv()

SYSTEM_PROMPT = """You are "Karmayogi Sahayak" (AlgoX AI Statistical Mentor), an expert AI assistant dedicated to officers and analysts in India's Official Statistical System (Ministry of Statistics and Programme Implementation - MoSPI, NSSTA, NSSO, CSO, State DES, and iGOT Karmayogi).

You provide authoritative, clear, and actionable answers on:
1. Official Statistics Methodologies: Large-scale sample surveys, Stratified Sampling, Multi-stage design, Multipliers, National Accounts Statistics (SNA 2008 / GDP / GVA), Price Statistics (CPI / WPI), Labour Statistics (PLFS / Periodic Labour Force Survey), Industrial Statistics (ASI / IIP), SDG Indicators & National Indicator Framework (NIF).
2. Data Science & Programming: Python (pandas, numpy, statsmodels), R (survey package, dplyr, ggplot2), SQL, Stata, GIS / Spatial statistics, and data cleaning/scrutiny.
3. Digital Governance & Privacy: DPDP Act 2023, Government Cloud (MeghRaj), Digital Public Infrastructure (DPI), Metadata Standards.
4. iGOT Karmayogi & NSSTA TPAC Learning Pathways: Recommending relevant training courses and competency building steps.

Maintain a polite, professional, and knowledgeable tone. Use markdown headings, bullet points, and code blocks where helpful."""

STATISTICAL_KNOWLEDGE_BASE = {
    "plfs": r"""### Periodic Labour Force Survey (PLFS) Sampling Design

In India's Official Statistical System (MoSPI / NSSO), the **Periodic Labour Force Survey (PLFS)** adopts a **Stratified Multi-stage Design**:

1. **Sampling Frame:**
   - **Rural Areas:** 2011 Population Census villages.
   - **Urban Areas:** Latest Urban Frame Survey (UFS) blocks.

2. **First Stage Units (FSUs):**
   - The FSUs are villages in rural areas and UFS blocks in urban areas.
   - Selection is done by **Probability Proportional to Size with Replacement (PPSWR)** in rural areas and Simple Random Sampling without Replacement (SRSWOR) in urban areas.

3. **Second Stage Stratification (SSS):**
   - Within each selected FSU/Hamlet group/Sub-block, households are stratified based on educational attainment / household monthly income.

4. **Rotational Panel Scheme (Urban Areas):**
   - Urban FSUs follow a rotational 2-2-2 panel design (each selected household is visited 4 times over 4 successive quarters to measure short-term quarterly employment changes).
   - In rural areas, each selected household is surveyed only once annually.

5. **Estimation & Multipliers:**
   - Unbiased multipliers are calculated as inverse selection probabilities ($w_h = \frac{1}{P_h}$) to estimate national/state Worker Population Ratio (WPR) and Labour Force Participation Rate (LFPR).

**Recommended Learning Module:** *Handling Large Scale Data & PLFS Methodology (NSSTA / iGOT)*""",

    "cpi": r"""### Consumer Price Index (CPI) Compilation Methodology

The All-India Consumer Price Index (CPI) is compiled by MoSPI (Base Year 2012=100) across **Rural, Urban, and Combined** sectors:

1. **Formula Used:** **Modified Laspeyres Formula**:
   $$I_t = \sum \left( w_i \times \frac{P_{it}}{P_{i0}} \right) \div \sum w_i \times 100$$
   where $w_i$ is the item weight derived from the Consumer Expenditure Survey (CES), $P_{it}$ is current price, and $P_{i0}$ is base period price.

2. **Item Basket & Groups:**
   - Food and Beverages (~45.86% weight in Combined index)
   - Pan, Tobacco and Intoxicants
   - Clothing and Footwear
   - Housing (Urban only)
   - Fuel and Light
   - Miscellaneous (Health, Education, Transport, Communication)

3. **Price Quotation Collection:**
   - Web portals and mobile apps deployed by NSSO Field Operations Division (FOD) across 1,181 village markets and 1,114 urban markets weekly/monthly.

**Recommended Learning Module:** *Price Statistics and Index Number Methodology (MoSPI / NSSTA)*""",

    "sampling": r"""### Stratified Sampling & Survey Design in Official Statistics

In MoSPI surveys (NSSO, ASI, PLFS), sampling theory is applied to minimize sampling variance while optimizing fieldwork cost:

1. **Stratified Multi-Stage Sampling:**
   - **Stratification:** Dividing the population into homogeneous strata (e.g. Rural/Urban, Agro-climatic zones, District boundaries).
   - **First Stage Units (FSUs):** Primary census villages or urban frame survey (UFS) blocks.
   - **Ultimate Stage Units (USUs):** Sample households or manufacturing units.

2. **Neyman Optimal Allocation:**
   $$n_h = n \frac{N_h S_h}{\sum_{i} N_i S_i}$$
   where $N_h$ is stratum size and $S_h$ is stratum standard deviation.

3. **Design Effect (Deff):**
   $$\text{Deff} = \frac{\text{Var}_{\text{complex}}(\hat{\theta})}{\text{Var}_{\text{SRSWOR}}(\hat{\theta})} = 1 + (\bar{m} - 1)\rho$$
   where $\rho$ is the intra-cluster correlation coefficient.

**Recommended Action:** You can practice this directly in the **Virtual Statistical Lab** under the Stratified Sampling Simulator!""",

    "dpdp": r"""### Digital Personal Data Protection (DPDP) Act 2023 & Official Statistics

For officers handling government microdata, census schedules, and enterprise surveys:

1. **Data Principal & Fiduciary Obligations:**
   - MoSPI / State DES act as Data Fiduciaries, obligated to ensure data integrity and confidentiality.
2. **Anonymization & De-identification:**
   - All public microdata releases on the MoSPI Microdata Portal must strip Direct Identifiers (Names, Aadhaar, Phone Numbers, Exact GPS coordinates) and apply top/bottom coding on income/expenditure variables.
3. **Data Localization & MeghRaj Cloud:**
   - Official databases must reside on government-certified cloud infrastructure with strict Role-Based Access Control (RBAC).

**Recommended Learning Module:** *Data Privacy and DPDP Act in Governance (DSCI & iGOT)*""",

    "python": r"""### Python Script for Automated Survey Data Scrutiny

Here is a standard Python pandas script used for scrutinizing NSSO / household survey microdata:

```python
import pandas as pd
import numpy as np

# Load Survey Microdata Schedule
df = pd.read_csv("survey_schedule_microdata.csv")

# 1. Validation Rule: Age Consistency
invalid_heads = df[(df['relation_to_head'] == 1) & (df['age'] < 18)]
print(f"Flagged Head of Household under 18: {len(invalid_heads)} records")

# 2. Outlier Detection on Monthly Consumption Expenditure (MPCE)
mean_mpce = df['monthly_expenditure'].mean()
std_mpce = df['monthly_expenditure'].std()
outliers = df[df['monthly_expenditure'] > (mean_mpce + 3 * std_mpce)]
print(f"High-expenditure outliers (>3 std): {len(outliers)} records")

# 3. Income vs Expenditure Scrutiny
anomalies = df[df['monthly_expenditure'] > (df['monthly_income'] * 5)]
print(f"Severe deficit anomalies (Exp > 5x Income): {len(anomalies)} records")
```

**Recommended Learning Module:** *Python Training for Statisticians (C R Rao AIMSC / NSSTA)*""",

    "gdp": r"""### System of National Accounts (SNA 2008) & GVA Compilation

National Accounts Division (NAD) compiles Gross Value Added (GVA) at basic prices:

$$\text{GVA at Basic Prices} = \text{Compensation of Employees} + \text{Operating Surplus / Mixed Income} + \text{Consumption of Fixed Capital} + (\text{Production Taxes} - \text{Production Subsidies})$$

$$\text{GDP at Market Prices} = \sum \text{GVA at Basic Prices} + (\text{Product Taxes} - \text{Product Subsidies})$$

**Recommended Learning Module:** *National Accounts Statistics & SNA 2008 Guidelines (NSSTA)*"""
}

def _call_gemini_llm(clean_q: str, gemini_key: str):
    from google import genai
    client = genai.Client(api_key=gemini_key)
    prompt = f"{SYSTEM_PROMPT}\n\nUser Question: {clean_q}"
    for model_name in ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash']:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            if response and response.text:
                return response.text.strip()
        except Exception:
            continue
    return None

def answer_mentor_query(query: str, history: list = None) -> dict:
    if not query or len(query.strip()) == 0:
        return {"response": "How can I assist you with your statistical training or official data queries today?"}

    clean_q = query.strip()
    q_lower = clean_q.lower()

    # 1. Check direct instant matches from official knowledge base
    for key, text in STATISTICAL_KNOWLEDGE_BASE.items():
        if key in q_lower or (key == "plfs" and ("labour" in q_lower or "unemployment" in q_lower)) \
           or (key == "cpi" and ("price" in q_lower or "inflation" in q_lower)) \
           or (key == "sampling" and ("sample" in q_lower or "strata" in q_lower or "neyman" in q_lower)) \
           or (key == "dpdp" and ("privacy" in q_lower or "data protection" in q_lower)) \
           or (key == "python" and ("pandas" in q_lower or "scrutiny" in q_lower or "script" in q_lower)) \
           or (key == "gdp" and ("national accounts" in q_lower or "gva" in q_lower or "sna" in q_lower)):
            return {
                "response": text,
                "source": "MoSPI / NSSTA Knowledge Base"
            }

    # 2. Try Gemini with a strict 3.5s timeout thread
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        try:
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
                future = executor.submit(_call_gemini_llm, clean_q, gemini_key)
                llm_response = future.result(timeout=3.5)
                if llm_response:
                    return {
                        "response": llm_response,
                        "source": "Google Gemini 2.5 Flash (Official Statistics Knowledge)"
                    }
        except Exception as e:
            print(f"[ai_mentor] Instant fallback triggered: {e}")

    # 3. Default contextual guidance response
    return {
        "response": f"### Official Statistics Guidance\n\nRegarding **\"{clean_q}\"**:\n\n"
                    f"In India's Official Statistical System (MoSPI/NSSTA), standard protocols follow international UN-SDMX metadata standards, SNA 2008 National Accounts, and National Indicator Framework guidelines.\n\n"
                    f"- **Methodology Reference:** NSSTA In-service Training Manuals & NSSO Survey Instructions.\n"
                    f"- **Recommended Next Step:** Check your **Skill Gaps** tab to see your current competency level and explore the **NSSTA TPAC** training programs.\n\n"
                    f"You can also ask about **PLFS sampling design, CPI compilation, Python survey scrutiny, or DPDP Act 2023 compliance**!",
        "source": "AlgoX Statistical Engine"
    }
