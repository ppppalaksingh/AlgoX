import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { SignedIn, SignedOut, useUser, useAuth } from "@clerk/clerk-react";
import { Sparkles, Bot, Building2, FlaskConical, Route, FolderOpen, Bell, User, Settings, HelpCircle, BookOpen, ShieldAlert } from "lucide-react";

import Login from "./components/Login";
import Courses from "./components/Courses";
import Certificates from "./components/Certificates";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatsGrid from "./components/StatsGrid";
import SkillGapOverview from "./components/SkillGapOverview";
import RecommendedPath from "./components/RecommendedPath";
import AIQuizGenerator from "./components/AIQuizGenerator";
import ProgressWidget from "./components/ProgressWidget";
import ContinueLearning from "./components/ContinueLearning";
import MyCompetencies from "./components/MyCompetencies";
import SkillGaps from "./components/SkillGaps";
import FullProgress from "./components/FullProgress";
import SimplePage from "./components/SimplePage";
import LearningPathView from "./components/LearningPathView";
import ProfileView from "./components/ProfileView";
import ResourceLibrary from "./components/ResourceLibrary";
import AIQuizModal from "./components/AIQuizModal";
import CourseModal from "./components/CourseModal";
import CertificateModal from "./components/CertificateModal";
import GapAnalysisModal from "./components/GapAnalysisModal";
import AdminDashboard from "./components/AdminDashboard";
import AIAssistantModal from "./components/AIAssistantModal";
import VirtualLab from "./components/VirtualLab";
import Toast from "./components/Toast";

import {
  overviewStats as initialOverviewStats,
  skillGaps as initialSkillGaps,
  recommendedPath as initialRecommendedPath,
  progressSummary as initialProgressSummary,
  continueLearningCourses as initialContinueLearningCourses,
  allCourses as initialAllCourses,
  certificates as initialCertificates,
  competencyDomains as initialCompetencyDomains,
  detailedSkillGaps as initialDetailedSkillGaps,
  progressHistory as initialProgressHistory,
} from "./data/dashboardData";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export default function App() {
  return (
    <>
      <SignedOut>
        <Login />
      </SignedOut>

      <SignedIn>
        <Dashboard />
      </SignedIn>
    </>
  );
}

