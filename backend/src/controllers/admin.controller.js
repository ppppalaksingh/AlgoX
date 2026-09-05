import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Admin from "../models/Admin.model.js";
import User from "../models/User.model.js";
import CompetencyProfile from "../models/CompetencyProfile.model.js";
import { isUserAdmin, ADMIN_WHITELIST } from "../config/adminConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EMPLOYEES_PATH = path.join(__dirname, "../data/mospi_employees_3000.json");

let cachedEmployees = null;
function getEmployeesData() {
  if (!cachedEmployees && fs.existsSync(EMPLOYEES_PATH)) {
    try {
      cachedEmployees = JSON.parse(fs.readFileSync(EMPLOYEES_PATH, "utf-8"));
    } catch (e) {
      console.warn("Failed to load mospi_employees_3000.json:", e.message);
    }
  }
  return cachedEmployees || [];
}

const ML_BASE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

// Check if user is a verified Admin stored in database or adminConfig.js
export const checkAdminAccess = async (req, res) => {
  try {
    const clerkId = req.userId || req.query.clerkId || req.body?.clerkId;
    const email = req.query.email || req.body?.email;

    // 1. Check JS config whitelist first
    if (isUserAdmin(email) || isUserAdmin(clerkId)) {
      return res.json({
        isAdmin: true,
        role: "admin",
        admin: {
          clerkId: clerkId || "admin_saksham",
          email: email || "saksham4932@gmail.com",
          name: "Saksham (MoSPI Administrator)",
          designation: "Director General / Capacity Building Head",
          department: "MoSPI Training Division & NSSTA",
          permissions: ["view_all_officials", "assign_training", "export_reports", "view_heatmaps"],
        },
      });
    }

    // 2. Check MongoDB Admin collection
    const query = { isActive: true, $or: [] };
    if (clerkId) query.$or.push({ clerkId });
    if (email) query.$or.push({ email });

    if (query.$or.length > 0) {
      const admin = await Admin.findOne(query);
      if (admin) {
        return res.json({
          isAdmin: true,
          role: "admin",
          admin: {
            clerkId: admin.clerkId,
            email: admin.email,
            name: admin.name,
            designation: admin.designation,
            department: admin.department,
            permissions: admin.permissions,
          },
        });
      }
    }

    return res.json({
      isAdmin: false,
      role: "official",
      message: "User is an Official / Learner (Admin access restricted)",
    });
  } catch (err) {
    console.error("[admin.controller] checkAdminAccess error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Register a new Admin into MongoDB database
export const registerNewAdmin = async (req, res) => {
  try {
    const { clerkId, email, name, designation, department } = req.body;
    if (!clerkId || !email) {
      return res.status(400).json({ error: "clerkId and email are required" });
    }

    let admin = await Admin.findOne({ $or: [{ clerkId }, { email }] });
    if (admin) {
      admin.clerkId = clerkId;
      admin.email = email;
      admin.name = name || admin.name;
      admin.designation = designation || admin.designation;
      admin.department = department || admin.department;
      admin.isActive = true;
      await admin.save();
    } else {
      admin = await Admin.create({
        clerkId,
        email,
        name: name || "MoSPI Administrator",
        designation: designation || "Director General / Capacity Building Head",
        department: department || "MoSPI Training Division & NSSTA",
        permissions: ["view_all_officials", "assign_training", "export_reports", "view_heatmaps"],
        isActive: true,
      });
    }

    res.json({ success: true, message: "Admin registered in database", admin });
  } catch (err) {
    console.error("[admin.controller] registerNewAdmin error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Retrieve all 3,000 registered officials with competency and training profiles for Admin Drill-Down
export const getAllOfficialsData = async (req, res) => {
  try {
    const rawEmps = getEmployeesData();
    const dbUsers = await User.find({}).sort({ createdAt: -1 });
    const profiles = await CompetencyProfile.find({});

    // Map DB users first
    const dbOfficials = dbUsers.map((u) => {
      const prof = profiles.find((p) => String(p.userId) === String(u._id));
      const topGap = prof?.highestGap?.displayName || prof?.highestGap?.domain || "Python for Survey Scrutiny";
      const compScore = prof?.overallReadiness != null
        ? prof.overallReadiness
        : prof?.domainScores?.statistical
        ? Math.round(((prof.domainScores.statistical + prof.domainScores.technical + prof.domainScores.digitalGovernance + prof.domainScores.behavioural) / 20) * 100)
        : 75;

      return {
        id: String(u._id),
        employee_id: u.clerkId?.substring(0, 10) || "EMP-LIVE",
        name: u.name || "Official",
        email: u.email || `${u.name?.toLowerCase().replace(/\s+/g, ".")}@mospi.gov.in`,
        designation: u.designation || "Assistant Director",
        department: u.department || "National Statistical Office (NSO)",
        cadre: u.department?.includes("Field") ? "Field Operations Division (FOD)" : "Indian Statistical Service (ISS)",
        experienceYears: u.experienceYears || 0,
        state: "New Delhi",
        overallCompetency: compScore,
        domainScores: prof?.domainScores ? {
          statistical: Math.round((prof.domainScores.statistical / 5) * 100),
          technical: Math.round((prof.domainScores.technical / 5) * 100),
          digitalGovernance: Math.round((prof.domainScores.digitalGovernance / 5) * 100),
          behavioural: Math.round((prof.domainScores.behavioural / 5) * 100),
        } : { statistical: 80, technical: 65, digitalGovernance: 70, behavioural: 85 },
        topSkillGap: topGap,
        coursesCompleted: u.pastTrainings?.length || 0,
        status: "Active",
        isLiveUser: true,
        createdAt: u.createdAt,
      };
    });

    // Map 3000 employees dataset
    const datasetOfficials = rawEmps.map((emp) => {
      const baseScore = Math.min(94, Math.max(55, Math.round(50 + (emp.experience_years * 1.4) + (emp.seniority_level * 3.5))));
      return {
        id: emp.employee_id,
        employee_id: emp.employee_id,
        name: emp.name,
        email: `${emp.name.toLowerCase().replace(/[^a-z]/g, ".")}@mospi.gov.in`,
        designation: emp.designation,
        department: emp.department,
        cadre: emp.department.includes("NSSO") || emp.department.includes("Field") ? "Field Operations Division (FOD)" : emp.designation.includes("Junior") || emp.designation.includes("Senior") ? "Subordinate Statistical Service (SSS)" : "Indian Statistical Service (ISS)",
        experienceYears: emp.experience_years,
        qualification: emp.qualification,
        state: emp.state,
        overallCompetency: baseScore,
        domainScores: {
          statistical: Math.min(98, Math.max(60, baseScore + (emp.qualification.includes("Statistics") ? 6 : 0))),
          technical: Math.min(95, Math.max(45, baseScore - 4 + (emp.qualification.includes("Computer") || emp.qualification.includes("Data") ? 10 : 0))),
          digitalGovernance: Math.min(92, Math.max(50, baseScore - 2)),
          behavioural: Math.min(96, Math.max(60, baseScore + Math.round(emp.seniority_level * 1.5))),
        },
        topSkillGap: baseScore < 70 ? "Stratified Sampling & Multipliers" : "Python for Survey Scrutiny",
        coursesCompleted: Math.max(1, Math.round(emp.seniority_level * 1.5 + 2)),
        status: "Active",
      };
    });

    const allOfficials = [...dbOfficials, ...datasetOfficials];
    res.json({ officials: allOfficials, total: allOfficials.length });
  } catch (err) {
    console.error("[admin.controller] getAllOfficialsData error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getAdminAnalytics = async (req, res) => {
  try {
    let analyticsData;
    try {
      const { data } = await axios.get(`${ML_BASE_URL}/admin/analytics`);
      analyticsData = data;
    } catch (mlErr) {
      console.warn("[admin.controller] Fallback to built-in analytics data:", mlErr.message);
      analyticsData = {
        summary: {
          totalOfficials: 3000,
          activeLearners: 2840,
          overallCompetencyScore: 76.5,
          totalTrainingHours: 112800,
          coursesCompleted: 11958,
          certificationsIssued: 8420,
          avgSkillGapReduction: "26.4%"
        },
        cadres: [
          { cadre: "Indian Statistical Service (ISS)", headcount: 820, avgCompetency: 82.4, topSkillGap: "AI/ML in Governance", completionRate: 88 },
          { cadre: "Subordinate Statistical Service (SSS)", headcount: 1450, avgCompetency: 72.8, topSkillGap: "Python for Data Scrutiny", completionRate: 81 },
          { cadre: "Data Informatics & Innovation (DIID)", headcount: 380, avgCompetency: 78.5, topSkillGap: "Government Cloud (MeghRaj)", completionRate: 86 },
          { cadre: "State DES Deputed Officers", headcount: 350, avgCompetency: 68.2, topSkillGap: "Survey Sampling & Multipliers", completionRate: 74 }
        ],
        domainAverages: {
          statistical: 79.2,
          technical: 68.4,
          digitalGovernance: 72.0,
          behavioural: 84.5
        },
        heatmapData: [
          { division: "National Sample Survey Office (NSSO)", statistical: 86, technical: 62, digitalGovernance: 66, behavioural: 82, criticalGap: "Mobile CAPI & Python" },
          { division: "Data Informatics & Innovation (DIID)", statistical: 74, technical: 85, digitalGovernance: 80, behavioural: 76, criticalGap: "Cloud Security" },
          { division: "Central Statistics Office (CSO)", statistical: 92, technical: 72, digitalGovernance: 70, behavioural: 84, criticalGap: "AI Predictive Modeling" },
          { division: "National Accounts Division (NAD)", statistical: 91, technical: 68, digitalGovernance: 74, behavioural: 86, criticalGap: "Big Data SNA Integration" },
          { division: "Price Statistics Division (PSD)", statistical: 88, technical: 70, digitalGovernance: 72, behavioural: 82, criticalGap: "Web-Scraping for CPI" }
        ],
        predictiveForecast: [
          { skill: "Generative AI & LLMs in Official Reports", currentAdoption: "22%", projectedDemand2027: "85%", urgency: "High", recommendedTPACProgram: "Training on Artificial Intelligence and Machine Learning (IIT Madras)" },
          { skill: "GIS & Satellite Spatial Sampling", currentAdoption: "35%", projectedDemand2027: "80%", urgency: "High", recommendedTPACProgram: "GIS and Spatial Data Analysis (NSSTA)" },
          { skill: "DPDP Act 2023 & Microdata Privacy", currentAdoption: "48%", projectedDemand2027: "96%", urgency: "Critical", recommendedTPACProgram: "Cybersecurity & Data Privacy (DSCI & iGOT)" },
          { skill: "Automated Survey Scrutiny with Python/R", currentAdoption: "44%", projectedDemand2027: "90%", urgency: "High", recommendedTPACProgram: "Python Training for Statisticians (C R Rao AIMSC)" }
        ]
      };
    }

    res.json(analyticsData);
  } catch (err) {
    console.error("[admin.controller] error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
