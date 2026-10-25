import React from "react";
import HeroBackgroundAnimation from "./HeroBackgroundAnimation";
import "./styles/MemberDashboardHeader.css";

const MemberDashboardHeader = ({ user, onNavigate }) => {
  if (!user) return null;

  const handleNavClick = (tabId, e) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(tabId);
    }
  };

  return (
    <section className="member-dashboard-header" id="hero">
      <HeroBackgroundAnimation />
      <div className="mdh-backdrop-overlay"></div>

      <div className="mdh-content">
        {/* Top Profile Strip - Fully visible below fixed navbar */}
        <div className="mdh-welcome-row">
          <div className="mdh-profile-box">
            <div className="mdh-avatar-wrapper">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="mdh-avatar" />
              ) : (
                <div className="mdh-avatar-fallback">
                  {user.name ? user.name.charAt(0).toUpperCase() : "M"}
                </div>
              )}
              <span className="mdh-online-status" title="Active Session"></span>
            </div>
            <div className="mdh-profile-text">
              <div className="mdh-tier-row">
                <span className="mdh-tier-badge">{user.tierBadge || "⭐ Pro Member"}</span>
                <span className="mdh-id-badge">ID: {user.memberId}</span>
                <span className="mdh-joined-date">Member Since: {user.joinedDate || "Recent"}</span>
              </div>
              <h1 className="mdh-greeting">
                Welcome, <span>{user.name}</span>
              </h1>
              <p className="mdh-goal">
                🎯 Training Objective: <strong>{user.goal}</strong>
              </p>
            </div>
          </div>

          <div className="mdh-action-btns">
            <a
              href="#musclemap"
              className="mdh-btn primary"
              onClick={(e) => handleNavClick("musclemap", e)}
            >
              Launch MuscleMap 3D 🧬
            </a>
            <a
              href="#programs"
              className="mdh-btn secondary"
              onClick={(e) => handleNavClick("programs", e)}
            >
              Workout Programs 🏋️
            </a>
          </div>
        </div>

        {/* Dynamic Member Portal Overview Cards */}
        <div className="mdh-metrics-grid">
          <div className="mdh-card">
            <div className="mdh-card-top">
              <span className="card-emoji">⚡</span>
              <span className="card-trend positive">Tier Active</span>
            </div>
            <span className="card-num" style={{ fontSize: "1.2rem" }}>{user.tier || "Iron Pro Athlete"}</span>
            <span className="card-lbl">Membership Level</span>
            <div className="card-progress-bar">
              <div className="card-progress-fill" style={{ width: "100%" }}></div>
            </div>
          </div>

          <div className="mdh-card">
            <div className="mdh-card-top">
              <span className="card-emoji">🎯</span>
              <span className="card-trend positive">Active Goal</span>
            </div>
            <span className="card-num" style={{ fontSize: "1.1rem" }}>{user.goal || "Hypertrophy & Strength"}</span>
            <span className="card-lbl">Program Biomechanics</span>
            <div className="card-progress-bar">
              <div className="card-progress-fill recovery" style={{ width: "100%" }}></div>
            </div>
          </div>

          <div className="mdh-card">
            <div className="mdh-card-top">
              <span className="card-emoji">🧬</span>
              <span className="card-trend positive">Interactive Anatomy</span>
            </div>
            <span className="card-num" style={{ fontSize: "1.2rem" }}>MuscleMap 3D</span>
            <span className="card-lbl">Targeted Muscle Activation</span>
            <a
              href="#musclemap"
              className="card-quick-action"
              onClick={(e) => handleNavClick("musclemap", e)}
            >
              Launch Visualizer ➔
            </a>
          </div>

          <div className="mdh-card">
            <div className="mdh-card-top">
              <span className="card-emoji">📅</span>
              <span className="card-trend neutral">Live Schedule</span>
            </div>
            <span className="card-num" style={{ fontSize: "1.2rem" }}>Live Classes</span>
            <span className="card-lbl">HIIT, Yoga, Conditioning Slots</span>
            <a
              href="#classes"
              className="card-quick-action"
              onClick={(e) => handleNavClick("classes", e)}
            >
              Book Class Slot ➔
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberDashboardHeader;
