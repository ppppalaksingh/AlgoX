import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: "MoSPI Administrator" },
    designation: { type: String, default: "Director General / Capacity Building Head" },
    department: { type: String, default: "MoSPI Training Division & NSSTA" },
    permissions: {
      type: [String],
      default: ["view_all_officials", "assign_training", "export_reports", "view_heatmaps"],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
