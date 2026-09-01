// ============================================================================
// MOCK DATA — Dashboard
// ----------------------------------------------------------------------------
// Everything the dashboard renders lives here, in this shape, for now.
// When the backend is ready, replace each of these exports with a real
// fetch/axios call (e.g. inside a useEffect + useState, or React Query).
// As long as the returned data keeps this same shape, NO component code
// needs to change.
// ============================================================================

export const currentUser = {
  name: "Learner",
  role: "Learner",
  avatarUrl: "", // fallback initials/icon used if empty
  notificationsCount: 3,
};

// Top summary cards
export const overviewStats = [
  {
    id: "overall-competency",
    label: "Overall Competency",
    value: "72%",
    caption: "Keep learning!",
    icon: "TrendingUp",
    color: "blue",
    progress: 72, // used for the mini progress bar under the value
  },
  {
    id: "skills-identified",
    label: "Skills Identified",
    value: 18,
    caption: "Across 4 domains",
    icon: "BookOpen",
    color: "green",
  },
  {
    id: "skills-to-improve",
    label: "Skills to Improve",
    value: 5,
    caption: "Focus areas",
    icon: "Zap",
    color: "orange",
  },
  {
    id: "courses-completed",
    label: "Courses Completed",
    value: 12,
    caption: "Keep it up!",
    icon: "Trophy",
    color: "purple",
  },
];

// Skill Gap Overview panel
export const skillGaps = [
  {
    id: "statistical-analysis",
    name: "Statistical Analysis",
    percent: 80,
    status: "Strong",
    icon: "BarChart3",
    color: "blue",
  },
  {
    id: "data-visualization",
    name: "Data Visualization",
    percent: 60,
    status: "Average",
    icon: "PieChart",
    color: "orange",
  },
  {
    id: "digital-governance",
    name: "Digital Governance",
    percent: 50,
    status: "Needs Improvement",
    icon: "Monitor",
    color: "green",
  },
  {
    id: "communication",
    name: "Communication",
    percent: 90,
    status: "Excellent",
    icon: "MessageSquare",
    color: "purple",
  },
];

// Recommended Learning Path panel
export const recommendedPath = {
  title: "Data Visualization Fundamentals",
  description:
    "Based on your assessment, we recommend focusing on the following path.",
  steps: [
    {
      id: 1,
      title: "Introduction to Data Visualization",
      description: "Basics, importance and applications",
      completed: true,
    },
    {
      id: 2,
      title: "Charts and Graphs",
      description: "Bar charts, Line charts, Pie charts & more",
      completed: false,
    },
    {
      id: 3,
      title: "Data Interpretation",
      description: "Understanding patterns and insights",
      completed: false,
    },
    {
      id: 4,
      title: "Hands-on Practice",
      description: "Apply your knowledge with real datasets",
      completed: false,
    },
  ],
};

// "Your Progress" donut widget
export const progressSummary = {
  month: "This Month",
  percent: 68,
  completed: 12,
  inProgress: 7,
  notStarted: 5,
};

// "Continue Learning" course cards
export const continueLearningCourses = [
  {
    id: "course-1",
    title: "Statistical Data Analysis with R",
    tag: "In Progress",
    percent: 65,
    color: "blue",
  },
  {
    id: "course-2",
    title: "Data Visualization Essentials",
    tag: "Recommended",
    percent: 40,
    color: "orange",
  },
  {
    id: "course-3",
    title: "Digital Governance Fundamentals",
    tag: "New",
    percent: 20,
    color: "green",
  },
  {
    id: "course-4",
    title: "Effective Communication Skills",
    tag: "In Progress",
    percent: 75,
    color: "purple",
  },
];

