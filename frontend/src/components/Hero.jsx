import React from "react";
import HeroBackgroundAnimation from "./HeroBackgroundAnimation";
import "./styles/Hero.css";

const Hero = ({ user, onOpenLogin }) => {
  return (
    <section className="hero" id="hero">
      {/* 60fps Interactive Animated Atmosphere & Energy Canvas */}
      <HeroBackgroundAnimation />

      <div className="hero-overlay">
        <div className="hero-content">
          <div className="hero-top-badges">
            <span className="hero-badge">⚡ ELITE PERFORMANCE TRAINING</span>
            <span className="hero-rating-badge">⭐ 4.9/5 (3,200+ Active Members)</span>
          </div>

          <h1 className="hero-title">
            Transform your <span>BODY</span> & MIND
          </h1>
          <p className="hero-subtitle">
            Unleash your inner strength with <strong>IronFit Elite</strong> — where science-backed
            biomechanics, interactive 3D muscle mapping, and world-class coaching converge.
          </p>

          <div className="hero-buttons">
            {user ? (
              <>
                <a href="#musclemap" className="btn-primary">
                  Launch MuscleMap 3D 🧬
                </a>
                <a href="#programs" className="btn-secondary">
                  My Workout Programs 🏋️
                </a>
              </>
            ) : (
              <>
                <button className="btn-primary" onClick={onOpenLogin}>
                  🔐 Member Portal Login
                </button>
                <a href="#membership" className="btn-secondary">
                  Membership Plans 💳
                </a>
              </>
            )}
          </div>

          {/* Trusted Equipment Benchmark Bar */}
          {!user && (
            <div className="hero-partners-strip">
              <span className="partners-label">EQUIPMENT & BIOMECHANICAL STANDARDS:</span>
              <div className="partners-list">
                <span>ELEIKO</span>
                <span className="dot">•</span>
                <span>HAMMER STRENGTH</span>
                <span className="dot">•</span>
                <span>TECHNOGYM</span>
                <span className="dot">•</span>
                <span>ROGUE</span>
                <span className="dot">•</span>
                <span>INBODY</span>
              </div>
            </div>
          )}

          {/* Member Features Teaser Grid */}
          {!user && (
            <div className="hero-features-preview">
              <div className="preview-label">
                <span>EXCLUSIVE MEMBER PORTAL MODULES (UNLOCKED AFTER LOGIN):</span>
              </div>
              <div className="preview-cards-grid">
                {[
                  {
                    icon: "🧬",
                    title: "MuscleMap 3D",
                    desc: "Interactive Anatomy & Online Masterclasses",
                  },
                  {
                    icon: "🏋️",
                    title: "Workout Programs",
                    desc: "Beginner to Pro Splits & Rest Timers",
                  },
                  {
                    icon: "📅",
                    title: "Live Class Booking",
                    desc: "Yoga, Zumba, HIIT & Strength Slots",
                  },
                  {
                    icon: "🧮",
                    title: "Smart Calculators",
                    desc: "BMI, TDEE, Calories & Water Intake",
                  },
                  {
                    icon: "📊",
                    title: "Progress Tracker",
                    desc: "Weight Logs, Streaks & Photo Slider",
                  },
                  {
                    icon: "🤖",
                    title: "AI Fitness Coach",
                    desc: "24/7 Intelligent Workout Assistant",
                  },
                ].map((mod) => (
                  <div
                    key={mod.title}
                    className="preview-card"
                    onClick={onOpenLogin}
                    title={`Sign in to access ${mod.title}`}
                  >
                    <div className="card-top-row">
                      <span className="card-icon">{mod.icon}</span>
                      <span className="lock-tag">🔒 Sign In ➔</span>
                    </div>
                    <div className="card-info">
                      <strong>{mod.title}</strong>
                      <p>{mod.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;