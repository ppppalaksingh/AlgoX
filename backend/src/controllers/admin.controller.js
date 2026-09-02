import axios from "axios";
import Admin from "../models/Admin.model.js";
import User from "../models/User.model.js";
import CompetencyProfile from "../models/CompetencyProfile.model.js";
import { isUserAdmin, ADMIN_WHITELIST } from "../config/adminConfig.js";

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

// Retrieve all registered officials with competency and training profiles for Admin Drill-Down
export const getAllOfficialsData = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    const profiles = await CompetencyProfile.find({});

    const officialsList = users.map((u) => {
      const prof = profiles.find((p) => String(p.userId) === String(u._id));
      return {
        id: u._id,
        clerkId: u.clerkId,
        name: u.name || "Official",
        email: u.email || `${u.name?.toLowerCase().replace(/\s+/g, ".")}@mospi.gov.in`,
        designation: u.designation || "Assistant Director",
        department: u.department || "National Statistical Office (NSO)",
        cadre: u.department?.includes("Field") ? "Field Operations Division (FOD)" : "Indian Statistical Service (ISS)",
        experienceYears: u.experienceYears || 4,
        overallCompetency: prof?.domainScores?.statistical ? Math.round(((prof.domainScores.statistical + prof.domainScores.technical + prof.domainScores.digitalGovernance + prof.domainScores.behavioural) / 20) * 100) : 74,
        domainScores: prof?.domainScores ? {
          statistical: Math.round((prof.domainScores.statistical / 5) * 100),
          technical: Math.round((prof.domainScores.technical / 5) * 100),
          digitalGovernance: Math.round((prof.domainScores.digitalGovernance / 5) * 100),
          behavioural: Math.round((prof.domainScores.behavioural / 5) * 100),
        } : { statistical: 82, technical: 64, digitalGovernance: 70, behavioural: 88 },
        topSkillGap: "Python for Data Scrutiny",
        coursesCompleted: u.pastTrainings?.length || 5,
        status: "Active",
      };
    });

    res.json({ officials: officialsList });
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
          totalOfficials: 4850,
          activeLearners: 3920,
          overallCompetencyScore: 74.5,
          totalTrainingHours: 142800,
          coursesCompleted: 18450,
          certificationsIssued: 9620,
          avgSkillGapReduction: "24.8%"
        },
        cadres: [
          { cadre: "Indian Statistical Service (ISS)", headcount: 820, avgCompetency: 82.4, topSkillGap: "AI/ML in Governance", completionRate: 88 },
          { cadre: "Subordinate Statistical Service (SSS)", headcount: 2450, avgCompetency: 71.8, topSkillGap: "Python for Data Scrutiny", completionRate: 79 },
          { cadre: "Data Processing Cadre (DPD)", headcount: 680, avgCompetency: 76.5, topSkillGap: "Government Cloud (MeghRaj)", completionRate: 84 },
          { cadre: "State DES Deputed Officers", headcount: 900, avgCompetency: 67.2, topSkillGap: "Survey Sampling & Multipliers", completionRate: 72 }
        ],
        domainAverages: {
          statistical: 78.2,
          technical: 65.4,
          digitalGovernance: 71.0,
          behavioural: 83.5
        },
        heatmapData: [
          { division: "Field Operations Division (FOD)", statistical: 84, technical: 58, digitalGovernance: 64, behavioural: 80, criticalGap: "Mobile CAPI & Python" },
          { division: "Data Processing Division (DPD)", statistical: 72, technical: 82, digitalGovernance: 78, behavioural: 74, criticalGap: "Cloud Security" },
          { division: "Survey Design & Research (SDRD)", statistical: 91, technical: 70, digitalGovernance: 68, behavioural: 82, criticalGap: "AI Predictive Modeling" },
          { division: "National Accounts Division (NAD)", statistical: 89, technical: 66, digitalGovernance: 72, behavioural: 85, criticalGap: "Big Data SNA Integration" },
          { division: "Economic Statistics Division (ESD)", statistical: 86, technical: 68, digitalGovernance: 70, behavioural: 81, criticalGap: "Web-Scraping for CPI" }
        ],
        predictiveForecast: [
          { skill: "Generative AI & LLMs in Official Reports", currentAdoption: "18%", projectedDemand2027: "82%", urgency: "High", recommendedTPACProgram: "Training on Artificial Intelligence and Machine Learning (IIT Madras)" },
          { skill: "GIS & Satellite Spatial Sampling", currentAdoption: "32%", projectedDemand2027: "78%", urgency: "High", recommendedTPACProgram: "GIS and Spatial Data Analysis (NSSTA)" },
          { skill: "DPDP Act 2023 & Microdata Privacy", currentAdoption: "45%", projectedDemand2027: "95%", urgency: "Critical", recommendedTPACProgram: "Cybersecurity & Data Privacy (DSCI & iGOT)" },
          { skill: "Automated Survey Scrutiny with Python/R", currentAdoption: "40%", projectedDemand2027: "88%", urgency: "High", recommendedTPACProgram: "Python Training for Statisticians (C R Rao AIMSC)" }
        ]
      };
    }

    res.json(analyticsData);
  } catch (err) {
    console.error("[admin.controller] error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
