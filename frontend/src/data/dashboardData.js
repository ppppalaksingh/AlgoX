import mospiCatalog from "./mospi_courses_catalog.json";

// ============================================================================
// DASHBOARD DATA & CONFIGURATION
// ============================================================================

export const currentUser = {
  name: "Statistical Officer",
  role: "Assistant Director",
  designation: "Assistant Director",
  post: "Statistical Officer",
  avatarUrl: "",
  notificationsCount: 3,
};

// Top summary cards
export const overviewStats = [
  {
    id: "overall-readiness",
    label: "Overall Cadre Readiness",
    value: "71.7%",
    caption: "Benchmarked against MoSPI Standards",
    icon: "TrendingUp",
    color: "blue",
    progress: 71.7,
  },
  {
    id: "courses-completed",
    label: "Accredited Modules",
    value: 0,
    caption: "0 in progress on iGOT & NSSTA",
    icon: "BookOpen",
    color: "orange",
  },
  {
    id: "learning-hours",
    label: "Verified Training Hours",
    value: "0h",
    caption: "Continuous Professional Development",
    icon: "Zap",
    color: "green",
  },
  {
    id: "certificates-earned",
    label: "Verified Certifications",
    value: 0,
    caption: "MoSPI & Karmayogi Accredited",
    icon: "Trophy",
    color: "purple",
  },
];

// Skill Gap Overview panel
export const skillGaps = [
  {
    id: "statistical",
    name: "Statistical Analysis",
    current: 2.6,
    target: 4.0,
    percent: 65,
    gap: 1.4,
    status: "Critical",
    icon: "BarChart3",
    color: "blue",
  },
  {
    id: "technical",
    name: "Technical & Analytics",
    current: 2.6,
    target: 3.5,
    percent: 74,
    gap: 0.9,
    status: "Moderate",
    icon: "Monitor",
    color: "orange",
  },
  {
    id: "digitalGovernance",
    name: "Digital Governance",
    current: 2.6,
    target: 3.5,
    percent: 74,
    gap: 0.9,
    status: "Moderate",
    icon: "PieChart",
    color: "green",
  },
  {
    id: "behavioural",
    name: "Behavioural & Leadership",
    current: 2.6,
    target: 3.5,
    percent: 74,
    gap: 0.9,
    status: "Moderate",
    icon: "MessageSquare",
    color: "purple",
  },
];

// Detailed skill gaps
export const detailedSkillGaps = [
  { id: "sg-1", skill: "Python for Data Scrutiny", domain: "Technical", currentLevel: 2.8, requiredLevel: 4.2, gap: 1.4 },
  { id: "sg-2", skill: "DPDP Act 2023 Compliance", domain: "Digital Governance", currentLevel: 3.0, requiredLevel: 4.0, gap: 1.0 },
  { id: "sg-3", skill: "GIS & Spatial Sampling", domain: "Technical", currentLevel: 2.2, requiredLevel: 3.8, gap: 1.6 },
  { id: "sg-4", skill: "National Accounts Base Year", domain: "Statistical", currentLevel: 3.4, requiredLevel: 4.2, gap: 0.8 },
];

// Recommended Learning Path panel
export const recommendedPath = {
  title: "Python for Official Statistics & Survey Analytics",
  description: "AI-recommended based on your highest technical competency gap in the National Statistical Office framework.",
  steps: [
    { id: 1, title: "Foundations of Python & Pandas for Surveys", description: "Data structures and microdata manipulation", completed: true },
    { id: 2, title: "Automated Data Scrutiny & Multipliers", description: "Detecting anomalies in NSSO/PLFS schedules", completed: false },
    { id: 3, title: "Statistical Estimation & Tabulation", description: "Computing national indicators & standard errors", completed: false },
    { id: 4, title: "Accredited Assessment & Evaluation", description: "Earn NSSTA-verified competency certification", completed: false },
  ],
};

// "Your Progress" donut widget
export const progressSummary = {
  month: "This Quarter",
  percent: 25,
  completed: 0,
  inProgress: 3,
  notStarted: 137,
};

// "Continue Learning" course cards
export const continueLearningCourses = [
  {
    id: "CRS0001",
    title: "SSS Induction Training Programme",
    tag: "In Progress",
    percent: 60,
    color: "blue",
    domain: "Statistical",
  },
  {
    id: "CRS0004",
    title: "Macroeconomic Diagnostics, Financial Programming and Policies",
    tag: "In Progress",
    percent: 35,
    color: "orange",
    domain: "Statistical",
  },
  {
    id: "CRS0003",
    title: "Ethics, Data Governance and Integrity in Public Service",
    tag: "In Progress",
    percent: 20,
    color: "green",
    domain: "Digital Governance",
  },
  {
    id: "CRS0005",
    title: "Applied Econometrics and Time Series Analysis",
    tag: "Available",
    percent: 0,
    color: "purple",
    domain: "Technical",
  },
];

