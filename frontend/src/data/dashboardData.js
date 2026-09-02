// ============================================================================
// DASHBOARD DATA & CONFIGURATION
// ============================================================================

export const currentUser = {
  name: "Assistant Director",
  role: "Official",
  avatarUrl: "",
  notificationsCount: 3,
};

// Top summary cards
export const overviewStats = [
  {
    id: "overall-competency",
    label: "Overall Competency",
    value: "74%",
    caption: "MoSPI Official Framework",
    icon: "TrendingUp",
    color: "blue",
    progress: 74,
  },
  {
    id: "skills-identified",
    label: "Skills Mapped",
    value: 24,
    caption: "Across 4 domains",
    icon: "BookOpen",
    color: "green",
  },
  {
    id: "skills-to-improve",
    label: "Skill Gaps Identified",
    value: 4,
    caption: "Targeted for Q3 upskilling",
    icon: "Zap",
    color: "orange",
  },
  {
    id: "courses-completed",
    label: "iGOT / TPAC Completed",
    value: 8,
    caption: "Verified credentials",
    icon: "Trophy",
    color: "purple",
  },
];

// Skill Gap Overview panel
export const skillGaps = [
  {
    id: "statistical",
    name: "Statistical Analysis",
    percent: 82,
    status: "Strong",
    icon: "BarChart3",
    color: "blue",
  },
  {
    id: "technical",
    name: "Technical & Analytics",
    percent: 64,
    status: "Needs Improvement",
    icon: "Monitor",
    color: "orange",
  },
  {
    id: "digitalGovernance",
    name: "Digital Governance",
    percent: 70,
    status: "Average",
    icon: "PieChart",
    color: "green",
  },
  {
    id: "behavioural",
    name: "Behavioural & Leadership",
    percent: 88,
    status: "Strong",
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
  percent: 74,
  completed: 8,
  inProgress: 4,
  notStarted: 3,
};

// "Continue Learning" course cards
export const continueLearningCourses = [
  {
    id: "course-1",
    title: "Planning and Designing of Large Scale Sample Surveys",
    tag: "NSSTA TPAC",
    percent: 75,
    color: "blue",
    domain: "Statistical",
  },
  {
    id: "course-2",
    title: "Python Training for Statisticians",
    tag: "In Progress",
    percent: 45,
    color: "orange",
    domain: "Technical",
  },
  {
    id: "course-3",
    title: "Cybersecurity & DPDP Compliance in Government",
    tag: "iGOT Module",
    percent: 30,
    color: "green",
    domain: "Digital Governance",
  },
  {
    id: "course-4",
    title: "Leadership & Change Management for Civil Services",
    tag: "Completed",
    percent: 100,
    color: "purple",
    domain: "Behavioural",
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

export const allCourses = [
  {
    id: "tpac1",
    title: "Planning and Designing of Large Scale Sample Surveys",
    description: "Review of sample survey techniques, survey planning (frame, sampling scheme, sample size), questionnaire design, post-survey operations including field/computer scrutiny, multipliers, and report writing.",
    domain: "Statistical",
    level: "Advanced",
    duration: "One week",
    institute: "NSSTA, Greater Noida",
    percent: 100,
    status: "Completed",
    color: "blue",
    source_type: "TPAC"
  },
  {
    id: "tpac6",
    title: "Python Training for Statisticians",
    description: "Python fundamentals including data structures, file operations, exception handling, and data science packages (NumPy, pandas, matplotlib, seaborn, SciPy, statsmodels, scikit-learn) with hands-on model building.",
    domain: "Technical",
    level: "Intermediate",
    duration: "One week",
    institute: "C R Rao AIMSC, Hyderabad",
    percent: 45,
    status: "In Progress",
    color: "orange",
    source_type: "TPAC"
  },
  {
    id: "igot1",
    title: "Artificial Intelligence for Public Governance",
    description: "Concepts of AI/ML, generative AI applications, and ethical frameworks for public administration.",
    provider: "Kyndryl & DSCI",
    domain: "Technical",
    level: "Beginner",
    duration: "2h 42m",
    igotLink: "https://portal.igotkarmayogi.gov.in/app/toc/do_1144751221174108161801/overview",
    percent: 30,
    status: "In Progress",
    color: "green",
    source_type: "iGOT"
  },
  {
    id: "igot12",
    title: "Data Privacy and DPDP Act in Governance",
    description: "Digital Personal Data Protection Act 2023 guidelines, data principal rights, and data fiduciary responsibilities for official statistics.",
    provider: "Data Security Council of India",
    domain: "Digital Governance",
    level: "Beginner",
    duration: "1h 50m",
    percent: 100,
    status: "Completed",
    color: "purple",
    source_type: "iGOT"
  },
  {
    id: "tpac2",
    title: "Handling Large Scale Data & Data Analysis using R",
    description: "Practical orientation to data analysis in R including descriptive analysis, regression, logistic analysis, factor analysis, cluster analysis using live NSSO/Census data.",
    domain: "Technical",
    level: "Intermediate",
    duration: "One week",
    institute: "IIT Kanpur / IASRI",
    percent: 0,
    status: "Available",
    color: "blue",
    source_type: "TPAC"
  },
  {
    id: "tpac8",
    title: "National Accounts Statistics & SNA 2008 Guidelines",
    description: "Compilation of GDP, GVA, Supply-Use Tables, and capital formation according to UN System of National Accounts 2008.",
    domain: "Statistical",
    level: "Advanced",
    duration: "Two weeks",
    institute: "National Statistical Systems Training Academy (NSSTA)",
    percent: 100,
    status: "Completed",
    color: "orange",
    source_type: "TPAC"
  }
];

export const certificates = [
  {
    id: "cert-1",
    title: "Planning and Designing of Large Scale Sample Surveys",
    issuedDate: "14 January 2026",
    domain: "Statistical",
  },
  {
    id: "cert-2",
    title: "Data Privacy and DPDP Act in Governance",
    issuedDate: "28 February 2026",
    domain: "Digital Governance",
  },
  {
    id: "cert-3",
    title: "National Accounts Statistics & SNA 2008 Guidelines",
    issuedDate: "05 August 2025",
    domain: "Statistical",
  },
];

export const competencyDomains = [
  { id: "statistical", name: "Statistical Competencies", percent: 82, status: "Strong", icon: "BarChart3", color: "blue" },
  { id: "technical", name: "Technical Competencies", percent: 64, status: "Needs Improvement", icon: "Monitor", color: "orange" },
  { id: "digitalGovernance", name: "Digital Governance", percent: 70, status: "Average", icon: "PieChart", color: "green" },
  { id: "behavioural", name: "Behavioural & Leadership", percent: 88, status: "Strong", icon: "MessageSquare", color: "purple" },
];

export const progressHistory = [
  { month: "Nov", hours: 14, courses: 2 },
  { month: "Dec", hours: 22, courses: 3 },
  { month: "Jan", hours: 28, courses: 4 },
  { month: "Feb", hours: 32, courses: 5 },
  { month: "Mar", hours: 18, courses: 2 },
];
