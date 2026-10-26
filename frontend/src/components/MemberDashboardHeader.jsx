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
        {/* Top Profile Strip */}
        <div className="mdh-welcome-row">
          <div className="mdh-profile-box">
            <div className="mdh-avatar-wrapper">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="mdh-avatar" />
              ) : (
                <div className="mdh-avatar-fallback">
                  {user.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
              )}
              <span className="mdh-online-status" title="Active Floor Session"></span>
            </div>
            <div className="mdh-profile-text">
              <div className="mdh-tier-row">
                <span className="mdh-tier-badge">{user.tierBadge || "PRO ATHLETE"}</span>
                <span className="mdh-id-badge">ID: {user.memberId}</span>
                <span className="mdh-joined-date">MEMBER SINCE: {user.joinedDate || "2026"}</span>
              </div>
              <h1 className="mdh-greeting">
                WELCOME BACK, <span>{user.name.toUpperCase()}</span>
              </h1>
              <div className="mdh-goal">
                <span className="goal-tag">OBJECTIVE:</span>
                <strong>{user.goal}</strong>
              </div>
            </div>
          </div>

          <div className="mdh-action-btns">
            <a
              href="#musclemap"
              className="mdh-btn primary"
              onClick={(e) => handleNavClick("musclemap", e)}
            >
              LAUNCH MUSCLEMAP 3D ➔
            </a>
            <a
              href="#programs"
              className="mdh-btn secondary"
              onClick={(e) => handleNavClick("programs", e)}
            >
              WORKOUT PROGRAMS ➔
            </a>
          </div>
        </div>

        {/* Dynamic Member Portal Overview Cards */}
        <div className="mdh-metrics-grid">
          <div className="mdh-card">
            <div className="mdh-card-top">
              <span className="card-kicker">ATHLETIC TIER</span>
              <span className="card-trend positive">ACTIVE STATUS</span>
            </div>
            <span className="card-num">{user.tier || "Iron Pro Athlete"}</span>
            <span className="card-lbl">Full Arena Floor & recovery zone access</span>
            <div className="card-progress-bar">
              <div className="card-progress-fill" style={{ width: "100%" }}></div>
            </div>
          </div>

          <div className="mdh-card">
            <div className="mdh-card-top">
              <span className="card-kicker">PERIODIZATION FOCUS</span>
              <span className="card-trend positive">SPLIT CALIBRATED</span>
            </div>
            <span className="card-num">{user.goal || "Hypertrophy & Strength"}</span>
            <span className="card-lbl">Automated sets, rest intervals, and volume logs</span>
            <div className="card-progress-bar">
              <div className="card-progress-fill recovery" style={{ width: "100%" }}></div>
            </div>
          </div>

          <div className="mdh-card">
            <div className="mdh-card-top">
              <span className="card-kicker">BIOMECHANICAL ENGINE</span>
              <span className="card-trend positive">INTERACTIVE 3D</span>
            </div>
            <span className="card-num">3D MuscleMap</span>
            <span className="card-lbl">Anatomical recruitment & technique cues</span>
            <a
              href="#musclemap"
              className="card-quick-action"
              onClick={(e) => handleNavClick("musclemap", e)}
            >
              OPEN VISUALIZER ➔
            </a>
          </div>

          <div className="mdh-card">
            <div className="mdh-card-top">
              <span className="card-kicker">ARENA SCHEDULE</span>
              <span className="card-trend neutral">LIVE SLOTS</span>
            </div>
            <span className="card-num">Arena Classes</span>
            <span className="card-lbl">Olympic Lifting, HIIT, and sprint turf</span>
            <a
              href="#classes"
              className="card-quick-action"
              onClick={(e) => handleNavClick("classes", e)}
            >
              RESERVE CLASS SLOT ➔
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberDashboardHeader;
