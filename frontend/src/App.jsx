import { useState, useEffect, useCallback } from "react";
import { SignedIn, SignedOut, useUser, useAuth } from "@clerk/clerk-react";
import { Sparkles, Route, FolderOpen, Bell, User, Settings, HelpCircle, BookOpen } from "lucide-react";

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

  // App Data States
  const [stats, setStats] = useState(initialOverviewStats);
  const [skillGapsList, setSkillGapsList] = useState(initialSkillGaps);
  const [detailedGaps, setDetailedGaps] = useState(initialDetailedSkillGaps);
  const [competencyList, setCompetencyList] = useState(initialCompetencyDomains);
  const [courseList, setCourseList] = useState(initialAllCourses);
  const [continueCourses, setContinueCourses] = useState(initialContinueLearningCourses);
  const [recommendedPathData, setRecommendedPathData] = useState(initialRecommendedPath);
  const [certificateList, setCertificateList] = useState(initialCertificates);
  const [learningPathProgress, setLearningPathProgress] = useState(25);
  const [profileData, setProfileData] = useState(null);
  const [documents, setDocuments] = useState([]);

  // Notifications
  const [notifications, setNotifications] = useState([
    { title: "New AI Assessment Available", description: "Test your skills on Census and Survey Sampling standards." },
    { title: "Competency Recommendation", description: "Your gap analysis recommends Python for Official Statistics." },
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
      : clerkUser?.username || "Officer",
    email: clerkUser?.primaryEmailAddress?.emailAddress || "officer@mospi.gov.in",
    notificationsCount: notifications.length,
  };

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
          // Format courses with colors & status
          const colorList = ["blue", "orange", "green", "purple"];
          const formatted = recCourses.map((c, i) => ({
            ...c,
            color: colorList[i % colorList.length],
            percent: Math.min(85, Math.max(10, Math.round((c.matchScore || 0.4) * 100))),
            status: i === 0 ? "In Progress" : i < 3 ? "Recommended" : "Available",
          }));

          setCourseList(formatted);

          // Set top 4 in continue learning
          setContinueCourses(
            formatted.slice(0, 4).map((c) => ({
              id: c.id,
              title: c.title,
              tag: c.status,
              percent: c.percent,
              color: c.color,
              domain: c.domain,
            }))
          );

          // Set top 1 in recommended learning path
          const topCourse = formatted[0];
          setRecommendedPathData({
            title: topCourse.title,
            description: `ML Recommended based on your highest skill gaps (${topCourse.domain || "Official Statistics"}).`,
            steps: [
              { id: 1, title: `Foundations: ${topCourse.title}`, description: "Core concepts & official methodology", completed: true },
              { id: 2, title: "Government Data Standards & Applications", description: "Practical hands-on case study", completed: false },
              { id: 3, title: "Advanced Policy Implementation", description: "District-level execution and reporting", completed: false },
              { id: 4, title: "Accredited Assessment & Evaluation", description: "Earn verified certificate of competency", completed: false },
            ],
          });
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

  // Helper to fetch live competency gap analysis from Python ML service
  const fetchCompetencyData = useCallback(async (token) => {
    try {
      const res = await fetch(`${API_BASE_URL}/competency/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
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

        if (data.skillGaps && data.skillGaps.length > 0) {
          setDetailedGaps(
            data.skillGaps.map((g, idx) => ({
              id: `sg-${idx}`,
              skill: g.skillName,
              domain: g.skillName,
              currentLevel: g.currentLevel,
              requiredLevel: g.requiredLevel,
              gap: g.gap,
            }))
          );
        }
      }
    } catch (err) {
      console.warn("[App] Competency data load note:", err.message);
    }
  }, []);

  // Sync user profile & load ML Data on login
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

        // 2. Fetch ML Competencies & Recommendations & Stored Documents
        await fetchCompetencyData(token);
        await fetchMLRecommendations(token);
        await fetchDocuments(token);
      } catch (err) {
        console.warn("[App] Initial bootstrap note:", err.message);
      }
    }

    if (clerkUser) {
      initUserAndML();
    }
  }, [clerkUser, getToken, fetchCompetencyData, fetchMLRecommendations, fetchDocuments, user.name, user.email]);

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

      // Update overview stats
      setStats((prev) =>
        prev.map((s) =>
          s.id === "overall-competency"
            ? { ...s, value: `${Math.min(95, parseInt(s.value) + 2)}%` }
            : s
        )
      );
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

      // Update live competencies
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

      if (data.skillGaps) {
        setDetailedGaps(
          data.skillGaps.map((g, idx) => ({
            id: `sg-${idx}`,
            skill: g.skillName,
            domain: g.skillName,
            currentLevel: g.currentLevel,
            requiredLevel: g.requiredLevel,
            gap: g.gap,
          }))
        );
      }

      // Refresh ML Course Recommendations
      await fetchMLRecommendations(token);

      // Open interactive AI Gap Analysis Modal
      setGapModalData(data);
      setIsGapModalOpen(true);

      showToast("🎯 Python ML Gap Analysis & Impact Report Ready!", "success");
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

      setLearningPathProgress(35);
      showToast("🚀 Learning Path activated! Navigating to your roadmap...", "success");
      setTimeout(() => setActiveNav("learning-path"), 400);
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

    // Update course status in courseList
    setCourseList((prev) =>
      prev.map((c) =>
        c.id === course.id
          ? { ...c, percent: 100, status: "Completed" }
          : c
      )
    );

    // Update continue courses
    setContinueCourses((prev) =>
      prev.map((c) =>
        c.title === course.title ? { ...c, percent: 100, tag: "Completed" } : c
      )
    );

    // Add new Certificate
    const newCert = {
      id: `cert-${Date.now()}`,
      title: course.title,
      issuedDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      domain: course.domain || "Official Statistics",
    };

    setCertificateList((prev) => [newCert, ...prev]);

    // Update stats
    setStats((prev) =>
      prev.map((s) =>
        s.id === "courses-completed"
          ? { ...s, value: Number(s.value) + 1 }
          : s
      )
    );

    showToast(`🎓 Congratulations! You earned a Certificate in "${course.title}"!`, "success");
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

      // Auto-trigger fresh gap analysis with new profile params
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

      {/* Sidebar */}
      <Sidebar
        activeItem={activeNav}
        onNavigate={setActiveNav}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <Header
          user={user}
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
                  <h1 className="text-lg sm:text-2xl font-extrabold text-slate-800 tracking-tight">
                    Good Morning, {user.name}! 👋
                  </h1>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Personalized iGOT Karmayogi learning pathway powered by Python Sentence-Transformer embeddings.
                  </p>
                </div>
                <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 px-4 py-2 rounded-full shadow-2xs">
                  <Sparkles size={15} className="text-blue-600" /> AI-Powered Platform
                </span>
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

          {activeNav === "competencies" && (
            <MyCompetencies domains={competencyList} />
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