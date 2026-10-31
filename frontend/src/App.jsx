import React, { useState, useEffect, Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import ThreeHero3D from "./components/ThreeHero3D";
import WorkoutPrograms3D from "./components/WorkoutPrograms3D";
import ClubFacilities from "./components/ClubFacilities";
import Testimonials from "./components/Testimonials";
import FAQSection from "./components/FAQSection";
import MembershipPlans from "./components/MembershipPlans";
import Trainers from "./components/Trainers";
import Contacts from "./components/Contacts";
import Footer from "./components/Footer";
import "./App.css";

// Lazy-loaded on-demand modules to ensure instantaneous mobile landing page performance
const LoginPage = lazy(() => import("./pages/LoginPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const ThreeMemberHUD = lazy(() => import("./components/ThreeMemberHUD"));
const FitnessCalculators = lazy(() => import("./components/FitnessCalculators"));
const MuscleMap = lazy(() => import("./components/MuscleMap"));
const WorkoutPrograms = lazy(() => import("./components/WorkoutPrograms"));
const ClassBooking = lazy(() => import("./components/ClassBooking"));
const ProgressTracker = lazy(() => import("./components/ProgressTracker"));
const AIAssistant = lazy(() => import("./components/AIAssistant"));

const LoadingFallback = () => (
  <div
    style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "14px",
      background: "#050609",
      color: "#94a3b8",
      fontFamily: "var(--font-display, sans-serif)",
      letterSpacing: "1.5px",
      textTransform: "uppercase",
      fontSize: "0.92rem",
    }}
  >
    <div
      style={{
        width: "36px",
        height: "36px",
        border: "3px solid rgba(255, 85, 0, 0.2)",
        borderTopColor: "#ff5500",
        borderRadius: "50%",
        animation: "eliteSpin 0.75s linear infinite",
      }}
    />
    <span>Loading Elite Module...</span>
    <style>{`@keyframes eliteSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

// Authenticated member navigation tabs
const MEMBER_TABS = ["dashboard", "musclemap", "programs", "classes", "progress"];

// Comprehensive URL Hash Aliases for seamless direct link navigation
const PUBLIC_SECTION_ALIASES = {
  home: "hero",
  hero: "hero",
  programs: "programs-preview",
  "programs-preview": "programs-preview",
  workouts: "programs-preview",
  facilities: "features",
  features: "features",
  amenities: "features",
  coaches: "trainers",
  trainers: "trainers",
  team: "trainers",
  membership: "membership",
  pricing: "membership",
  plans: "membership",
  pass: "membership",
  results: "testimonials",
  testimonials: "testimonials",
  reviews: "testimonials",
  faq: "faq",
  intel: "faq",
  help: "faq",
  contact: "contact",
  contacts: "contact",
  location: "contact",
  arena: "contact",
};

const getTabFromHash = () => {
  const hash = window.location.hash.toLowerCase().replace("#", "").trim();
  if (hash === "calculators") return "dashboard";
  if (MEMBER_TABS.includes(hash)) {
    return hash;
  }
  return "dashboard";
};

const App = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved =
        localStorage.getItem("ironfit_current_user") ||
        sessionStorage.getItem("ironfit_current_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email === "alex.morgan@ironfit.com" && parsed.memberId === "IF-839214") {
          localStorage.removeItem("ironfit_current_user");
          sessionStorage.removeItem("ironfit_current_user");
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState(getTabFromHash);
  const [authView, setAuthView] = useState(() => {
    const hash = window.location.hash.toLowerCase().replace("#", "").trim();
    if (hash === "register" || hash === "signup") return "register";
    if (hash === "login" || hash === "signin") return "login";
    return false;
  });

  const [paymentView, setPaymentView] = useState(() => {
    const hash = window.location.hash.toLowerCase().replace("#", "").trim();
    if (hash === "payment" || hash === "checkout") {
      return { plan: null, cycle: "monthly" };
    }
    return null;
  });

  // URL Hashchange & Popstate Router Coordinator
  useEffect(() => {
    const handleLocationChange = () => {
      const rawHash = window.location.hash.toLowerCase().replace("#", "").trim();

      // 1. Checkout / Payment Route
      if (rawHash === "payment" || rawHash === "checkout") {
        if (!currentUser) {
          setPaymentView({ plan: null, cycle: "monthly" });
          setAuthView(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      }

      // 2. Auth Routes (Login & Register)
      if (rawHash === "register" || rawHash === "signup") {
        if (!currentUser) {
          setAuthView("register");
          setPaymentView(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      }

      if (rawHash === "login" || rawHash === "signin") {
        if (!currentUser) {
          setAuthView("login");
          setPaymentView(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      }

      // If user navigated away from auth or payment, always close the overlays!
      setAuthView(false);
      setPaymentView(null);

      // 3. Calculators route inside dashboard
      if (rawHash === "calculators") {
        if (currentUser) {
          setActiveTab("dashboard");
        }
        setTimeout(() => {
          const calcElement = document.getElementById("calculators");
          if (calcElement) {
            calcElement.scrollIntoView({ behavior: "smooth" });
          }
        }, 120);
        return;
      }

      // 4. Authenticated Member Portal Tabs
      if (currentUser && MEMBER_TABS.includes(rawHash)) {
        setActiveTab(rawHash);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      // 5. If user is logged out and requests a member tab (except 'programs' which has public equivalent)
      if (!currentUser && MEMBER_TABS.includes(rawHash)) {
        if (rawHash === "programs") {
          const target = document.getElementById("programs-preview");
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
          return;
        }
        setAuthView("login");
        return;
      }

      // 6. Public Section Router with Alias Resolution
      const resolvedSectionId = PUBLIC_SECTION_ALIASES[rawHash] || rawHash;

      if (resolvedSectionId === "hero" || !resolvedSectionId) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      setTimeout(() => {
        const targetElement = document.getElementById(resolvedSectionId);
        if (targetElement) {
          targetElement.classList.add("active");
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 80);
    };

    window.addEventListener("hashchange", handleLocationChange);
    window.addEventListener("popstate", handleLocationChange);
    return () => {
      window.removeEventListener("hashchange", handleLocationChange);
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, [currentUser]);

  // Initial mount route handling
  useEffect(() => {
    const rawHash = window.location.hash.toLowerCase().replace("#", "").trim();
    if (
      rawHash &&
      rawHash !== "hero" &&
      rawHash !== "login" &&
      rawHash !== "register" &&
      rawHash !== "payment" &&
      rawHash !== "checkout" &&
      !MEMBER_TABS.includes(rawHash)
    ) {
      const resolvedId = PUBLIC_SECTION_ALIASES[rawHash] || rawHash;
      const timer = setTimeout(() => {
        const targetElement = document.getElementById(resolvedId);
        if (targetElement) {
          targetElement.classList.add("active");
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSelectTab = (tabId) => {
    if (tabId === "calculators") {
      setActiveTab("dashboard");
      window.location.hash = "#calculators";
      setTimeout(() => {
        const calcElement = document.getElementById("calculators");
        if (calcElement) {
          calcElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return;
    }

    setActiveTab(tabId);
    window.location.hash = `#${tabId}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProceedToPayment = (plan, cycle) => {
    setPaymentView({ plan, cycle: cycle || "monthly" });
    setAuthView(false);
    window.location.hash = "#payment";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackFromPayment = () => {
    setPaymentView(null);
    window.location.hash = "#membership";
    setTimeout(() => {
      const memEl = document.getElementById("membership");
      if (memEl) memEl.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleOpenLogin = (mode = "login") => {
    setAuthView(mode);
    setPaymentView(null);
    window.location.hash = `#${mode}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToLanding = () => {
    setAuthView(false);
    setPaymentView(null);
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.hash = "#hero";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ironfit_current_user");
    sessionStorage.removeItem("ironfit_current_user");
    setCurrentUser(null);
    setAuthView(false);
    setPaymentView(null);
    window.location.hash = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Scroll reveal trigger for animations
  useEffect(() => {
    const handleScroll = () => {
      const revealElements = document.querySelectorAll(".reveal");
      revealElements.forEach((el) => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 60) {
          el.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    const timer = setTimeout(handleScroll, 80);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [currentUser, authView, activeTab]);

  // SCENARIO 0: Dedicated Standalone Payment / Checkout Page
  if (paymentView && !currentUser) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <PaymentPage
          key={paymentView.plan?.id || paymentView.cycle || "checkout"}
          initialPlan={paymentView.plan}
          initialCycle={paymentView.cycle}
          onPaymentSuccess={(user) => {
            setCurrentUser(user);
            setPaymentView(null);
            setAuthView(false);
            setActiveTab("dashboard");
            window.location.hash = "#dashboard";
          }}
          onBackToLanding={handleBackFromPayment}
          onNavigateLogin={() => {
            setPaymentView(null);
            setAuthView("login");
            window.location.hash = "#login";
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </Suspense>
    );
  }

  // SCENARIO 1: Dedicated Standalone Login & Athlete Registration Page
  if (authView && !currentUser) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <LoginPage
          initialMode={authView === "register" ? "register" : "login"}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setAuthView(false);
            setActiveTab("dashboard");
            window.location.hash = "#dashboard";
          }}
          onBackToLanding={handleBackToLanding}
        />
      </Suspense>
    );
  }

  // SCENARIO 2: Authenticated Member Portal
  if (currentUser) {
    return (
      <div className="app-container member-portal-active">
        <Navbar
          user={currentUser}
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          onLogout={handleLogout}
        />

        {/* Dedicated Member Portal View Content */}
        <main className="portal-main-content">
          <Suspense fallback={<LoadingFallback />}>
            {activeTab === "dashboard" && (
              <div className="dashboard-view-wrapper">
                <ThreeMemberHUD user={currentUser} onNavigate={handleSelectTab} />
                <FitnessCalculators />
              </div>
            )}

            {activeTab === "musclemap" && <MuscleMap />}

            {activeTab === "programs" && <WorkoutPrograms />}

            {activeTab === "classes" && <ClassBooking />}

            {activeTab === "progress" && <ProgressTracker />}
          </Suspense>
        </main>

        <Suspense fallback={null}>
          <AIAssistant />
        </Suspense>
      </div>
    );
  }

  // SCENARIO 3 (DEFAULT): Commercial Landing Page
  return (
    <div className="app-container landing-page-active">
      <Navbar user={null} onOpenLogin={() => handleOpenLogin("login")} />
      <ThreeHero3D user={null} onOpenLogin={() => handleOpenLogin("login")} />
      <WorkoutPrograms3D onOpenLogin={() => handleOpenLogin("login")} />
      <ClubFacilities onOpenLogin={() => handleOpenLogin("login")} />
      <Trainers />
      <MembershipPlans
        onJoinClick={() => handleOpenLogin("register")}
        onProceedToPayment={handleProceedToPayment}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setActiveTab("dashboard");
          window.location.hash = "#dashboard";
        }}
      />
      <FAQSection onOpenLogin={() => handleOpenLogin("login")} />
      <Contacts />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default App;
