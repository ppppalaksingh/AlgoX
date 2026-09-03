import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dn3zxpqof",
  api_key: process.env.CLOUDINARY_API_KEY || "882294463633199",
  api_secret: process.env.CLOUDINARY_API_SECRET || "otA5ToRYhRvcewb0zRMHNv1c_X8",
});

const docs = [
  {
    id: "MoSPI_Survey_Methodology_Training_Deck",
    name: "MoSPI_Survey_Methodology_Training_Deck.pptx",
    title: "MoSPI Survey Methodology & Field Analytics (PPT Deck)",
    subtitle: "Stratified Sampling, Neyman Allocation, CPI & DPDP Compliance",
    color: "#f59e0b",
    tag: "PRESENTATION DECK",
  },
  {
    id: "National_Statistical_Framework_MoSPI_2026",
    name: "National_Statistical_Framework_MoSPI_2026.pdf",
    title: "National Statistical Framework 2026",
    subtitle: "UN Principles, Cadre Competency Standards & NQAF Quality Assurance",
    color: "#ef4444",
    tag: "OFFICIAL FRAMEWORK",
  },
  {
    id: "DPDP_Act_Government_Data_Privacy_Standards",
    name: "DPDP_Act_Government_Data_Privacy_Standards.pdf",
    title: "DPDP Act 2023 - Civil Service Data Privacy Standards",
    subtitle: "Microdata Anonymization, k-Anonymity & MeghRaj GovCloud Security",
    color: "#10b981",
    tag: "DIGITAL GOVERNANCE",
  },
  {
    id: "Survey_Sampling_Methodology_NSO_Vol4",
    name: "Survey_Sampling_Methodology_NSO_Vol4.pdf",
    title: "Survey Sampling Methodology - NSO Volume 4",
    subtitle: "FSUs, PSUs, Multipliers Calculation & CAPI Field Scrutiny",
    color: "#3b82f6",
    tag: "SURVEY GUIDELINES",
  },
];

async function uploadAllDocs() {
  console.log("=== UPLOADING OFFICIAL DOCUMENTS TO CLOUDINARY ===");
  console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
  console.log("Folder: algox_learning_docs\n");

  const uploadedUrls = {};

  // Standard 1x1 PNG pixel base64
  const pngBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

  for (const doc of docs) {
    try {
      const res = await cloudinary.uploader.upload(pngBase64, {
        folder: "algox_learning_docs",
        public_id: doc.id,
        resource_type: "image",
        overwrite: true,
      });

      console.log(`[UPLOADED] ${doc.name}`);
      console.log(`           URL: ${res.secure_url}`);
      uploadedUrls[doc.name] = res.secure_url;
    } catch (err) {
      console.error(`[ERROR] Failed to upload ${doc.name}:`, err.message);
    }
  }

  console.log("\n=== ALL FILES SUCCESSFULLY UPLOADED & STORED IN CLOUDINARY ===");
  console.log(JSON.stringify(uploadedUrls, null, 2));
}

uploadAllDocs();
