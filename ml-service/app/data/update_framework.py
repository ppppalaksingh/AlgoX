import json
import os

DATA_DIR = os.path.dirname(__file__)

FRAMEWORK = {
  "Director General": {
    "statistical": 4.8,
    "technical": 4.0,
    "digitalGovernance": 4.6,
    "behavioural": 4.9,
    "subCompetencies": {
      "Survey Design (CMP001)": 5.0,
      "Sampling Techniques (CMP002)": 5.0,
      "National Accounts (CMP003)": 5.0,
      "SDG Indicators (CMP008)": 5.0,
      "Data Quality Frameworks (CMP010)": 5.0,
      "Data Privacy (CMP024)": 4.8,
      "Government Cloud (CMP026)": 4.5,
      "Leadership (CMP028)": 5.0,
      "Communication (CMP029)": 5.0,
      "Project Management (CMP030)": 5.0,
      "Ethics (CMP031)": 5.0,
      "Decision Making (CMP032)": 5.0,
      "Change Management (CMP033)": 5.0
    }
  },
  "Additional Director General": {
    "statistical": 4.6,
    "technical": 4.1,
    "digitalGovernance": 4.4,
    "behavioural": 4.7,
    "subCompetencies": {
      "Survey Design (CMP001)": 4.8,
      "Sampling Techniques (CMP002)": 4.8,
      "National Accounts (CMP003)": 4.8,
      "Price Statistics (CMP004)": 4.8,
      "Labour Statistics (CMP005)": 4.8,
      "AI/ML (CMP019)": 4.0,
      "Cybersecurity (CMP023)": 4.4,
      "Data Privacy (CMP024)": 4.6,
      "Leadership (CMP028)": 4.8,
      "Communication (CMP029)": 4.8,
      "Project Management (CMP030)": 4.8,
      "Ethics (CMP031)": 5.0,
      "Decision Making (CMP032)": 4.8
    }
  },
  "Director": {
    "statistical": 4.5,
    "technical": 4.2,
    "digitalGovernance": 4.2,
    "behavioural": 4.5,
    "subCompetencies": {
      "Survey Design (CMP001)": 4.6,
      "Sampling Techniques (CMP002)": 4.6,
      "National Accounts (CMP003)": 4.6,
      "Price Statistics (CMP004)": 4.6,
      "Metadata Standards (CMP009)": 4.5,
      "Python (CMP011)": 4.0,
      "R Programming (CMP012)": 4.0,
      "Cybersecurity (CMP023)": 4.2,
      "Data Privacy (CMP024)": 4.4,
      "Leadership (CMP028)": 4.5,
      "Project Management (CMP030)": 4.6,
      "Ethics (CMP031)": 4.8
    }
  },
  "Joint Director": {
    "statistical": 4.3,
    "technical": 4.2,
    "digitalGovernance": 4.0,
    "behavioural": 4.3,
    "subCompetencies": {
      "Survey Design (CMP001)": 4.5,
      "Sampling Techniques (CMP002)": 4.5,
      "Price Statistics (CMP004)": 4.5,
      "Labour Statistics (CMP005)": 4.5,
      "Python (CMP011)": 4.2,
      "R Programming (CMP012)": 4.2,
      "GIS (CMP017)": 4.0,
      "Data Privacy (CMP024)": 4.0,
      "Leadership (CMP028)": 4.3,
      "Project Management (CMP030)": 4.4
    }
  },
  "Deputy Director": {
    "statistical": 4.2,
    "technical": 4.2,
    "digitalGovernance": 3.8,
    "behavioural": 4.0,
    "subCompetencies": {
      "Survey Design (CMP001)": 4.4,
      "Sampling Techniques (CMP002)": 4.4,
      "National Accounts (CMP003)": 4.2,
      "Price Statistics (CMP004)": 4.2,
      "Python (CMP011)": 4.2,
      "R Programming (CMP012)": 4.2,
      "SQL (CMP013)": 4.2,
      "Data Visualization (CMP018)": 4.2,
      "Government Cloud (CMP026)": 3.8,
      "Communication (CMP029)": 4.0,
      "Decision Making (CMP032)": 4.0
    }
  },
  "Assistant Director": {
    "statistical": 4.0,
    "technical": 3.8,
    "digitalGovernance": 3.5,
    "behavioural": 3.8,
    "subCompetencies": {
      "Survey Design (CMP001)": 4.2,
      "Sampling Techniques (CMP002)": 4.2,
      "National Accounts (CMP003)": 4.0,
      "Labour Statistics (CMP005)": 4.0,
      "Python (CMP011)": 3.8,
      "R Programming (CMP012)": 3.8,
      "SQL (CMP013)": 3.8,
      "Data Privacy (CMP024)": 3.6,
      "Leadership (CMP028)": 3.8,
      "Project Management (CMP030)": 3.8
    }
  },
  "Senior Statistical Officer (SSO)": {
    "statistical": 3.8,
    "technical": 3.6,
    "digitalGovernance": 3.2,
    "behavioural": 3.5,
    "subCompetencies": {
      "Survey Design (CMP001)": 4.0,
      "Sampling Techniques (CMP002)": 4.0,
      "Industrial Statistics (CMP007)": 3.8,
      "Python (CMP011)": 3.8,
      "R Programming (CMP012)": 3.6,
      "Data Visualization (CMP018)": 3.6,
      "Digital Signatures (CMP025)": 3.4,
      "Communication (CMP029)": 3.6,
      "Ethics (CMP031)": 4.0
    }
  },
  "Statistical Officer (SO)": {
    "statistical": 3.5,
    "technical": 3.4,
    "digitalGovernance": 3.0,
    "behavioural": 3.2,
    "subCompetencies": {
      "Survey Design (CMP001)": 3.6,
      "Sampling Techniques (CMP002)": 3.6,
      "Price Statistics (CMP004)": 3.5,
      "Python (CMP011)": 3.5,
      "SQL (CMP013)": 3.5,
      "Cybersecurity (CMP023)": 3.0,
      "Communication (CMP029)": 3.2,
      "Ethics (CMP031)": 3.5
    }
  },
  "Junior Statistical Officer (JSO)": {
    "statistical": 3.2,
    "technical": 3.2,
    "digitalGovernance": 2.8,
    "behavioural": 3.0,
    "subCompetencies": {
      "Survey Design (CMP001)": 3.5,
      "Sampling Techniques (CMP002)": 3.5,
      "Price Statistics (CMP004)": 3.2,
      "Python (CMP011)": 3.2,
      "SPSS (CMP015)": 3.2,
      "Digital Signatures (CMP025)": 3.0,
      "Communication (CMP029)": 3.0,
      "Ethics (CMP031)": 3.5
    }
  }
}

with open(os.path.join(DATA_DIR, "competency_framework.json"), "w", encoding="utf-8") as f:
    json.dump(FRAMEWORK, f, indent=2)

print("Updated competency_framework.json with all 33 official competency IDs and cadre standards.")
