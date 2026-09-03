import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dn3zxpqof",
  api_key: process.env.CLOUDINARY_API_KEY || "652771478956578",
  api_secret: process.env.CLOUDINARY_API_SECRET || "kRDhklKb367K0O3zyHrCqwfUt6k",
});

const tempDir = path.join(process.cwd(), "temp_docs");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const resourcesToUpload = [
  {
    name: "MoSPI_Survey_Methodology_Training_Deck.pptx",
    content: `PRESCRIPTION TRAINING SLIDES: MoSPI Survey Methodology & Field Analytics
Slide 1: Institutional Architecture & Mandate (NSO, NSSTA, FOD)
Slide 2: Stratified Multi-Stage Sample Design (PSUs, Neyman Optimal Allocation)
Slide 3: Price Statistics & CPI Modified Laspeyres Model (Base 2012=100)
Slide 4: DPDP Act 2023 Compliance & Microdata Anonymization Protocols
Slide 5: Automated Scrutiny & Multiplier Weighting Rules`,
  },
  {
    name: "National_Statistical_Framework_MoSPI_2026.pdf",
    content: `NATIONAL STATISTICAL FRAMEWORK 2026 - MoSPI & NSSTA
Executive Summary: Quality Assurance, UN Fundamental Principles of Official Statistics,
SDMX Metadata Standard Guidelines, Cadre Competency Standards for ISS & SSS Officers.`,
  },
  {
    name: "DPDP_Act_Government_Data_Privacy_Standards.pdf",
    content: `DPDP ACT 2023 - STATISTICAL GOVERNANCE & DATA PRIVACY STANDARDS
Guidelines on k-anonymity (k>=5), l-diversity, AES-256 Cloud Encryption on MeghRaj,
Purpose limitation protocols for official surveys and administrative records.`,
  },
  {
    name: "Survey_Sampling_Methodology_NSO_Vol4.pdf",
    content: `SURVEY SAMPLING METHODOLOGY - NSO VOLUME 4
Handbook on Stratified Sampling, First Stage Units (Census Villages & UFS Blocks),
Design Effect (Deff) formulation, and CAPI Tablet Field Validation.`,
  },
];

async function uploadAll() {
  console.log("=== UPLOADING ALGOX DOCUMENTS TO CLOUDINARY ===");
  console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
  console.log("Target Folder: algox_learning_docs\n");

  const results = {};

  for (const item of resourcesToUpload) {
    const filePath = path.join(tempDir, item.name);
    fs.writeFileSync(filePath, item.content, "utf-8");

    try {
      const uploadRes = await cloudinary.uploader.upload(filePath, {
        folder: "algox_learning_docs",
        resource_type: "auto",
        public_id: item.name.replace(/\.[^/.]+$/, ""),
        overwrite: true,
      });

      console.log(`[SUCCESS] Uploaded: ${item.name}`);
      console.log(`          URL: ${uploadRes.secure_url}`);
      results[item.name] = uploadRes.secure_url;
    } catch (err) {
      console.error(`[ERROR] Failed to upload ${item.name}:`, err.message);
    }
  }

  console.log("\n=== ALL UPLOADS COMPLETED ===");
  console.log(JSON.stringify(results, null, 2));
}

uploadAll();
