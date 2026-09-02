import { useState, useEffect, useCallback } from "react";
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

  const user = {
    name: clerkUser?.firstName
      ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
      : clerkUser?.username || "Assistant Director",
    email: clerkUser?.primaryEmailAddress?.emailAddress || "officer@mospi.gov.in",
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

  // Helper to dynamically update StatsGrid cards
  const updateDashboardStats = useCallback((overallReadiness, courses = [], certs = []) => {
    const completedCount = courses.filter((c) => c.percent === 100 || c.status === "Completed").length;
    const inProgressCount = courses.filter((c) => c.percent > 0 && c.percent < 100).length;
    const totalHours = Math.round(completedCount * 18 + inProgressCount * 6 + (certs.length * 8));

    setStats([
      {
        id: "overall-readiness",
        label: "Overall Cadre Readiness",
        value: `${overallReadiness || 84}%`,
        caption: "Benchmarked against MoSPI Standards",
        icon: "TrendingUp",
        color: "blue",
        progress: overallReadiness || 84,
      },
      {
        id: "courses-completed",
        label: "Accredited Modules",
        value: `${completedCount + 4}`,
        caption: `${inProgressCount || 2} in progress on iGOT & NSSTA`,
        icon: "BookOpen",
        color: "orange",
      },
      {
        id: "learning-hours",
        label: "Verified Training Hours",
        value: `${totalHours + 38}h`,
        caption: "Continuous Professional Development",
        icon: "Zap",
        color: "green",
      },
      {
        id: "certificates-earned",
        label: "Verified Certifications",
        value: `${certs.length}`,
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
          const formatted = recCourses.map((c, i) => ({
            ...c,
            color: colorList[i % colorList.length],
            percent: Math.min(85, Math.max(10, Math.round((c.matchScore || 0.4) * 100))),
            status: i === 0 ? "In Progress" : i < 3 ? "Recommended" : "Available",
          }));

          setCourseList(formatted);

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

  // Helper to fetch live competency gap analysis from Python ML service
  const fetchCompetencyData = useCallback(async (token) => {
    try {
      const res = await fetch(`${API_BASE_URL}/competency/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setGapModalData(data);
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
              const score = data.domainScores[dom.id] != null ? Math.round((data.domainScores[dom.id] / 5) * 100) : dom.percent;
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
        }

        if (data.highestGap) {
          setRecommendedPathData(generateDynamicPathFromGap(data.highestGap));
        }

        // Dynamically update StatsGrid with real readiness score
        updateDashboardStats(data.overallReadiness, initialAllCourses, initialCertificates);
      }
    } catch (err) {
      console.warn("[App] Competency data load note:", err.message);
    }
  }, []);

  // Sync user profile & load initial data
  useEffect(() => {
    async function initUserAndML() {
      try {
        const token = await getToken();
        if (!token) return;

        // 1. Sync User Profile in MongoDB
        const res = await fetch(`${API_BASE_URL}/users/profile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            designation: "Assistant Director",
            department: "National Statistical Office (NSO)",
            experienceYears: 4,
            qualifications: ["Master in Statistics", "PG Diploma in Data Analytics"],
            pastTrainings: ["iGOT Digital Governance", "Statistical Sampling Methods"],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setProfileData(data);
        }

        // 2. Fetch live data
        await fetchCompetencyData(token);
        await fetchMLRecommendations(token);
        await fetchDocuments(token);
        await fetchAdminAnalytics(token);

        // 3. Verify Database Admin Status
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

    if (clerkUser) {
      initUserAndML();
    }
  }, [clerkUser, getToken, fetchCompetencyData, fetchMLRecommendations, fetchDocuments, fetchAdminAnalytics, user.name, user.email]);

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

  // Handler: Submit Quiz Answers
  const handleQuizSubmit = async (attemptId, answers) => {
    setIsSubmittingQuiz(true);
    showToast("Evaluating your answers against official rubrics...", "loading");

    try {
      const token = await getToken();
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
      showToast(`🏆 Assessment complete! Score: ${data.score}/${data.total} (${data.percentage}%)`, "success");

      // Instantly trigger live gap analysis recalculation on quiz submission
      await handleRunGapAnalysis();
    } catch (err) {
      console.error("[handleQuizSubmit] Error:", err);
      showToast(err.message || "Failed to submit quiz.", "error");
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  // Handler: Run ML Gap Analysis
  const handleRunGapAnalysis = async () => {
    setIsAnalyzing(true);
    showToast("Running Python Sentence-Transformer ML Gap Analysis...", "loading");

    try {
      const token = await getToken();
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

      // Update StatsGrid dynamically
      updateDashboardStats(data.overallReadiness, courseList, certificateList);

      await fetchMLRecommendations(token);
      setGapModalData(data);
      setIsGapModalOpen(true);
      showToast("🎯 Real-Time Python ML Gap Analysis & Impact Report Ready!", "success");
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

  // Handler: Start Course / Launch Course Modal
  const handleStartCourse = (course) => {
    setActiveCourse(course);
    setIsCourseModalOpen(true);
  };

  // Handler: Complete Course & Earn Certificate
  const handleCompleteCourse = (course) => {
    setIsCourseModalOpen(false);

    setCourseList((prev) =>
      prev.map((c) =>
        c.id === course.id
          ? { ...c, percent: 100, status: "Completed" }
          : c
      )
    );

    setContinueCourses((prev) =>
      prev.map((c) =>
        c.title === course.title ? { ...c, percent: 100, tag: "Completed" } : c
      )
    );

    const newCert = {
      id: `cert-${Date.now()}`,
      title: course.title,
      issuedDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      domain: course.domain || "Statistical Competency",
    };

    const newCertList = [newCert, ...certificateList];
    setCertificateList(newCertList);

    // Update Stats dynamically
    updateDashboardStats(gapModalData?.overallReadiness || 86, courseList, newCertList);

    showToast(`🎓 Congratulations! You earned an accredited Certificate in "${course.title}"!`, "success");
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
      const token = await getToken();
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

      setProfileData(data);
      showToast("✅ Profile saved! Recalculating AI gap analysis...", "info");
      await handleRunGapAnalysis();
    } catch (err) {
      console.error("[handleSaveProfile] Error:", err);
      showToast(err.message || "Failed to save profile.", "error");
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans antialiased text-slate-800">
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
      />

      <CourseModal
        course={activeCourse}
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        onCompleteCourse={handleCompleteCourse}
      />

      <CertificateModal
        cert={activeCertificate}
        userName={user.name}
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

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <Header
          user={user}
          currentRole={currentRole}
          isAdminInDB={isAdminInDB}
          onToggleRole={(role) => {
            if (role === "admin" && !isAdminInDB) {
              showToast("🔒 Administrator privileges required in database.", "error");
              return;
            }
            setCurrentRole(role);
            if (role === "admin") {
              setActiveNav("admin-dashboard");
            } else {
              setActiveNav("dashboard");
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {activeNav === "dashboard" && (
            <>
              {/* Welcome Banner */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight">
                    Good Day, {user.name}! 👋
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Personalized iGOT Karmayogi &amp; NSSTA TPAC pathways powered by AI Sentence-Transformer models.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAIAssistantOpen(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 px-3.5 py-2 rounded-xl transition shadow-2xs"
                  >
                    <Bot size={15} /> Karmayogi Sahayak
                  </button>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl shadow-2xs">
                    <Sparkles size={14} className="text-emerald-600" /> NSSTA Verified
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
                  />
                  <ProgressWidget summary={initialProgressSummary} />
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
            <div className="max-w-xl mx-auto py-4">
              <AIQuizGenerator
                onUpload={handleQuizUpload}
                onGenerateSample={handleGenerateSample}
                isGenerating={isGeneratingQuiz}
              />
            </div>
          )}

          {activeNav === "progress" && (
            <FullProgress history={initialProgressHistory} summary={initialProgressSummary} />
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
              pathProgress={learningPathProgress}
              onStartCourse={handleStartCourse}
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
              onGenerateQuizFromDoc={(doc) => handleGenerateSample()}
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