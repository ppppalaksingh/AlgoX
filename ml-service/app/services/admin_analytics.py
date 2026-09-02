import random

def get_admin_workforce_overview():
    """
    Returns organization-wide capacity building analytics for MoSPI, NSSTA & State DES.
    """
    return {
        "summary": {
            "totalOfficials": 4850,
            "activeLearners": 3920,
            "overallCompetencyScore": 74.5,
            "totalTrainingHours": 142800,
            "coursesCompleted": 18450,
            "certificationsIssued": 9620,
            "avgSkillGapReduction": "24.8%"
        },
        "cadres": [
            {
                "cadre": "Indian Statistical Service (ISS)",
                "headcount": 820,
                "avgCompetency": 82.4,
                "topSkillGap": "AI/ML in Governance",
                "completionRate": 88
            },
            {
                "cadre": "Subordinate Statistical Service (SSS)",
                "headcount": 2450,
                "avgCompetency": 71.8,
                "topSkillGap": "Python for Data Scrutiny",
                "completionRate": 79
            },
            {
                "cadre": "Data Processing Cadre (DPD)",
                "headcount": 680,
                "avgCompetency": 76.5,
                "topSkillGap": "Government Cloud (MeghRaj)",
                "completionRate": 84
            },
            {
                "cadre": "State DES Deputed Officers",
                "headcount": 900,
                "avgCompetency": 67.2,
                "topSkillGap": "Survey Sampling & Multipliers",
                "completionRate": 72
            }
        ],
        "domainAverages": {
            "statistical": 78.2,
            "technical": 65.4,
            "digitalGovernance": 71.0,
            "behavioural": 83.5
        },
        "heatmapData": [
            {"division": "Field Operations Division (FOD)", "statistical": 84, "technical": 58, "digitalGovernance": 64, "behavioural": 80, "criticalGap": "Mobile CAPI & Python"},
            {"division": "Data Processing Division (DPD)", "statistical": 72, "technical": 82, "digitalGovernance": 78, "behavioural": 74, "criticalGap": "Cloud Security"},
            {"division": "Survey Design & Research (SDRD)", "statistical": 91, "technical": 70, "digitalGovernance": 68, "behavioural": 82, "criticalGap": "AI Predictive Modeling"},
            {"division": "National Accounts Division (NAD)", "statistical": 89, "technical": 66, "digitalGovernance": 72, "behavioural": 85, "criticalGap": "Big Data SNA Integration"},
            {"division": "Economic Statistics Division (ESD)", "statistical": 86, "technical": 68, "digitalGovernance": 70, "behavioural": 81, "criticalGap": "Web-Scraping for CPI"}
        ],
        "predictiveForecast": [
            {
                "skill": "Generative AI & LLMs in Official Reports",
                "currentAdoption": "18%",
                "projectedDemand2027": "82%",
                "urgency": "High",
                "recommendedTPACProgram": "Training on Artificial Intelligence and Machine Learning (IIT Madras)"
            },
            {
                "skill": "GIS & Satellite Spatial Sampling",
                "currentAdoption": "32%",
                "projectedDemand2027": "78%",
                "urgency": "High",
                "recommendedTPACProgram": "GIS and Spatial Data Analysis (NSSTA)"
            },
            {
                "skill": "DPDP Act 2023 & Microdata Privacy",
                "currentAdoption": "45%",
                "projectedDemand2027": "95%",
                "urgency": "Critical",
                "recommendedTPACProgram": "Cybersecurity & Data Privacy (DSCI & iGOT)"
            },
            {
                "skill": "Automated Survey Scrutiny with Python/R",
                "currentAdoption": "40%",
                "projectedDemand2027": "88%",
                "urgency": "High",
                "recommendedTPACProgram": "Python Training for Statisticians (C R Rao AIMSC)"
            }
        ]
    }
