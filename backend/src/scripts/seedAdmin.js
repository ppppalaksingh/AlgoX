import mongoose from "mongoose";
import dns from "dns";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Admin from "../models/Admin.model.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/algox";

// CLI arguments: node seedAdmin.js <clerkId> <email> <name>
const args = process.argv.slice(2);
const inputClerkId = args[0] || "admin_mospi_super";
const inputEmail = args[1] || "admin.training@mospi.gov.in";
const inputName = args[2] || "Dr. Rajesh K. Sharma (MoSPI Admin)";

async function seedAdmin() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI);
    console.log(">> Connected to MongoDB successfully.");

    // Check if admin already exists
    let admin = await Admin.findOne({
      $or: [{ clerkId: inputClerkId }, { email: inputEmail }],
    });

    if (admin) {
      admin.clerkId = inputClerkId;
      admin.email = inputEmail;
      admin.name = inputName;
      admin.isActive = true;
      await admin.save();
      console.log(`\n[SUCCESS] Updated existing Admin in database:`);
      console.log(` - Clerk ID:    ${admin.clerkId}`);
      console.log(` - Email:       ${admin.email}`);
      console.log(` - Name:        ${admin.name}`);
      console.log(` - Designation: ${admin.designation}`);
    } else {
      admin = await Admin.create({
        clerkId: inputClerkId,
        email: inputEmail,
        name: inputName,
        designation: "Director General / Capacity Building Head",
        department: "MoSPI Training Division & NSSTA",
        permissions: ["view_all_officials", "assign_training", "export_reports", "view_heatmaps"],
        isActive: true,
      });
      console.log(`\n[SUCCESS] Stored NEW Admin ID in database:`);
      console.log(` - Clerk ID:    ${admin.clerkId}`);
      console.log(` - Email:       ${admin.email}`);
      console.log(` - Name:        ${admin.name}`);
      console.log(` - Designation: ${admin.designation}`);
    }

    // List all authorized admins in DB
    const allAdmins = await Admin.find({ isActive: true });
    console.log(`\n-- Total Authorized Admins in Database: ${allAdmins.length} --`);
    allAdmins.forEach((a, idx) => {
      console.log(`  ${idx + 1}. [Clerk ID: ${a.clerkId}] ${a.name} <${a.email}> (${a.designation})`);
    });

    console.log("\nOnly these Admin IDs will have permission to view the MoSPI Admin Hub & all officials' data.\n");
  } catch (err) {
    console.error("[ERROR] Failed to seed Admin:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedAdmin();
