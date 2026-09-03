import os
import cloudinary
import cloudinary.uploader
from PIL import Image, ImageDraw, ImageFont

cloudinary.config(
    cloud_name="dn3zxpqof",
    api_key="882294463633199",
    api_secret="otA5ToRYhRvcewb0zRMHNv1c_X8",
    secure=True
)

output_dir = os.path.abspath("backend/temp_hd_images")
os.makedirs(output_dir, exist_ok=True)

docs = [
    {
        "id": "MoSPI_Survey_Methodology_Training_Deck",
        "title": "MoSPI Survey Methodology & Field Analytics",
        "subtitle": "Official Training Slide Deck - Indian Statistical Service (ISS & SSS)",
        "badge": "POWERPOINT PRESENTATION DECK",
        "badge_color": (245, 158, 11),
        "items": [
            "1. Multi-Stage Stratified Sampling: Rural Census Villages & Urban UFS Blocks.",
            "2. Neyman Optimal Allocation Formula: n_h = n * (N_h * S_h) / sum(N_i * S_i) minimizing variance.",
            "3. Consumer Price Index (CPI): Modified Laspeyres model across 1,181 rural & 1,114 urban markets.",
            "4. DPDP Act 2023 Compliance: k-anonymity (k>=5) and suppression of direct citizen identifiers.",
            "5. CAPI Computer-Assisted Interviewing: Real-time tablet outlier filters & scrutiny rules."
        ]
    },
    {
        "id": "National_Statistical_Framework_MoSPI_2026",
        "title": "National Statistical Framework 2026",
        "subtitle": "Ministry of Statistics and Programme Implementation (MoSPI & NSSTA)",
        "badge": "NATIONAL GOVERNANCE FRAMEWORK",
        "badge_color": (239, 68, 68),
        "items": [
            "1. UN Fundamental Principles of Official Statistics: Complete scientific independence & impartiality.",
            "2. National Quality Assurance Framework (NQAF): Standardized post-stratification multipliers.",
            "3. Cadre Competency Standards: Mandatory benchmark proficiencies for Assistant Directors & SSS.",
            "4. SDMX Metadata Architecture: Interoperability with IMF, World Bank, and UN SDG dashboards."
        ]
    },
    {
        "id": "DPDP_Act_Government_Data_Privacy_Standards",
        "title": "DPDP Act 2023 - Data Privacy & Governance",
        "subtitle": "MeitY & MoSPI Data Fiduciary Security Directives",
        "badge": "DIGITAL GOVERNANCE STANDARDS",
        "badge_color": (16, 185, 129),
        "items": [
            "1. Microdata Anonymization Protocols: Mandatory l-diversity and k-anonymity before public data release.",
            "2. MeghRaj Government Cloud Infrastructure: AES-256 encryption at rest and TLS 1.3 in transit.",
            "3. Purpose Limitation: Official survey records are protected against unauthorized administrative profiling.",
            "4. Periodic Security Audits: Annual vulnerability assessments empaneled by CERT-In."
        ]
    },
    {
        "id": "Survey_Sampling_Methodology_NSO_Vol4",
        "title": "Survey Sampling Methodology - NSO Volume 4",
        "subtitle": "Field Operations Division (FOD) & Survey Design Research Division (SDRD)",
        "badge": "OFFICIAL SURVEY HANDBOOK",
        "badge_color": (59, 130, 246),
        "items": [
            "1. Primary Sampling Units (PSUs): Selected using Probability Proportional to Size (PPSWR).",
            "2. Ultimate Stage Units (USUs): Sample households selected using Simple Random Sampling (SRSWOR).",
            "3. Design Effect (Deff): Measuring precision loss in multi-stage cluster sampling versus SRS.",
            "4. Quality Assurance Scrutiny: Consistency checks between demographic and employment schedules."
        ]
    }
]

def draw_hd_document(doc):
    W, H = 1400, 900
    img = Image.new("RGB", (W, H), color=(15, 23, 42)) # Slate 900
    draw = ImageDraw.Draw(img)

    # Inner Card background
    draw.rounded_rectangle([(40, 40), (W - 40, H - 40)], radius=24, fill=(30, 41, 59), outline=(51, 65, 85), width=2)

    # Badge
    draw.rounded_rectangle([(80, 80), (450, 125)], radius=20, fill=(30, 41, 59), outline=doc["badge_color"], width=2)
    draw.text((95, 93), doc["badge"], fill=doc["badge_color"])

    # Title
    draw.text((80, 160), doc["title"], fill=(255, 255, 255))
    draw.text((80, 210), doc["subtitle"], fill=(148, 163, 184))

    # Divider line
    draw.line([(80, 260), (W - 80, 260)], fill=(51, 65, 85), width=2)

    # Content Boxes
    y = 290
    for idx, item in enumerate(doc["items"]):
        draw.rounded_rectangle([(80, y), (W - 80, y + 80)], radius=14, fill=(15, 23, 42), outline=(51, 65, 85), width=1)
        draw.ellipse([(105, y + 30), (125, y + 50)], fill=doc["badge_color"])
        draw.text((145, y + 28), item, fill=(241, 245, 249))
        y += 95

    # Footer banner
    draw.rounded_rectangle([(80, H - 120), (W - 80, H - 65)], radius=14, fill=(37, 99, 235))
    draw.text((105, H - 100), "Ministry of Statistics & Programme Implementation (MoSPI) • NSSTA Verified Material • AlgoX Platform", fill=(255, 255, 255))

    file_path = os.path.join(output_dir, f"{doc['id']}.png")
    img.save(file_path, "PNG", quality=95)
    return file_path

print("=== GENERATING & UPLOADING REAL HD DOCUMENTS TO CLOUDINARY ===")
for doc in docs:
    path = draw_hd_document(doc)
    print(f"Generated local HD image: {path}")
    res = cloudinary.uploader.upload(
        path,
        folder="algox_learning_docs",
        public_id=doc["id"],
        resource_type="image",
        overwrite=True,
        invalidate=True
    )
    print(f"[SUCCESS] Uploaded {doc['id']}")
    print(f"          Live Cloudinary URL: {res['secure_url']}\n")

print("=== ALL 4 HD DOCUMENTS UPLOADED & LIVE ON CLOUDINARY! ===")
