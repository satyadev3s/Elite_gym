import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MemberDashboardHeader from "./components/MemberDashboardHeader";
import ClubFacilities from "./components/ClubFacilities";
import Testimonials from "./components/Testimonials";
import FAQSection from "./components/FAQSection";
import MuscleMap from "./components/MuscleMap";
import WorkoutPrograms from "./components/WorkoutPrograms";
import ClassBooking from "./components/ClassBooking";
import MembershipPlans from "./components/MembershipPlans";
import FitnessCalculators from "./components/FitnessCalculators";
import ProgressTracker from "./components/ProgressTracker";
import Trainers from "./components/Trainers";
import Contacts from "./components/Contacts";
import Footer from "./components/Footer";
import AIAssistant from "./components/AIAssistant";
import LoginPage from "./pages/LoginPage";
import PaymentPage from "./pages/PaymentPage";
import "./App.css";

// Calculators removed from top navigation tabs - accessible directly inside the Dashboard
const MEMBER_TABS = ["dashboard", "musclemap", "programs", "classes", "progress"];

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
        // Clean out legacy dummy test profile if present
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
  const [authView, setAuthView] = useState(false);
  const [paymentView, setPaymentView] = useState(() => {
    const hash = window.location.hash.toLowerCase().replace("#", "").trim();
    if (hash === "payment" || hash === "checkout") {
      return { plan: null, cycle: "monthly" };
    }
    return null;
  });

  // Sync activeTab with hashchange in URL and smoothly scroll to public sections
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase().replace("#", "").trim();

      // Check payment or checkout hash
      if (hash === "payment" || hash === "checkout") {
        if (!currentUser) {
          setPaymentView((prev) => prev || { plan: null, cycle: "monthly" });
          setAuthView(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      }

      // Check login or signin hash
      if (hash === "login" || hash === "signin") {
        if (!currentUser) {
          setAuthView(true);
          setPaymentView(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      }

      // If calculators requested via hash, require login if not authenticated
      if (hash === "calculators") {
        if (!currentUser) {
          setAuthView(true);
          return;
        }
        setActiveTab("dashboard");
        setTimeout(() => {
          const calcElement = document.getElementById("calculators");
          if (calcElement) {
            calcElement.scrollIntoView({ behavior: "smooth" });
          }
        }, 120);
        return;
      }

      if (MEMBER_TABS.includes(hash)) {
        if (!currentUser) {
          setAuthView(true);
          return;
        }
        setActiveTab(hash);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      // If an overlay view was active, close it and return to landing page
      if (authView || paymentView) {
        setAuthView(false);
        setPaymentView(null);
      }

      // Top of landing page
      if (hash === "hero" || !hash) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      // Public landing page sections: smoothly scroll to the target element on single click
      setTimeout(() => {
        const targetElement = document.getElementById(hash);
        if (targetElement) {
          targetElement.classList.add("active");
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 60);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [currentUser, authView, paymentView]);

  // Handle direct hash navigation on initial page load (e.g. /#faq, /#features)
  useEffect(() => {
    const hash = window.location.hash.toLowerCase().replace("#", "").trim();
    if (hash && hash !== "hero" && !MEMBER_TABS.includes(hash) && hash !== "payment" && hash !== "checkout") {
      const timer = setTimeout(() => {
        const targetElement = document.getElementById(hash);
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

  const handleOpenLogin = () => {
    setAuthView(true);
    setPaymentView(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToLanding = () => {
    setAuthView(false);
    setPaymentView(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  // Scroll reveal trigger
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
          setAuthView(true);
          window.location.hash = "#login";
        }}
      />
    );
  }

  // SCENARIO 1: Dedicated Member Login / Registration Page
  if (authView && !currentUser) {
    return (
      <LoginPage
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setAuthView(false);
          setActiveTab("dashboard");
          window.location.hash = "#dashboard";
        }}
        onBackToLanding={handleBackToLanding}
      />
    );
  }

  // SCENARIO 2: Authenticated Member Portal
  // Calculators embedded directly in Dashboard; isolated views for musclemap, programs, classes, progress
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
          {activeTab === "dashboard" && (
            <div className="dashboard-view-wrapper">
              <MemberDashboardHeader
                user={currentUser}
                onNavigate={handleSelectTab}
              />
              {/* Fitness Calculators suite added directly into the Dashboard view */}
              <FitnessCalculators />
            </div>
          )}

          {activeTab === "musclemap" && <MuscleMap />}

          {activeTab === "programs" && <WorkoutPrograms />}

          {activeTab === "classes" && <ClassBooking />}

          {activeTab === "progress" && <ProgressTracker />}
        </main>

        <AIAssistant />
      </div>
    );
  }

  // SCENARIO 3 (DEFAULT): Commercial Landing Page
  return (
    <div className="app-container landing-page-active">
      <Navbar
        user={null}
        onOpenLogin={handleOpenLogin}
      />
      <Hero
        user={null}
        onOpenLogin={handleOpenLogin}
      />
      <ClubFacilities
        onOpenLogin={handleOpenLogin}
      />
      <Trainers />
      <MembershipPlans
        onJoinClick={handleOpenLogin}
        onProceedToPayment={handleProceedToPayment}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setActiveTab("dashboard");
          window.location.hash = "#dashboard";
        }}
      />
      <FAQSection onOpenLogin={handleOpenLogin} />
      <Contacts />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default App;