// Sidebar navigation — icon names map to lucide-react components (see Sidebar.jsx)
export const sidebarNavItems = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { id: "competencies", label: "My Competencies", icon: "PieChart" },
  { id: "skill-gaps", label: "Skill Gaps", icon: "Target" },
  { id: "learning-path", label: "Learning Path", icon: "Route" },
  { id: "courses", label: "Courses", icon: "BookOpen" },
  { id: "ai-quiz", label: "AI Quiz Generator", icon: "Sparkles" },
  { id: "progress", label: "Progress", icon: "BarChart2" },
  { id: "certificates", label: "Certificates", icon: "Award" },
  { id: "resources", label: "Resource Library", icon: "FolderOpen" },
  { id: "notifications", label: "Notifications", icon: "Bell" },
  { id: "profile", label: "Profile", icon: "User" },
  { id: "settings", label: "Settings", icon: "Settings" },
  { id: "help", label: "Help & Support", icon: "HelpCircle" },
];
// "Courses" full page — all available courses
export const allCourses = [
  {
    id: "c1",
    title: "Survey Design and Sampling Methodology",
    description:
      "Stratified sampling, cluster sampling, and survey design for official statistics.",
    domain: "Statistical",
    level: "Intermediate",
    percent: 100,
    status: "Completed",
    color: "blue",
  },
  {
    id: "c2",
    title: "Python for Official Statistics",
    description:
      "Hands-on Python and pandas for cleaning and analyzing government survey data.",
    domain: "Technical",
    level: "Beginner",
    percent: 65,
    status: "In Progress",
    color: "orange",
  },
  {
    id: "c3",
    title: "Cybersecurity Fundamentals for Government Officials",
    description:
      "Data privacy, digital signatures, and secure handling of government data.",
    domain: "Digital Governance",
    level: "Beginner",
    percent: 0,
    status: "Not Started",
    color: "green",
  },
  {
    id: "c4",
    title: "Leadership and Change Management",
    description:
      "Building leadership skills and managing organizational change.",
    domain: "Behavioural",
    level: "Intermediate",
    percent: 40,
    status: "In Progress",
    color: "purple",
  },
  {
    id: "c5",
    title: "GIS and Spatial Data Analysis",
    description:
      "Geographic Information Systems for spatial statistics and mapping.",
    domain: "Technical",
    level: "Intermediate",
    percent: 0,
    status: "Not Started",
    color: "blue",
  },
  {
    id: "c6",
    title: "SDG Indicator Framework and Metadata Standards",
    description:
      "Understanding SDG indicators, metadata standards, and data quality frameworks.",
    domain: "Statistical",
    level: "Beginner",
    percent: 100,
    status: "Completed",
    color: "orange",
  },
];

// "Certificates" page
export const certificates = [
  {
    id: "cert1",
    title: "Survey Design and Sampling Methodology",
    issuedDate: "12 July 2026",
    domain: "Statistical",
  },
  {
    id: "cert2",
    title: "SDG Indicator Framework and Metadata Standards",
    issuedDate: "3 June 2026",
    domain: "Statistical",
  },
];
// "My Competencies" full page — same 4 domains, more detail than the dashboard widget
export const competencyDomains = [
  {
    id: "statistical",
    name: "Statistical Competencies",
    percent: 80,
    status: "Strong",
    icon: "BarChart3",
    color: "blue",
    skills: ["Survey Design", "Sampling", "National Accounts", "SDG Indicators", "Metadata Standards"],
  },
  {
    id: "technical",
    name: "Technical Competencies",
    percent: 60,
    status: "Average",
    icon: "Monitor",
    color: "orange",
    skills: ["Python", "R", "SQL", "GIS", "Cloud Computing", "AI/ML"],
  },
  {
    id: "digital-governance",
    name: "Digital Governance",
    percent: 50,
    status: "Needs Improvement",
    icon: "PieChart",
    color: "green",
    skills: ["Cybersecurity", "Data Privacy", "Digital Signatures", "Government Cloud"],
  },
  {
    id: "behavioural",
    name: "Behavioural & Managerial",
    percent: 90,
    status: "Excellent",
    icon: "MessageSquare",
    color: "purple",
    skills: ["Leadership", "Communication", "Project Management", "Decision Making"],
  },
];

// "Skill Gaps" full page — individual skills ranked by biggest gap first
export const detailedSkillGaps = [
  { id: "sg1", skill: "Digital Signatures", domain: "Digital Governance", currentLevel: 1.5, requiredLevel: 4, gap: 2.5 },
  { id: "sg2", skill: "Cloud Computing", domain: "Technical", currentLevel: 2, requiredLevel: 4, gap: 2 },
  { id: "sg3", skill: "GIS", domain: "Technical", currentLevel: 2, requiredLevel: 3.5, gap: 1.5 },
  { id: "sg4", skill: "Data Privacy", domain: "Digital Governance", currentLevel: 2.5, requiredLevel: 4, gap: 1.5 },
  { id: "sg5", skill: "AI/ML", domain: "Technical", currentLevel: 2.5, requiredLevel: 3.5, gap: 1 },
  { id: "sg6", skill: "SDG Indicators", domain: "Statistical", currentLevel: 3, requiredLevel: 4, gap: 1 },
];

// Full "Progress" page — monthly history
export const progressHistory = [
  { month: "Mar", percent: 40 },
  { month: "Apr", percent: 48 },
  { month: "May", percent: 55 },
  { month: "Jun", percent: 60 },
  { month: "Jul", percent: 64 },
  { month: "Aug", percent: 68 },
];