// Sidebar navigation
export const sidebarNavItems = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { id: "admin-dashboard", label: "Admin Analytics", icon: "Building2", badge: "Org Hub" },
  { id: "competencies", label: "My Competencies", icon: "PieChart" },
  { id: "skill-gaps", label: "Skill Gaps", icon: "Target" },
  { id: "learning-path", label: "Learning Path", icon: "Route" },
  { id: "courses", label: "Courses & TPAC", icon: "BookOpen" },
  { id: "virtual-lab", label: "Virtual Statistical Lab", icon: "FlaskConical", badge: "Hands-on" },
  { id: "ai-quiz", label: "AI Quiz Generator", icon: "Sparkles" },
  { id: "ai-mentor", label: "Karmayogi Sahayak AI", icon: "Bot", badge: "24/7 AI" },
  { id: "progress", label: "Progress", icon: "BarChart2" },
  { id: "certificates", label: "Certificates", icon: "Award" },
  { id: "resources", label: "Resource Library", icon: "FolderOpen" },
  { id: "notifications", label: "Notifications", icon: "Bell" },
  { id: "profile", label: "Profile", icon: "User" },
  { id: "settings", label: "Settings", icon: "Settings" },
  { id: "help", label: "Help & Support", icon: "HelpCircle" },
];

const colorList = ["blue", "orange", "green", "purple"];

export const allCourses = (mospiCatalog || []).map((c, i) => {
  const isTPAC = c.source_platform?.includes("NSSTA") || c.source_platform?.includes("TPAC");
  const officialUrl = isTPAC ? "https://nssta.gov.in" : "https://portal.igotkarmayogi.gov.in/public/home";
  const matchScore = parseFloat(Math.max(0.65, 0.96 - (i * 0.002)).toFixed(3));
  const matchPercent = Math.max(68, Math.round(matchScore * 100));

  return {
    id: c.course_id || `CRS${i + 1}`,
    course_id: c.course_id,
    title: c.title,
    competency_id: c.competency_id,
    competency: c.competency || "",
    domain: c.domain || "Statistical",
    level: `Level ${c.difficulty_level || 3}`,
    duration_hours: c.duration_hours || 20,
    duration: `${c.duration_hours || 20} hours`,
    institute: c.source_platform || (isTPAC ? "NSSTA, Greater Noida" : "iGOT Karmayogi"),
    provider: c.source_platform || (isTPAC ? "NSSTA / MoSPI" : "iGOT Karmayogi"),
    source_platform: c.source_platform || (isTPAC ? "NSSTA" : "iGOT"),
    target_audience: c.target_audience || "Statistical Officers",
    percent: i === 0 ? 60 : i === 1 ? 35 : i === 2 ? 20 : 0,
    status: i < 3 ? "In Progress" : "Available",
    color: colorList[i % colorList.length],
    source_type: isTPAC ? "TPAC" : "iGOT",
    matchScore,
    matchPercent,
    similarityScore: matchScore,
    relevance: `${matchPercent}%`,
    designationRelevance: "MoSPI Capacity Building Framework",
    officialUrl,
    igotLink: officialUrl,
    description: `Official training in ${c.competency || c.title} (${c.domain || "Statistical"} domain) tailored for ${c.target_audience || "MoSPI statisticians"}.`,
  };
});

export const certificates = [];

export const competencyDomains = [
  { id: "statistical", name: "Statistical Analysis", current: 2.6, target: 4.0, percent: 65, status: "Critical", icon: "BarChart3", color: "blue" },
  { id: "technical", name: "Technical & Analytics", current: 2.6, target: 3.5, percent: 74, status: "Moderate", icon: "Monitor", color: "orange" },
  { id: "digitalGovernance", name: "Digital Governance", current: 2.6, target: 3.5, percent: 74, status: "Moderate", icon: "PieChart", color: "green" },
  { id: "behavioural", name: "Behavioural & Leadership", current: 2.6, target: 3.5, percent: 74, status: "Moderate", icon: "MessageSquare", color: "purple" },
];

export const progressHistory = [
  { month: "Nov", hours: 14, courses: 2 },
  { month: "Dec", hours: 22, courses: 3 },
  { month: "Jan", hours: 28, courses: 4 },
  { month: "Feb", hours: 32, courses: 5 },
  { month: "Mar", hours: 18, courses: 2 },
];