function Dashboard() {
  const { user: clerkUser } = useUser();
  const { getToken } = useAuth();

  // Navigation & layout
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState("learner"); // 'learner' | 'admin'

  // App Data States
  const [stats, setStats] = useState(initialOverviewStats);
  const [skillGapsList, setSkillGapsList] = useState(initialSkillGaps);
  const [detailedGaps, setDetailedGaps] = useState(initialDetailedSkillGaps);
  const [competencyList, setCompetencyList] = useState(initialCompetencyDomains);
  const [courseList, setCourseList] = useState(initialAllCourses);
  const [continueCourses, setContinueCourses] = useState(initialContinueLearningCourses);
  const [recommendedPathData, setRecommendedPathData] = useState(initialRecommendedPath);
  const [certificateList, setCertificateList] = useState(initialCertificates);
  const [learningPathProgress, setLearningPathProgress] = useState(30);
  const [profileData, setProfileData] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [adminAnalyticsData, setAdminAnalyticsData] = useState(null);
  const [isAdminInDB, setIsAdminInDB] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [progressData, setProgressData] = useState(null);

  // Synchronized refs to avoid cyclic hook dependencies
  const courseListRef = useRef(courseList);
  useEffect(() => {
    courseListRef.current = courseList;
  }, [courseList]);

  const certificateListRef = useRef(certificateList);
  useEffect(() => {
    certificateListRef.current = certificateList;
  }, [certificateList]);

  const progressDataRef = useRef(progressData);
  useEffect(() => {
    progressDataRef.current = progressData;
  }, [progressData]);

  const initializedUserRef = useRef(null);

  // Notifications
  const [notifications, setNotifications] = useState([
    { title: "New AI Assessment Available", description: "Test your skills on Census and Survey Sampling standards." },
    { title: "NSSTA TPAC Recommendation", description: "Your gap analysis recommends 'Python Training for Statisticians'." },
    { title: "Certificate Ready", description: "SDG Indicator Framework certificate is available to download." },
  ]);

  // Loading States
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isStartingPath, setIsStartingPath] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Modals & Active Items
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  const [activeCourse, setActiveCourse] = useState(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

  const [activeCertificate, setActiveCertificate] = useState(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  const [gapModalData, setGapModalData] = useState(null);
  const [isGapModalOpen, setIsGapModalOpen] = useState(false);

  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  // Toast System
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!toast || toast.type === "loading") return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const officerDesignation =
    profileData?.designation ||
    localStorage.getItem("algox_user_designation") ||
    "Assistant Director";

  const getCleanOfficerName = (raw) => {
    if (!raw) return "";
    const trimmed = String(raw).trim();
    if (
      trimmed === "Assistant Director" ||
      trimmed === "Director" ||
      trimmed === "Deputy Director" ||
      trimmed === "Joint Director" ||
      trimmed.toLowerCase() === officerDesignation.toLowerCase()
    ) {
      return "";
    }
    return trimmed;
  };

  const clerkFullName = clerkUser?.firstName
    ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
    : clerkUser?.username;

  const emailUsername = clerkUser?.primaryEmailAddress?.emailAddress
    ? clerkUser.primaryEmailAddress.emailAddress.split("@")[0]
    : "";

  const officerName =
    getCleanOfficerName(profileData?.name) ||
    getCleanOfficerName(localStorage.getItem("algox_user_name")) ||
    getCleanOfficerName(clerkFullName) ||
    (emailUsername ? emailUsername.charAt(0).toUpperCase() + emailUsername.slice(1) : "Tarun Gupta");

  const user = {
    name: officerName,
    designation: officerDesignation,
    email: profileData?.email || clerkUser?.primaryEmailAddress?.emailAddress || "officer@mospi.gov.in",
    notificationsCount: notifications.length,
  };

  // Dynamic Path Generator from Live Top Gap
  const generateDynamicPathFromGap = (highestGap) => {
    const domain = (highestGap?.domain || highestGap?.displayName || "Statistical").toLowerCase();
    const gapVal = highestGap?.gap || 0.8;

    if (domain.includes("tech") || domain.includes("python")) {
      return {
        title: "Python for NSS Microdata Scrutiny & CAPI Validation",
        description: `Targeted ML Pathway: Designed to bridge your highest identified gap in Technical & Analytics (-${gapVal} level).`,
        steps: [
          { id: 1, title: "Foundations: Python & Pandas for PLFS/ASI Surveys", description: "Loading NSS raw microdata and establishing clean data structures", completed: true },
          { id: 2, title: "Automated Multiplier Calculation & Anomaly Filters", description: "Writing scrutiny rules for field schedule validation", completed: false },
          { id: 3, title: "Microdata Anonymization & DPDP Compliance", description: "Implementing k-anonymity for public dissemination", completed: false },
          { id: 4, title: "Official Certification & NSSTA Evaluation", description: "Pass practical assessment for verified competency credit", completed: false },
        ],
      };
    } else if (domain.includes("gov") || domain.includes("dpdp")) {
      return {
        title: "Digital Governance & DPDP Act 2023 for Official Statistics",
        description: `Targeted ML Pathway: Tailored to bridge your Digital Governance gap (-${gapVal} level).`,
        steps: [
          { id: 1, title: "DPDP Act 2023 Principles for Government Databases", description: "Consent frameworks and administrative data governance", completed: true },
          { id: 2, title: "MeghRaj Cloud & MoSPI Secure Data Architecture", description: "GovCloud deployment standards and SDMX metadata", completed: false },
          { id: 3, title: "Microdata Access & Privacy Audits", description: "Security protocols for district-level statistical offices", completed: false },
          { id: 4, title: "National Governance Accreditation Exam", description: "Earn certified iGOT Karmayogi Digital Governance badge", completed: false },
        ],
      };
    } else if (domain.includes("behav") || domain.includes("lead")) {
      return {
        title: "Executive Leadership & Field Operations Management",
        description: `Targeted ML Pathway: Designed to bridge your Behavioural & Leadership gap (-${gapVal} level).`,
        steps: [
          { id: 1, title: "Leadership in Civil Services & FOD Field Coordination", description: "Managing large-scale statistical survey field teams", completed: true },
          { id: 2, title: "Evidence-Based Policy Communication & Data Storytelling", description: "Translating official macroeconomic indicators for policymakers", completed: false },
          { id: 3, title: "Conflict Resolution & District Administrative Ethics", description: "UN Fundamental Principles of Official Statistics", completed: false },
          { id: 4, title: "Accredited MoSPI Executive Leadership Badge", description: "Senior cadre eligibility evaluation", completed: false },
        ],
      };
    } else {
      return {
        title: "Advanced Stratified Sampling & Survey Methodology",
        description: `Targeted ML Pathway: Reinforcing core MoSPI statistical standards (-${gapVal} level).`,
        steps: [
          { id: 1, title: "Stratified Multi-stage Sampling & Primary Sampling Units", description: "Frame construction and allocation techniques", completed: true },
          { id: 2, title: "National Accounts (SNA 2008) & GVA Compilation", description: "Supply-use tables and deflator methodologies", completed: false },
          { id: 3, title: "Consumer Price Index (CPI) Modified Laspeyres Model", description: "Base revision and item substitution principles", completed: false },
          { id: 4, title: "NSSTA Official Statistics Master Credential", description: "Accredited evaluation by National Statistical Systems Training Academy", completed: false },
        ],
      };
    }
  };

  // Dynamic progress summary computed live from courses, competency profile, and quiz assessments
  const dynamicProgressSummary = useMemo(() => {
    const total = courseList.length || 1;
    const completed = courseList.filter((c) => c.status === "Completed" || c.percent === 100).length;
    const inProgress = courseList.filter((c) => c.status === "In Progress" || (c.percent > 0 && c.percent < 100)).length;
    const notStarted = courseList.filter((c) => (!c.status || c.status === "Available") && (!c.percent || c.percent === 0)).length;
    const avgCompetency = Math.round(
      competencyList.reduce((acc, d) => acc + (d.percent || 0), 0) / (competencyList.length || 1)
    );
    const avgCourse = Math.round(
      courseList.reduce((acc, c) => acc + (c.percent || 0), 0) / total
    );
    let basePercent = (avgCompetency * 0.4) + (avgCourse * 0.6);

    // Live Quiz Performance Impact:
    // Low score (<60%, especially <40%) directly penalizes overall progress;
    // High score (>=60%, especially >=80%) significantly boosts overall progress.
    if (quizAttempts && quizAttempts.length > 0) {
      const validScores = quizAttempts.filter((q) => q.score != null);
      if (validScores.length > 0) {
        const totalScore = validScores.reduce((acc, q) => acc + Number(q.score), 0);
        const totalPossible = validScores.reduce((acc, q) => acc + (Number(q.totalQuestions) || 5), 0);
        const overallQuizPct = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 50;

        let quizDelta = 0;
        if (overallQuizPct >= 80) quizDelta = 4;
        else if (overallQuizPct >= 60) quizDelta = 2;
        else if (overallQuizPct >= 40) quizDelta = -2;
        else quizDelta = -4;

        basePercent = Math.max(5, Math.min(100, basePercent + quizDelta));
      }
    }
    const overallPercent = Math.round(basePercent);

    return {
      month: "This Quarter",
      percent: overallPercent,
      completed,
      inProgress,
      notStarted,
    };
  }, [courseList, competencyList, quizAttempts]);

  // Helper to dynamically update StatsGrid cards
  const updateDashboardStats = useCallback((overallReadiness, courses, certs) => {
    const currentCourses = courses || courseListRef.current || [];
    const currentCerts = certs || certificateListRef.current || [];
    const completedCount = currentCourses.filter((c) => c.percent === 100 || c.status === "Completed").length;
    const inProgressCount = currentCourses.filter((c) => c.percent > 0 && c.percent < 100).length;
    const computedHours = Math.round(completedCount * 18 + inProgressCount * 6 + (currentCerts.length * 8));
    const totalHours = progressDataRef.current?.totalHours != null ? progressDataRef.current.totalHours : computedHours;
    const readinessVal = overallReadiness != null ? Math.round(overallReadiness) : 25;

    setStats([
      {
        id: "overall-readiness",
        label: "Overall Cadre Readiness",
        value: `${readinessVal}%`,
        caption: "Benchmarked against MoSPI Standards",
        icon: "TrendingUp",
        color: "blue",
        progress: readinessVal,
      },
      {
        id: "courses-completed",
        label: "Accredited Modules",
        value: `${completedCount}`,
        caption: `${inProgressCount} in progress on iGOT & NSSTA`,
        icon: "BookOpen",
        color: "orange",
      },
      {
        id: "learning-hours",
        label: "Verified Training Hours",
        value: `${totalHours}h`,
        caption: "Continuous Professional Development",
        icon: "Zap",
        color: "green",
      },
      {
        id: "certificates-earned",
        label: "Verified Certifications",
        value: `${currentCerts.length}`,
        caption: "MoSPI & Karmayogi Accredited",
        icon: "Trophy",
        color: "purple",
      },
    ]);
  }, []);

  // Helper to fetch real recommendations from Python ML service
  const fetchMLRecommendations = useCallback(async (token) => {
    try {
      const res = await fetch(`${API_BASE_URL}/courses/recommended`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const recCourses = data.recommendedCourses || [];
        if (recCourses.length > 0) {
          const colorList = ["blue", "orange", "green", "purple"];
          const currentCerts = certificateListRef.current || [];
          const certTitles = new Set(currentCerts.map((c) => c.title?.toLowerCase().trim()));
          const completedIds = new Set(progressDataRef.current?.completedCourseIds || []);
          const inProgressIds = new Set(progressDataRef.current?.inProgressCourseIds || []);

          const formatted = recCourses.map((c, i) => {
            const isCompleted = completedIds.has(c.id) || certTitles.has(c.title?.toLowerCase().trim());
            const isInProg = inProgressIds.has(c.id);

            return {
              ...c,
              color: colorList[i % colorList.length],
              percent: isCompleted ? 100 : isInProg ? 50 : 0,
              status: isCompleted ? "Completed" : isInProg ? "In Progress" : "Available",
            };
          });

          setCourseList(formatted);
          courseListRef.current = formatted;

          // Top 4 in continue learning
          setContinueCourses(
            formatted.slice(0, 4).map((c) => ({
              id: c.id,
              title: c.title,
              tag: c.source_type === "TPAC" ? "NSSTA TPAC" : c.status,
              percent: c.percent,
              color: c.color,
              domain: c.domain,
            }))
          );
        }
      }
    } catch (err) {
      console.warn("[App] ML Recommendations load note:", err.message);
    }
  }, []);

  // Helper to fetch stored documents from backend
  const fetchDocuments = useCallback(async (token) => {
    try {
      const res = await fetch(`${API_BASE_URL}/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data || []);
      }
    } catch (err) {
      console.warn("[App] Documents load note:", err.message);
    }
  }, []);

  // Helper to fetch stored certificates from MongoDB
  const fetchCertificates = useCallback(async (token) => {
    try {
      const res = await fetch(`${API_BASE_URL}/certificates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCertificateList(data);
          certificateListRef.current = data;
        }
      }
    } catch (err) {
      console.warn("[App] Certificates load note:", err.message);
    }
  }, []);

  // Helper to fetch User Progress from MongoDB
  const fetchProgress = useCallback(async (token) => {
    try {
      const res = await fetch(`${API_BASE_URL}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setProgressData(data);
          progressDataRef.current = data;
          const completedIds = new Set(data.completedCourseIds || []);
          const inProgressIds = new Set(data.inProgressCourseIds || []);

          setCourseList((prev) => {
            const updated = prev.map((c) => {
              if (completedIds.has(c.id)) {
                return { ...c, percent: 100, status: "Completed" };
              }
              if (inProgressIds.has(c.id)) {
                return { ...c, percent: 50, status: "In Progress" };
              }
              return c;
            });
            courseListRef.current = updated;
            return updated;
          });

          setContinueCourses((prev) =>
            prev.map((c) => {
              if (completedIds.has(c.id)) return { ...c, percent: 100, tag: "Completed" };
              if (inProgressIds.has(c.id)) return { ...c, percent: 50, tag: "In Progress" };
              return c;
            })
          );
        }
      }
    } catch (err) {
      console.warn("[App] Progress load note:", err.message);
    }
  }, []);

  // Helper to fetch Admin Analytics
  const fetchAdminAnalytics = useCallback(async (token) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAdminAnalyticsData(data);
      }
    } catch (err) {
      console.warn("[App] Admin analytics load note:", err.message);
    }
  }, []);

  // Helper to fetch User's saved Quiz Attempts from MongoDB
  const fetchQuizAttempts = useCallback(async (token) => {
    try {
      const res = await fetch(`${API_BASE_URL}/quiz/attempts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.attempts) {
          setQuizAttempts(data.attempts);
        }
      }
    } catch (err) {
      console.warn("[App] Quiz attempts load note:", err.message);
    }
  }, []);

  // Centralized function to apply recalibrated profile across all UI widgets
  const applyRecalibratedProfile = useCallback((data, explicitCourses, explicitCerts) => {
    if (!data) return;
    setGapModalData(data);

    const currentCourses = explicitCourses || courseListRef.current;
    const currentCerts = explicitCerts || certificateListRef.current;

    if (data.domainScores) {
      const domainMap = {
        statistical: { name: "Statistical Analysis", icon: "BarChart3", color: "blue" },
        technical: { name: "Technical & Analytics", icon: "Monitor", color: "orange" },
        digitalGovernance: { name: "Digital Governance", icon: "PieChart", color: "green" },
        behavioural: { name: "Behavioural & Leadership", icon: "MessageSquare", color: "purple" },
      };

      const newSkillGaps = Object.entries(data.domainScores).map(([k, val]) => {
        const pct = Math.round((val / 5) * 100);
        const meta = domainMap[k] || { name: k, icon: "BarChart3", color: "blue" };
        return {
          id: k,
          name: meta.name,
          percent: pct,
          status: pct >= 75 ? "Strong" : pct >= 50 ? "Average" : "Needs Improvement",
          icon: meta.icon,
          color: meta.color,
        };
      });

      setSkillGapsList(newSkillGaps);

      setCompetencyList((prev) =>
        prev.map((dom) => {
          const raw = data.domainScores[dom.id];
          const score = raw != null ? Math.round((raw / 5) * 100) : dom.percent;
          return {
            ...dom,
            percent: score,
            status: score >= 75 ? "Strong" : score >= 50 ? "Average" : "Needs Improvement",
          };
        })
      );
    }

    if (data.subCompetencies && data.subCompetencies.length > 0) {
      const domainLabelMap = {
        statistical: "Statistical",
        technical: "Technical",
        digitalGovernance: "Digital Governance",
        behavioural: "Behavioural",
      };
      setDetailedGaps(
        data.subCompetencies.map((g, idx) => ({
          id: `sg-${idx}`,
          skill: g.subCompetency,
          domain: domainLabelMap[g.domain] || g.domain || "Statistical",
          currentLevel: g.current,
          requiredLevel: g.required,
          gap: g.gap,
        }))
      );
    } else if (data.skillGaps) {
      const domainLabelMap = {
        statistical: "Statistical Analysis",
        technical: "Technical & Analytics",
        digitalGovernance: "Digital Governance",
        behavioural: "Behavioural & Leadership",
      };
      setDetailedGaps(
        data.skillGaps.map((g, idx) => ({
          id: `sg-${idx}`,
          skill: domainLabelMap[g.skillName] || g.skillName,
          domain: domainLabelMap[g.skillName] || "Statistical",
          currentLevel: g.currentLevel,
          requiredLevel: g.requiredLevel,
          gap: g.gap,
        }))
      );
    }

    if (data.highestGap) {
      setRecommendedPathData(generateDynamicPathFromGap(data.highestGap));
    }

    if (data.overallReadiness != null) {
      updateDashboardStats(data.overallReadiness, currentCourses, currentCerts);
    }
  }, [updateDashboardStats]);

  // Helper to fetch live competency gap analysis from Python ML service
  const fetchCompetencyData = useCallback(async (token) => {
    try {
      const res = await fetch(`${API_BASE_URL}/competency/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        applyRecalibratedProfile(data);
      }
    } catch (err) {
      console.warn("[App] Competency data load note:", err.message);
    }
  }, [applyRecalibratedProfile]);

  // Sync user profile & load initial data exactly once per login session
  useEffect(() => {
    if (!clerkUser?.id) return;
    if (initializedUserRef.current === clerkUser.id) return;
    initializedUserRef.current = clerkUser.id;

    async function initUserAndML() {
      try {
        const token = (await getToken()) || "dev-test-token";

        // 1. Fetch User Profile from MongoDB if it exists
        let existingProfile = null;
        try {
          const getRes = await fetch(`${API_BASE_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (getRes.ok) {
            existingProfile = await getRes.json();
            if (existingProfile && existingProfile.name) {
              setProfileData(existingProfile);
            }
          }
        } catch (getErr) {
          console.warn("[App] Existing profile fetch note:", getErr.message);
        }

        // 2. Only create default profile if none exists in MongoDB
        if (!existingProfile || !existingProfile.name) {
          const res = await fetch(`${API_BASE_URL}/users/profile`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: officerName,
              email: user.email,
              designation: officerDesignation,
              department: "National Statistical Office (NSO)",
              experienceYears: 0,
              qualifications: [],
              pastTrainings: [],
            }),
          });

          if (res.ok) {
            const data = await res.json();
            setProfileData(data);
          }
        }

        // 3. Fetch certificates first so recommendations know what's completed
        await fetchCertificates(token);
        await fetchMLRecommendations(token);
        await fetchProgress(token);
        await fetchCompetencyData(token);
        await fetchDocuments(token);
        await fetchQuizAttempts(token);
        await fetchAdminAnalytics(token);

        // 4. Verify Database Admin Status
        try {
          const emailToCheck = user.email || clerkUser?.primaryEmailAddress?.emailAddress || "";
          const adminCheckRes = await fetch(`${API_BASE_URL}/admin/check-access?clerkId=${clerkUser.id}&email=${encodeURIComponent(emailToCheck)}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (adminCheckRes.ok) {
            const adminCheckData = await adminCheckRes.json();
            setIsAdminInDB(Boolean(adminCheckData.isAdmin));
          }
        } catch (adminErr) {
          console.warn("[App] Admin verification note:", adminErr.message);
        }
      } catch (err) {
        console.warn("[App] Initial bootstrap note:", err.message);
      }
    }

    initUserAndML();
  }, [clerkUser?.id, getToken, fetchCertificates, fetchMLRecommendations, fetchProgress, fetchCompetencyData, fetchDocuments, fetchQuizAttempts, fetchAdminAnalytics, officerName, user.email, officerDesignation]);

  // Handler: Upload Document & Generate Quiz
  const handleQuizUpload = async (file) => {
    setIsGeneratingQuiz(true);
    showToast(`Uploading ${file.name} and generating AI assessment...`, "loading");

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_BASE_URL}/quiz/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate quiz from file.");
      }

      setActiveQuiz(data);
      setQuizResult(null);
      setIsQuizModalOpen(true);
      await fetchDocuments(token);
      showToast("🎉 AI Quiz successfully generated! Good luck!", "success");
    } catch (err) {
      console.error("[handleQuizUpload] Error:", err);
      showToast(err.message || "Failed to generate quiz. Please try again.", "error");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Handler: Generate Sample Quiz
  const handleGenerateSample = async () => {
    setIsGeneratingQuiz(true);
    showToast("Generating official sample assessment...", "loading");

    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/quiz/sample`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate sample quiz.");
      }

      setActiveQuiz(data);
      setQuizResult(null);
      setIsQuizModalOpen(true);
      showToast("✨ Sample Quiz generated! Review questions below.", "success");
    } catch (err) {
      console.error("[handleGenerateSample] Error:", err);
      showToast(err.message || "Could not generate sample quiz.", "error");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Handler: Generate Quiz Directly from Resource Library Document
  const handleGenerateQuizFromDoc = async (doc) => {
    if (!doc) return;
    setIsGeneratingQuiz(true);
    const docTitle = doc.originalName || doc.title || "Selected Material";
    showToast(`Generating official assessment from ${docTitle}...`, "loading");

    try {
      const token = (await getToken()) || "dev-test-token";
      let compiledText = "";
      if (doc.slides && doc.slides.length > 0) {
        compiledText = doc.slides.map((s) => `${s.title}: ${s.subtitle || ""}. ${(s.points || []).join(". ")}`).join("\n\n");
      } else if (doc.sections && doc.sections.length > 0) {
        compiledText = doc.sections.map((s) => `${s.heading}: ${s.content || ""}. ${(s.points || []).join(". ")}`).join("\n\n");
      } else {
        compiledText = doc.summary || docTitle;
      }

      const res = await fetch(`${API_BASE_URL}/quiz/from-resource`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          docId: doc._id,
          sourceFileName: docTitle,
          text: compiledText,
          summary: doc.summary,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate assessment from document.");
      }

      setActiveQuiz(data);
      setQuizResult(null);
      setIsQuizModalOpen(true);
      showToast(`✨ Assessment generated from "${docTitle}"! Review questions below.`, "success");
    } catch (err) {
      console.error("[handleGenerateQuizFromDoc] Error:", err);
      showToast(err.message || "Failed to generate assessment from material.", "error");
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Handler: Delete User-Uploaded Document
  const handleDeleteDocument = async (docId, docTitle = "Document") => {
    if (!docId) return;
    showToast(`Deleting "${docTitle}"...`, "loading");
    try {
      const token = (await getToken()) || "dev-test-token";
      const res = await fetch(`${API_BASE_URL}/documents/${docId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete document.");
      }

      setDocuments((prev) => prev.filter((d) => d._id !== docId));
      showToast(`🗑️ "${docTitle}" deleted successfully from your library.`, "success");
    } catch (err) {
      console.error("[handleDeleteDocument] Error:", err);
      showToast(err.message || "Failed to delete document.", "error");
    }
  };

  // Handler: Submit Quiz Answers
  const handleQuizSubmit = async (attemptId, answers) => {
    setIsSubmittingQuiz(true);
    showToast("Evaluating your answers against official rubrics...", "loading");

    try {
      const token = (await getToken()) || "dev-test-token";
      const res = await fetch(`${API_BASE_URL}/quiz/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ attemptId, answers }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit answers.");
      }

      setQuizResult(data);
      const scorePct = data.percentage != null ? data.percentage : Math.round(((data.score || 0) / (data.total || 5)) * 100);
      const isPass = scorePct >= 60;

      // Update quiz attempts list immediately in UI
      setQuizAttempts((prev) => [
        {
          _id: attemptId,
          sourceFileName: activeQuiz?.sourceFileName || "Document Assessment",
          score: data.score,
          totalQuestions: data.total,
          createdAt: new Date().toISOString(),
          questions: data.questions || activeQuiz?.questions,
        },
        ...prev.filter((a) => a._id !== attemptId),
      ]);

      if (!isPass) {
        showToast(`⚠️ Assessment Score: ${data.score}/${data.total} (${scorePct}%). Incorrect answers detected — Competency rating adjusted (-${scorePct < 40 ? "3%" : "2%"})`, "warning");
        // Calibrated, balanced downward adjustment (not huge wipeout)
        const drop = scorePct < 40 ? 3 : 2;
        setCompetencyList((prev) =>
          prev.map((dom) => {
            const newPct = Math.max(15, (dom.percent || 20) - drop);
            return {
              ...dom,
              percent: newPct,
              status: newPct >= 75 ? "Strong" : newPct >= 50 ? "Average" : "Needs Improvement",
            };
          })
        );
        setSkillGapsList((prev) =>
          prev.map((dom) => {
            const newPct = Math.max(15, (dom.percent || 20) - drop);
            return {
              ...dom,
              percent: newPct,
              status: newPct >= 75 ? "Strong" : newPct >= 50 ? "Average" : "Needs Improvement",
            };
          })
        );
      } else {
        showToast(`🏆 Assessment Passed! Score: ${data.score}/${data.total} (${scorePct}%). Demonstrated Competency boosted (+${scorePct >= 80 ? "3%" : "2%"})!`, "success");
        // Calibrated, balanced upward boost (steady and earned)
        const boost = scorePct >= 80 ? 3 : 2;
        setCompetencyList((prev) =>
          prev.map((dom) => {
            const newPct = Math.min(98, (dom.percent || 20) + boost);
            return {
              ...dom,
              percent: newPct,
              status: newPct >= 75 ? "Strong" : newPct >= 50 ? "Average" : "Needs Improvement",
            };
          })
        );
        setSkillGapsList((prev) =>
          prev.map((dom) => {
            const newPct = Math.min(98, (dom.percent || 20) + boost);
            return {
              ...dom,
              percent: newPct,
              status: newPct >= 75 ? "Strong" : newPct >= 50 ? "Average" : "Needs Improvement",
            };
          })
        );
      }

      if (data.recalibratedProfile) {
        applyRecalibratedProfile(data.recalibratedProfile);
      } else {
        await handleRunGapAnalysis(false);
      }

      await fetchQuizAttempts(token);
    } catch (err) {
      console.error("[handleQuizSubmit] Error:", err);
      showToast(err.message || "Failed to submit quiz.", "error");
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  // Handler: Run ML Gap Analysis
  const handleRunGapAnalysis = async (openModal = true) => {
    setIsAnalyzing(true);
    if (openModal) {
      showToast("Running Python Sentence-Transformer ML Gap Analysis...", "loading");
    }

    try {
      const token = (await getToken()) || "dev-test-token";
      const res = await fetch(`${API_BASE_URL}/competency/analyze`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to run gap analysis.");
      }

      applyRecalibratedProfile(data, courseListRef.current, certificateListRef.current);
      await fetchMLRecommendations(token);

      if (openModal) {
        setIsGapModalOpen(true);
        showToast("🎯 Real-Time Python ML Gap Analysis & Impact Report Ready!", "success");
      }
    } catch (err) {
      console.error("[handleRunGapAnalysis] Error:", err);
      showToast(err.message || "Gap analysis failed.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handler: Start Learning Path
  const handleStartLearningPath = async () => {
    setIsStartingPath(true);
    showToast("Starting your personalized learning pathway...", "loading");

    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/learning-path/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId: "data-gov-mastery" }),
      });

      if (!res.ok) {
        throw new Error("Failed to initialize learning path.");
      }

      setLearningPathProgress(45);
      showToast("🚀 Learning Path activated! Navigating to roadmap...", "success");
      setTimeout(() => setActiveNav("learning-path"), 300);
    } catch (err) {
      console.error("[handleStartLearningPath] Error:", err);
      showToast(err.message || "Could not start learning path.", "error");
    } finally {
      setIsStartingPath(false);
    }
  };

  // Handler: Complete Learning Pathway & Recalibrate Cadre Readiness (+3% Boost)
  const handleCompletePathway = async (pathInfo) => {
    const domainLower = String(pathInfo?.domain || pathInfo?.title || "").toLowerCase();
    let targetDomainKey = "digitalGovernance";
    if (domainLower.includes("tech") || domainLower.includes("python") || domainLower.includes("r ") || domainLower.includes("data science")) {
      targetDomainKey = "technical";
    } else if (domainLower.includes("stat") || domainLower.includes("survey") || domainLower.includes("account") || domainLower.includes("sample")) {
      targetDomainKey = "statistical";
    } else if (domainLower.includes("behav") || domainLower.includes("lead") || domainLower.includes("ethic")) {
      targetDomainKey = "behavioural";
    } else {
      targetDomainKey = "digitalGovernance";
    }

    // 1. Optimistic domain boost (+4% target, +1% other)
    setCompetencyList((prev) =>
      prev.map((d) => {
        const boost = d.id === targetDomainKey ? 4 : 1;
        const newPct = Math.min(100, (d.percent || 20) + boost);
        return {
          ...d,
          percent: newPct,
          status: newPct >= 75 ? "Strong" : newPct >= 50 ? "Average" : "Needs Improvement",
        };
      })
    );

    setSkillGapsList((prev) =>
      prev.map((s) => {
        const boost = s.id === targetDomainKey ? 4 : 1;
        const newPct = Math.min(100, (s.percent || 20) + boost);
        return {
          ...s,
          percent: newPct,
          status: newPct >= 75 ? "Strong" : newPct >= 50 ? "Average" : "Needs Improvement",
        };
      })
    );

    // 2. Optimistic overall readiness boost (+3%)
    const currentReadiness = gapModalData?.overallReadiness != null ? gapModalData.overallReadiness : 23;
    const boostedReadiness = Math.min(100, currentReadiness + 3);
    updateDashboardStats(boostedReadiness);

    showToast(`🎯 Pathway Mastered: "${pathInfo?.title || 'Cadre Pathway'}"! Overall Readiness boosted (+3%)!`, "success");

    // 3. Persist in MongoDB and run ML recalibration
    try {
      const token = (await getToken()) || "dev-test-token";
      const res = await fetch(`${API_BASE_URL}/learning-path/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pathId: pathInfo?.pathId,
          title: pathInfo?.title,
          domain: pathInfo?.domain,
          level: pathInfo?.level || 1,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.recalibratedProfile) {
          applyRecalibratedProfile(data.recalibratedProfile);
        }
        await fetchProgress(token);
      }
    } catch (err) {
      console.warn("[App] Complete pathway sync note:", err.message);
    }
  };

  // Handler: Start Course / Launch Course Modal
  const handleStartCourse = (course) => {
    setActiveCourse(course);
    setIsCourseModalOpen(true);
  };

  // Handler: Complete Course & Earn Certificate
  const handleCompleteCourse = async (course) => {
    setIsCourseModalOpen(false);

    const updatedCourses = courseList.map((c) =>
      c.id === course.id
        ? { ...c, percent: 100, status: "Completed" }
        : c
    );
    setCourseList(updatedCourses);
    courseListRef.current = updatedCourses;

    setContinueCourses((prev) =>
      prev.map((c) =>
        c.title === course.title ? { ...c, percent: 100, tag: "Completed" } : c
      )
    );

    const tempCert = {
      _id: `cert-${Date.now()}`,
      title: course.title,
      issuedDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      domain: course.domain || "Statistical",
      institute: "National Statistical Systems Training Academy (NSSTA)",
      regNumber: `NSSTA/ISS/${new Date().getFullYear()}/${Math.floor(10000 + Math.random() * 90000)}`,
    };

    const newCertList = [tempCert, ...certificateList.filter((c) => c.title !== course.title)];
    setCertificateList(newCertList);
    certificateListRef.current = newCertList;

    // Immediately boost the corresponding domain competency score dynamically
    const domainLower = String(course.domain || course.category || course.title || "").toLowerCase();
    let targetDomainKey = "statistical";
    if (domainLower.includes("tech") || domainLower.includes("python") || domainLower.includes("r ") || domainLower.includes("data science") || domainLower.includes("ai")) {
      targetDomainKey = "technical";
    } else if (domainLower.includes("gov") || domainLower.includes("dpdp") || domainLower.includes("privacy") || domainLower.includes("cyber") || domainLower.includes("digital")) {
      targetDomainKey = "digitalGovernance";
    } else if (domainLower.includes("behav") || domainLower.includes("lead") || domainLower.includes("ethic") || domainLower.includes("manage")) {
      targetDomainKey = "behavioural";
    } else {
      targetDomainKey = "statistical";
    }

    setCompetencyList((prev) =>
      prev.map((d) => {
        const boost = d.id === targetDomainKey ? 4 : 1;
        const newPct = Math.min(100, (d.percent || 20) + boost);
        return {
          ...d,
          percent: newPct,
          status: newPct >= 75 ? "Strong" : newPct >= 50 ? "Average" : "Needs Improvement",
        };
      })
    );

    setSkillGapsList((prev) =>
      prev.map((s) => {
        const boost = s.id === targetDomainKey ? 4 : 1;
        const newPct = Math.min(100, (s.percent || 20) + boost);
        return {
          ...s,
          percent: newPct,
          status: newPct >= 75 ? "Strong" : newPct >= 50 ? "Average" : "Needs Improvement",
        };
      })
    );

    setDetailedGaps((prev) =>
      prev.map((g) => {
        if (g.domain?.toLowerCase().includes(targetDomainKey.slice(0, 4))) {
          const newCurr = Math.min(5.0, Math.round((g.currentLevel + 0.2) * 10) / 10);
          return {
            ...g,
            currentLevel: newCurr,
            gap: Math.max(0, Math.round((g.requiredLevel - newCurr) * 10) / 10),
          };
        }
        return g;
      })
    );

    const currentReadiness = gapModalData?.overallReadiness != null ? gapModalData.overallReadiness : 23;
    const boostedReadiness = Math.min(100, currentReadiness + 3);
    updateDashboardStats(boostedReadiness, updatedCourses, newCertList);

    // Save permanently in MongoDB backend
    try {
      const token = (await getToken()) || "dev-test-token";
      const res = await fetch(`${API_BASE_URL}/progress/complete-course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: course.id,
          durationHours: course.duration_hours || 20,
          courseTitle: course.title,
          domain: course.domain,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        let finalCertList = newCertList;
        if (data.certificate) {
          finalCertList = [data.certificate, ...certificateList.filter((c) => c._id !== data.certificate._id && c.title !== course.title)];
          setCertificateList(finalCertList);
          certificateListRef.current = finalCertList;
        }
        if (data.recalibratedProfile) {
          applyRecalibratedProfile(data.recalibratedProfile, updatedCourses, finalCertList);
        }
        await handleRunGapAnalysis(true);
        await fetchProgress(token);
      } else {
        await handleRunGapAnalysis(true);
      }
    } catch (saveErr) {
      console.warn("[App] Complete course save note:", saveErr.message);
      await handleRunGapAnalysis(true);
    }

    showToast(`🎓 Congratulations! Course completed & Certificate earned in "${course.title}". Competency boosted!`, "success");
  };

  // Handler: View Certificate Modal
  const handleViewCertificate = (certOrCourse) => {
    const cert = certOrCourse.issuedDate
      ? certOrCourse
      : {
          id: `cert-${certOrCourse.id}`,
          title: certOrCourse.title,
          issuedDate: "Accredited",
          domain: certOrCourse.domain || "Statistical Competency",
        };
    setActiveCertificate(cert);
    setIsCertModalOpen(true);
  };

  // Handler: Save Profile & Sync ML
  const handleSaveProfile = async (formData) => {
    setIsSavingProfile(true);
    showToast("Saving profile and recalibrating ML models...", "loading");

    try {
      if (formData.name) localStorage.setItem("algox_user_name", formData.name);
      if (formData.designation) localStorage.setItem("algox_user_designation", formData.designation);

      const token = (await getToken()) || "dev-test-token";
      const res = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile.");
      }

      setProfileData((prev) => ({ ...prev, ...formData, ...data }));
      if (data.recalibratedProfile) {
        applyRecalibratedProfile(data.recalibratedProfile);
      } else {
        await handleRunGapAnalysis(false);
      }
      showToast("✅ Profile saved! AI Competency & Gap models recalibrated.", "success");
    } catch (err) {
      console.error("[handleSaveProfile] Error:", err);
      showToast(err.message || "Failed to save profile.", "error");
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="flex bg-[#07090e] min-h-screen font-sans antialiased text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[500px] bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-[500px] h-[400px] bg-gradient-to-tr from-purple-600/10 via-indigo-500/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Interactive Modals */}
      <AIQuizModal
        quiz={activeQuiz}
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        onSubmitAnswers={handleQuizSubmit}
        isSubmitting={isSubmittingQuiz}
        result={quizResult}
        onRunAnalysis={handleRunGapAnalysis}
        onRetake={() => setQuizResult(null)}
      />

      <CourseModal
        course={activeCourse}
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onCompleteCourse={handleCompleteCourse}
        onRunAnalysis={() => handleRunGapAnalysis(true)}
      />

      <CertificateModal
        cert={activeCertificate}
        userName={user.name}
        userDesignation={user.designation}
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />

      <GapAnalysisModal
        isOpen={isGapModalOpen}
        onClose={() => setIsGapModalOpen(false)}
        analysisData={gapModalData}
        user={user}
        onStartCourse={() => setActiveNav("courses")}
      />

      {/* 24/7 AI Statistical Mentor Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        user={user}
      />

      {/* Sidebar */}
      <Sidebar
        activeItem={activeNav}
        onNavigate={setActiveNav}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentRole={currentRole}
        isAdminInDB={isAdminInDB}
      />

      <div className="flex-1 min-w-0 flex flex-col relative z-10">
        {/* Header */}
        <Header
          user={user}
          currentRole={currentRole}
          isAdminInDB={isAdminInDB}
          onToggleRole={(role) => {
            setCurrentRole(role);
            if (role === "admin") {
              setActiveNav("admin-dashboard");
              showToast?.("👑 Switched to Administrator View", "info");
            } else {
              setActiveNav("dashboard");
              showToast?.("👤 Switched to Official Cadre View", "info");
            }
          }}
          onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
          onMenuClick={() => setSidebarOpen(true)}
          onNavigate={setActiveNav}
          courses={courseList}
          onSelectSearchResult={handleStartCourse}
          notifications={notifications}
          onClearNotifications={() => setNotifications([])}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-7 max-w-7xl w-full mx-auto">
          {activeNav === "dashboard" && (
            <>
              {/* Welcome Hero Banner */}
              <div className="flex items-center justify-between flex-wrap gap-4 p-5 sm:p-6 rounded-3xl bg-[#0f1422]/70 backdrop-blur-xl border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      Cadre Dashboard
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Indian Statistical Service &amp; SSS
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                    Good Day, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">{user.name}</span>! 👋
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                    Personalized iGOT Karmayogi &amp; NSSTA TPAC pathways powered by real-time AI Sentence-Transformer models.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsAIAssistantOpen(true)}
                    className="flex items-center gap-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 border border-white/10 px-4 py-2.5 rounded-xl transition-all shadow-[0_0_18px_rgba(99,102,241,0.35)] cursor-pointer"
                  >
                    <Bot size={15} /> Karmayogi Sahayak
                  </button>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2.5 rounded-xl shadow-xs">
                    <Sparkles size={14} className="text-emerald-400" /> NSSTA Verified
                  </span>
                </div>
              </div>

              {/* Stats Overview */}
              <StatsGrid stats={stats} />

              {/* Core 3-Column Action Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                <div className="xl:col-span-1">
                  <SkillGapOverview
                    skills={skillGapsList}
                    onViewDetails={() => setIsGapModalOpen(true)}
                    onRunAnalysis={handleRunGapAnalysis}
                    isAnalyzing={isAnalyzing}
                  />
                </div>
                <div className="xl:col-span-1">
                  <RecommendedPath
                    path={recommendedPathData}
                    onStart={handleStartLearningPath}
                    onViewFullPath={() => setActiveNav("learning-path")}
                    isStarting={isStartingPath}
                  />
                </div>
                <div className="xl:col-span-1 space-y-6">
                  <AIQuizGenerator
                    onUpload={handleQuizUpload}
                    onGenerateSample={handleGenerateSample}
                    isGenerating={isGeneratingQuiz}
                    attempts={quizAttempts}
                    showHistory={false}
                    onReviewAttempt={(attempt) => {
                      setActiveQuiz({
                        attemptId: attempt._id,
                        sourceFileName: attempt.sourceFileName,
                        questions: attempt.questions,
                      });
                      setQuizResult({
                        score: attempt.score,
                        total: attempt.totalQuestions,
                        percentage: Math.round(((attempt.score || 0) / (attempt.totalQuestions || 5)) * 100),
                        questions: attempt.questions,
                      });
                      setIsQuizModalOpen(true);
                    }}
                  />
                  <ProgressWidget
                    summary={dynamicProgressSummary}
                    onViewDetails={() => setActiveNav("progress")}
                  />
                </div>
              </div>

              {/* Continue Learning */}
              <ContinueLearning
                courses={continueCourses}
                onViewAll={() => setActiveNav("courses")}
                onStartCourse={handleStartCourse}
              />
            </>
          )}

          {activeNav === "admin-dashboard" && (
            isAdminInDB ? (
              <AdminDashboard adminData={adminAnalyticsData} />
            ) : (
              <div className="max-w-2xl mx-auto py-12 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                  <ShieldAlert size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Administrator Access Restricted</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Your account is not registered in the MoSPI Administrator database. Only authorized training heads can access organizational records and all officials directory.
                </p>
                <button
                  onClick={() => {
                    setCurrentRole("learner");
                    setActiveNav("dashboard");
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
                >
                  Return to Learner Dashboard
                </button>
              </div>
            )
          )}

          {activeNav === "virtual-lab" && (
            <VirtualLab />
          )}

          {activeNav === "ai-mentor" && (
            <div className="max-w-4xl mx-auto py-2">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <Bot size={32} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800">Karmayogi Sahayak</h2>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-1">
                    Your dedicated AI Statistical Mentor with deep domain knowledge in MoSPI surveys, National Accounts, CPI/WPI, and Python/R statistical analysis.
                  </p>
                </div>
                <button
                  onClick={() => setIsAIAssistantOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md transition inline-flex items-center gap-2"
                >
                  <Sparkles size={16} /> Open Interactive AI Mentor
                </button>
              </div>
            </div>
          )}

          {activeNav === "competencies" && (
            <MyCompetencies
              domains={competencyList}
              onRunAnalysis={handleRunGapAnalysis}
              isAnalyzing={isAnalyzing}
              onOpenQuiz={() => setActiveNav("ai-quiz")}
              onViewCourses={() => setActiveNav("courses")}
            />
          )}

          {activeNav === "skill-gaps" && (
            <SkillGaps
              gaps={detailedGaps}
              onStartCourseForGap={(gap) => {
                const foundCourse =
                  courseList.find((c) => c.domain?.toLowerCase() === gap.domain?.toLowerCase()) ||
                  courseList[0];
                handleStartCourse(foundCourse);
              }}
              onRunAnalysis={handleRunGapAnalysis}
              isAnalyzing={isAnalyzing}
            />
          )}

          {activeNav === "courses" && (
            <Courses
              courses={courseList}
              onStartCourse={handleStartCourse}
              onViewCertificate={handleViewCertificate}
            />
          )}

          {activeNav === "ai-quiz" && (
            <div className="max-w-4xl mx-auto py-4">
              <AIQuizGenerator
                onUpload={handleQuizUpload}
                onGenerateSample={handleGenerateSample}
                isGenerating={isGeneratingQuiz}
                attempts={quizAttempts}
                onReviewAttempt={(attempt) => {
                  setActiveQuiz({
                    attemptId: attempt._id,
                    sourceFileName: attempt.sourceFileName,
                    questions: attempt.questions,
                  });
                  setQuizResult({
                    score: attempt.score,
                    total: attempt.totalQuestions,
                    percentage: Math.round(((attempt.score || 0) / (attempt.totalQuestions || 5)) * 100),
                    questions: attempt.questions,
                  });
                  setIsQuizModalOpen(true);
                }}
              />
            </div>
          )}

          {activeNav === "progress" && (
            <FullProgress
              history={initialProgressHistory}
              summary={dynamicProgressSummary}
              competencyList={competencyList}
              courses={courseList}
              certificates={certificateList}
              detailedGaps={detailedGaps}
              profileData={profileData}
            />
          )}

          {activeNav === "certificates" && (
            <Certificates
              certificates={certificateList}
              onViewCertificate={handleViewCertificate}
              onBrowseCourses={() => setActiveNav("courses")}
            />
          )}

          {activeNav === "learning-path" && (
            <LearningPathView
              competencyList={competencyList}
              detailedGaps={detailedGaps}
              profileData={profileData}
              onStartCourse={handleStartCourse}
              onCompletePathway={handleCompletePathway}
              onPathProgressUpdate={(activePathInfo) => {
                if (activePathInfo) {
                  setRecommendedPathData((prev) => ({
                    ...prev,
                    title: activePathInfo.title || prev.title,
                    description: activePathInfo.subtitle || prev.description,
                    steps: activePathInfo.stages?.map((stg, sIdx) => ({
                      id: sIdx + 1,
                      title: stg.title,
                      description: stg.description,
                      completed: stg.status === "Completed",
                    })) || prev.steps,
                  }));
                }
              }}
            />
          )}

          {activeNav === "profile" && (
            <ProfileView
              user={user}
              profileData={profileData}
              onSaveProfile={handleSaveProfile}
              isSaving={isSavingProfile}
              onRunAnalysis={handleRunGapAnalysis}
              isAnalyzing={isAnalyzing}
            />
          )}

          {activeNav === "resources" && (
            <ResourceLibrary
              documents={documents}
              onUploadDoc={handleQuizUpload}
              onGenerateQuizFromDoc={handleGenerateQuizFromDoc}
              onDeleteDoc={handleDeleteDocument}
            />
          )}

          {activeNav === "notifications" && (
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-xl font-bold text-slate-800">Your Notifications</h1>
              <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-xs">
                {notifications.map((n, i) => (
                  <div key={i} className="p-4 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Bell size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{n.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeNav === "settings" && (
            <SimplePage
              title="Settings"
              description="System preferences, notification settings, and accessibility options."
              icon={Settings}
            />
          )}

          {activeNav === "help" && (
            <SimplePage
              title="Help & Support"
              description="iGOT Karmayogi helpdesk, AlgoX guides, and technical support contacts."
              icon={HelpCircle}
            />
          )}
        </main>
      </div>
    </div>
  );
}