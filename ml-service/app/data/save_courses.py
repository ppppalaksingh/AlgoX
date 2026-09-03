import json
import os
import csv
import io

DATA_DIR = os.path.dirname(__file__)

COURSES_RAW = """course_id,title,competency_id,domain,competency,target_audience,duration_hours,source_platform,difficulty_level
CRS0001,SSS Induction Training Programme,CMP001,Statistical,Survey Design,JSOs,25,NSSTA,5
CRS0002,Special Foundation Course (SFC),CMP028,Behavioural,Leadership,ISS Probationers,120,NSSTA/MCRHRD,3
CRS0003,"Ethics, Data Governance and Integrity in Public Service",CMP024,Digital Governance,Data Privacy,In-Service ISS Officers,20,NSSTA,3
CRS0004,"Macroeconomic Diagnostics, Financial Programming and Policies",CMP003,Statistical,National Accounts,ISS/IES Officers,60,IMF SARTTAC,5
CRS0005,Agricultural and Allied Statistics with Special Focus on Agriculture Surveys,CMP006,Statistical,Agricultural Statistics,ISS Probationary Officers,30,NSSTA/IASRI,4
CRS0006,Advanced Sampling Techniques with Practical Applications,CMP002,Statistical,Sampling Techniques,ISS/SSS Officers,25,NSSTA,3
CRS0007,Data Mining Techniques & Data Analytics,CMP019,Technical,AI/ML,ISS Officers,40,NSSTA,3
CRS0008,Training of Trainers (TOT) Programme,CMP029,Behavioural,Communication,University Faculty,20,NSSTA,3
CRS0009,Advanced Survey Design (Level 2),CMP001,Statistical,Survey Design,ISS Probationers,30,NSSTA/TPAC,2
CRS0010,Introduction to Survey Design (Level 3),CMP001,Statistical,Survey Design,JSOs,8,NSSTA,3
CRS0011,Practical Workshop on Survey Design (Level 4),CMP001,Statistical,Survey Design,JSOs,30,NSSTA,4
CRS0012,Digital Skills in Survey Design (Level 5),CMP001,Statistical,Survey Design,University Faculty,16,NSSTA/TPAC,5
CRS0013,Capacity Building in Sampling Techniques (Level 2),CMP002,Statistical,Sampling Techniques,State DES Officials,60,iGOT Karmayogi,2
CRS0014,Applied Sampling Techniques (Level 3),CMP002,Statistical,Sampling Techniques,University Faculty,20,iGOT Karmayogi,3
CRS0015,Applied Sampling Techniques (Level 4),CMP002,Statistical,Sampling Techniques,SSS Officers,60,iGOT Karmayogi,4
CRS0016,Advanced Sampling Techniques (Level 5),CMP002,Statistical,Sampling Techniques,ISS Probationers,24,iGOT Karmayogi,5
CRS0017,Foundations of National Accounts (Level 2),CMP003,Statistical,National Accounts,MTS/Field Staff,30,iGOT Karmayogi,2
CRS0018,Introduction to National Accounts (Level 3),CMP003,Statistical,National Accounts,All Officials,30,iGOT Karmayogi,3
CRS0019,Masterclass in National Accounts (Level 4),CMP003,Statistical,National Accounts,ISS Probationers,30,iGOT Karmayogi,4
CRS0020,Capacity Building in National Accounts (Level 5),CMP003,Statistical,National Accounts,MTS/Field Staff,30,NSSTA,5
CRS0021,Advanced Price Statistics (Level 2),CMP004,Statistical,Price Statistics,JSOs,40,NSSTA,2
CRS0022,Certificate Course in Price Statistics (Level 3),CMP004,Statistical,Price Statistics,ISS Probationers,60,NSSTA,3
CRS0023,Advanced Price Statistics (Level 4),CMP004,Statistical,Price Statistics,University Faculty,20,NSSTA/TPAC,4
CRS0024,Foundations of Price Statistics (Level 5),CMP004,Statistical,Price Statistics,In-Service ISS Officers,20,iGOT Karmayogi,5
CRS0025,Practical Workshop on Labour Statistics (Level 2),CMP005,Statistical,Labour Statistics,State DES Officials,40,iGOT Karmayogi,2
CRS0026,Capacity Building in Labour Statistics (Level 3),CMP005,Statistical,Labour Statistics,In-Service ISS Officers,30,NSSTA,3
CRS0027,Applied Labour Statistics (Level 4),CMP005,Statistical,Labour Statistics,All Officials,24,iGOT Karmayogi,4
CRS0028,Digital Skills in Labour Statistics (Level 5),CMP005,Statistical,Labour Statistics,SSS Officers,40,iGOT Karmayogi,5
CRS0029,Introduction to Agricultural Statistics (Level 2),CMP006,Statistical,Agricultural Statistics,SSS Officers,60,iGOT Karmayogi,2
CRS0030,Foundations of Agricultural Statistics (Level 3),CMP006,Statistical,Agricultural Statistics,University Faculty,20,iGOT Karmayogi,3
CRS0031,Practical Workshop on Agricultural Statistics (Level 4),CMP006,Statistical,Agricultural Statistics,MTS/Field Staff,16,NSSTA/TPAC,4
CRS0032,Masterclass in Agricultural Statistics (Level 5),CMP006,Statistical,Agricultural Statistics,All Officials,16,iGOT Karmayogi,5
CRS0033,Applied Industrial Statistics (Level 2),CMP007,Statistical,Industrial Statistics,SSS Officers,40,iGOT Karmayogi,2
CRS0034,Digital Skills in Industrial Statistics (Level 3),CMP007,Statistical,Industrial Statistics,State DES Officials,40,iGOT Karmayogi,3
CRS0035,Masterclass in Industrial Statistics (Level 4),CMP007,Statistical,Industrial Statistics,University Faculty,20,NSSTA,4
CRS0036,Applied Industrial Statistics (Level 5),CMP007,Statistical,Industrial Statistics,All Officials,8,iGOT Karmayogi,5
CRS0037,Advanced SDG Indicators (Level 2),CMP008,Statistical,SDG Indicators,In-Service ISS Officers,40,NSSTA,2
CRS0038,Masterclass in SDG Indicators (Level 3),CMP008,Statistical,SDG Indicators,ISS Probationers,24,NSSTA/TPAC,3
CRS0039,Capacity Building in SDG Indicators (Level 4),CMP008,Statistical,SDG Indicators,All Officials,30,iGOT Karmayogi,4
CRS0040,Digital Skills in SDG Indicators (Level 5),CMP008,Statistical,SDG Indicators,JSOs,40,iGOT Karmayogi,5
CRS0041,Digital Skills in Metadata Standards (Level 2),CMP009,Statistical,Metadata Standards,State DES Officials,60,iGOT Karmayogi,2
CRS0042,Advanced Metadata Standards (Level 3),CMP009,Statistical,Metadata Standards,State DES Officials,24,NSSTA,3
CRS0043,Hands-on Training on Metadata Standards (Level 4),CMP009,Statistical,Metadata Standards,JSOs,40,iGOT Karmayogi,4
CRS0044,Digital Skills in Metadata Standards (Level 5),CMP009,Statistical,Metadata Standards,In-Service ISS Officers,30,iGOT Karmayogi,5
CRS0045,Certificate Course in Data Quality Frameworks (Level 2),CMP010,Statistical,Data Quality Frameworks,SSS Officers,16,iGOT Karmayogi,2
CRS0046,Applied Data Quality Frameworks (Level 3),CMP010,Statistical,Data Quality Frameworks,JSOs,30,iGOT Karmayogi,3
CRS0047,Hands-on Training on Data Quality Frameworks (Level 4),CMP010,Statistical,Data Quality Frameworks,JSOs,8,iGOT Karmayogi,4
CRS0048,Certificate Course in Data Quality Frameworks (Level 5),CMP010,Statistical,Data Quality Frameworks,SSS Officers,8,NSSTA,5
CRS0049,Capacity Building in Python (Level 2),CMP011,Technical,Python,ISS Probationers,8,NSSTA/TPAC,2
CRS0050,Advanced Python (Level 3),CMP011,Technical,Python,In-Service ISS Officers,16,NSSTA/TPAC,3
CRS0051,Digital Skills in Python (Level 4),CMP011,Technical,Python,In-Service ISS Officers,20,iGOT Karmayogi,4
CRS0052,Capacity Building in Python (Level 5),CMP011,Technical,Python,University Faculty,16,iGOT Karmayogi,5
CRS0053,Practical Workshop on R Programming (Level 2),CMP012,Technical,R Programming,State DES Officials,24,iGOT Karmayogi,2
CRS0054,Hands-on Training on R Programming (Level 3),CMP012,Technical,R Programming,All Officials,8,NSSTA,3
CRS0055,Practical Workshop on R Programming (Level 4),CMP012,Technical,R Programming,ISS Probationers,20,iGOT Karmayogi,4
CRS0056,Capacity Building in R Programming (Level 5),CMP012,Technical,R Programming,SSS Officers,30,NSSTA,5
CRS0057,Introduction to SQL (Level 2),CMP013,Technical,SQL,ISS Probationers,40,iGOT Karmayogi,2
CRS0058,Practical Workshop on SQL (Level 3),CMP013,Technical,SQL,ISS Probationers,8,iGOT Karmayogi,3
CRS0059,Advanced SQL (Level 4),CMP013,Technical,SQL,SSS Officers,20,NSSTA/TPAC,4
CRS0060,Practical Workshop on SQL (Level 5),CMP013,Technical,SQL,In-Service ISS Officers,40,iGOT Karmayogi,5
CRS0061,Capacity Building in Stata (Level 2),CMP014,Technical,Stata,All Officials,16,NSSTA/TPAC,2
CRS0062,Masterclass in Stata (Level 3),CMP014,Technical,Stata,SSS Officers,8,iGOT Karmayogi,3
CRS0063,Masterclass in Stata (Level 4),CMP014,Technical,Stata,MTS/Field Staff,24,NSSTA/TPAC,4
CRS0064,Hands-on Training on Stata (Level 5),CMP014,Technical,Stata,JSOs,40,iGOT Karmayogi,5
CRS0065,Introduction to SPSS (Level 2),CMP015,Technical,SPSS,University Faculty,40,iGOT Karmayogi,2
CRS0066,Advanced SPSS (Level 3),CMP015,Technical,SPSS,SSS Officers,16,NSSTA,3
CRS0067,Digital Skills in SPSS (Level 4),CMP015,Technical,SPSS,All Officials,16,NSSTA/TPAC,4
CRS0068,Applied SPSS (Level 5),CMP015,Technical,SPSS,State DES Officials,24,NSSTA,5
CRS0069,Advanced SAS (Level 2),CMP016,Technical,SAS,All Officials,60,iGOT Karmayogi,2
CRS0070,Advanced SAS (Level 3),CMP016,Technical,SAS,JSOs,40,iGOT Karmayogi,3
CRS0071,Introduction to SAS (Level 4),CMP016,Technical,SAS,ISS Probationers,60,NSSTA,4
CRS0072,Applied SAS (Level 5),CMP016,Technical,SAS,University Faculty,24,NSSTA/TPAC,5
CRS0073,Practical Workshop on GIS (Level 2),CMP017,Technical,GIS,University Faculty,8,NSSTA,2
CRS0074,Masterclass in GIS (Level 3),CMP017,Technical,GIS,JSOs,24,iGOT Karmayogi,3
CRS0075,Hands-on Training on GIS (Level 4),CMP017,Technical,GIS,State DES Officials,24,iGOT Karmayogi,4
CRS0076,Hands-on Training on GIS (Level 5),CMP017,Technical,GIS,In-Service ISS Officers,16,iGOT Karmayogi,5
CRS0077,Practical Workshop on Data Visualization (Level 2),CMP018,Technical,Data Visualization,JSOs,30,iGOT Karmayogi,2
CRS0078,Introduction to Data Visualization (Level 3),CMP018,Technical,Data Visualization,MTS/Field Staff,8,iGOT Karmayogi,3
CRS0079,Capacity Building in Data Visualization (Level 4),CMP018,Technical,Data Visualization,All Officials,30,iGOT Karmayogi,4
CRS0080,Applied Data Visualization (Level 5),CMP018,Technical,Data Visualization,JSOs,30,iGOT Karmayogi,5
CRS0081,Applied AI/ML (Level 2),CMP019,Technical,AI/ML,ISS Probationers,30,iGOT Karmayogi,2
CRS0082,Practical Workshop on AI/ML (Level 3),CMP019,Technical,AI/ML,University Faculty,8,iGOT Karmayogi,3
CRS0083,Practical Workshop on AI/ML (Level 4),CMP019,Technical,AI/ML,JSOs,30,iGOT Karmayogi,4
CRS0084,Masterclass in AI/ML (Level 5),CMP019,Technical,AI/ML,MTS/Field Staff,20,NSSTA,5
CRS0085,Foundations of Cloud Computing (Level 2),CMP020,Technical,Cloud Computing,SSS Officers,20,NSSTA/TPAC,2
CRS0086,Applied Cloud Computing (Level 3),CMP020,Technical,Cloud Computing,State DES Officials,24,iGOT Karmayogi,3
CRS0087,Advanced Cloud Computing (Level 4),CMP020,Technical,Cloud Computing,JSOs,24,iGOT Karmayogi,4
CRS0088,Capacity Building in Cloud Computing (Level 5),CMP020,Technical,Cloud Computing,ISS Probationers,8,iGOT Karmayogi,5
CRS0089,Practical Workshop on APIs (Level 2),CMP021,Technical,APIs,State DES Officials,16,iGOT Karmayogi,2
CRS0090,Advanced APIs (Level 3),CMP021,Technical,APIs,SSS Officers,20,iGOT Karmayogi,3
CRS0091,Applied APIs (Level 4),CMP021,Technical,APIs,All Officials,60,iGOT Karmayogi,4
CRS0092,Certificate Course in APIs (Level 5),CMP021,Technical,APIs,JSOs,40,iGOT Karmayogi,5
CRS0093,Certificate Course in Open Data (Level 2),CMP022,Technical,Open Data,ISS Probationers,16,iGOT Karmayogi,2
CRS0094,Advanced Open Data (Level 3),CMP022,Technical,Open Data,ISS Probationers,40,iGOT Karmayogi,3
CRS0095,Applied Open Data (Level 4),CMP022,Technical,Open Data,State DES Officials,20,iGOT Karmayogi,4
CRS0096,Practical Workshop on Open Data (Level 5),CMP022,Technical,Open Data,MTS/Field Staff,16,iGOT Karmayogi,5
CRS0097,Digital Skills in Cybersecurity (Level 2),CMP023,Digital Governance,Cybersecurity,All Officials,20,iGOT Karmayogi,2
CRS0098,Advanced Cybersecurity (Level 3),CMP023,Digital Governance,Cybersecurity,University Faculty,60,iGOT Karmayogi,3
CRS0099,Introduction to Cybersecurity (Level 4),CMP023,Digital Governance,Cybersecurity,JSOs,20,NSSTA,4
CRS0100,Certificate Course in Cybersecurity (Level 5),CMP023,Digital Governance,Cybersecurity,In-Service ISS Officers,40,NSSTA/TPAC,5
CRS0101,Digital Skills in Data Privacy (Level 2),CMP024,Digital Governance,Data Privacy,University Faculty,30,iGOT Karmayogi,2
CRS0102,Advanced Data Privacy (Level 3),CMP024,Digital Governance,Data Privacy,ISS Probationers,40,NSSTA,3
CRS0103,Digital Skills in Data Privacy (Level 4),CMP024,Digital Governance,Data Privacy,JSOs,60,iGOT Karmayogi,4
CRS0104,Capacity Building in Data Privacy (Level 5),CMP024,Digital Governance,Data Privacy,In-Service ISS Officers,24,NSSTA,5
CRS0105,Introduction to Digital Signatures (Level 2),CMP025,Digital Governance,Digital Signatures,State DES Officials,20,iGOT Karmayogi,2
CRS0106,Foundations of Digital Signatures (Level 3),CMP025,Digital Governance,Digital Signatures,SSS Officers,40,NSSTA,3
CRS0107,Advanced Digital Signatures (Level 4),CMP025,Digital Governance,Digital Signatures,MTS/Field Staff,60,iGOT Karmayogi,4
CRS0108,Masterclass in Digital Signatures (Level 5),CMP025,Digital Governance,Digital Signatures,In-Service ISS Officers,16,NSSTA,5
CRS0109,Applied Government Cloud (Level 2),CMP026,Digital Governance,Government Cloud,University Faculty,8,NSSTA,2
CRS0110,Foundations of Government Cloud (Level 3),CMP026,Digital Governance,Government Cloud,University Faculty,60,NSSTA,3
CRS0111,Certificate Course in Government Cloud (Level 4),CMP026,Digital Governance,Government Cloud,In-Service ISS Officers,60,iGOT Karmayogi,4
CRS0112,Masterclass in Government Cloud (Level 5),CMP026,Digital Governance,Government Cloud,JSOs,60,NSSTA/TPAC,5
CRS0113,Practical Workshop on Digital Public Infrastructure (Level 2),CMP027,Digital Governance,Digital Public Infrastructure,SSS Officers,60,NSSTA/TPAC,2
CRS0114,Foundations of Digital Public Infrastructure (Level 3),CMP027,Digital Governance,Digital Public Infrastructure,State DES Officials,60,NSSTA,3
CRS0115,Practical Workshop on Digital Public Infrastructure (Level 4),CMP027,Digital Governance,Digital Public Infrastructure,JSOs,40,NSSTA,4
CRS0116,Masterclass in Digital Public Infrastructure (Level 5),CMP027,Digital Governance,Digital Public Infrastructure,MTS/Field Staff,20,iGOT Karmayogi,5
CRS0117,Certificate Course in Leadership (Level 2),CMP028,Behavioural,Leadership,MTS/Field Staff,40,iGOT Karmayogi,2
CRS0118,Masterclass in Leadership (Level 3),CMP028,Behavioural,Leadership,MTS/Field Staff,8,iGOT Karmayogi,3
CRS0119,Certificate Course in Leadership (Level 4),CMP028,Behavioural,Leadership,In-Service ISS Officers,30,iGOT Karmayogi,4
CRS0120,Introduction to Leadership (Level 5),CMP028,Behavioural,Leadership,ISS Probationers,30,NSSTA/TPAC,5
CRS0121,Foundations of Communication (Level 2),CMP029,Behavioural,Communication,MTS/Field Staff,24,iGOT Karmayogi,2
CRS0122,Digital Skills in Communication (Level 3),CMP029,Behavioural,Communication,ISS Probationers,24,iGOT Karmayogi,3
CRS0123,Practical Workshop on Communication (Level 4),CMP029,Behavioural,Communication,State DES Officials,8,NSSTA/TPAC,4
CRS0124,Introduction to Communication (Level 5),CMP029,Behavioural,Communication,SSS Officers,20,NSSTA/TPAC,5
CRS0125,Advanced Project Management (Level 2),CMP030,Behavioural,Project Management,MTS/Field Staff,30,iGOT Karmayogi,2
CRS0126,Advanced Project Management (Level 3),CMP030,Behavioural,Project Management,State DES Officials,30,iGOT Karmayogi,3
CRS0127,Masterclass in Project Management (Level 4),CMP030,Behavioural,Project Management,MTS/Field Staff,24,iGOT Karmayogi,4
CRS0128,Digital Skills in Project Management (Level 5),CMP030,Behavioural,Project Management,In-Service ISS Officers,16,NSSTA/TPAC,5
CRS0129,Masterclass in Ethics (Level 2),CMP031,Behavioural,Ethics,In-Service ISS Officers,30,iGOT Karmayogi,2
CRS0130,Certificate Course in Ethics (Level 3),CMP031,Behavioural,Ethics,University Faculty,30,iGOT Karmayogi,3
CRS0131,Certificate Course in Ethics (Level 4),CMP031,Behavioural,Ethics,State DES Officials,16,NSSTA/TPAC,4
CRS0132,Capacity Building in Ethics (Level 5),CMP031,Behavioural,Ethics,MTS/Field Staff,24,NSSTA/TPAC,5
CRS0133,Hands-on Training on Decision Making (Level 2),CMP032,Behavioural,Decision Making,SSS Officers,30,NSSTA/TPAC,2
CRS0134,Applied Decision Making (Level 3),CMP032,Behavioural,Decision Making,ISS Probationers,20,iGOT Karmayogi,3
CRS0135,Capacity Building in Decision Making (Level 4),CMP032,Behavioural,Decision Making,MTS/Field Staff,8,NSSTA,4
CRS0136,Certificate Course in Decision Making (Level 5),CMP032,Behavioural,Decision Making,SSS Officers,60,NSSTA,5
CRS0137,Applied Change Management (Level 2),CMP033,Behavioural,Change Management,JSOs,8,NSSTA,2
CRS0138,Hands-on Training on Change Management (Level 3),CMP033,Behavioural,Change Management,ISS Probationers,24,NSSTA/TPAC,3
CRS0139,Capacity Building in Change Management (Level 4),CMP033,Behavioural,Change Management,SSS Officers,40,NSSTA/TPAC,4
CRS0140,Hands-on Training on Change Management (Level 5),CMP033,Behavioural,Change Management,University Faculty,16,NSSTA,5"""

reader = csv.DictReader(io.StringIO(COURSES_RAW.strip()))
courses_list = list(reader)

with open(os.path.join(DATA_DIR, "mospi_courses_catalog.json"), "w", encoding="utf-8") as f:
    json.dump(courses_list, f, indent=2)

print(f"Saved {len(courses_list)} official MoSPI/iGOT courses to mospi_courses_catalog.json.")
