import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dn3zxpqof",
  api_key: process.env.CLOUDINARY_API_KEY || "652771478956578",
  api_secret: process.env.CLOUDINARY_API_SECRET || "kRDhklKb367K0O3zyHrCqwfUt6k",
});

async function createFolderAndUploadSample() {
  console.log("Connecting to Cloudinary...");
  console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);

  try {
    // 1. Create the folder explicitly
    const folderRes = await cloudinary.api.create_folder("algox_learning_docs");
    console.log("[SUCCESS] Folder Created/Verified:", folderRes);
  } catch (err) {
    console.log("[NOTE] Folder creation note:", err?.error?.message || err?.message || JSON.stringify(err));
  }

  try {
    const sampleSvgData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

    const uploadRes = await cloudinary.uploader.upload(sampleSvgData, {
      folder: "algox_learning_docs",
      public_id: "MoSPI_Official_Statistics_Cover",
      resource_type: "image",
      overwrite: true,
    });

    console.log("\n=======================================================");
    console.log("🎉 SUCCESS! File uploaded to Cloudinary!");
    console.log("Folder: algox_learning_docs");
    console.log("Secure URL:", uploadRes.secure_url);
    console.log("=======================================================");
  } catch (err) {
    console.error("Upload error:", err?.error?.message || err?.message || JSON.stringify(err));
  }
}

createFolderAndUploadSample();
