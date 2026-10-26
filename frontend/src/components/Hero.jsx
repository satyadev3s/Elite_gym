import React from "react";
import HeroBackgroundAnimation from "./HeroBackgroundAnimation";
import TiltCard3D from "./TiltCard3D";
import "./styles/Hero.css";

const Hero = ({ user, onOpenLogin }) => {
  return (
    <section className="hero" id="hero">
      {/* 60fps Interactive Animated Atmosphere & Energy Canvas */}
      <HeroBackgroundAnimation />

      <div className="hero-overlay">
        <div className="hero-content">
          <div className="hero-kicker-bar">
            <span className="kicker-tag">HYDERABAD ARENA</span>
            <span className="kicker-sep">//</span>
            <span className="kicker-text">OLYMPIC STRENGTH & ATHLETIC CONDITIONING</span>
          </div>

          <h1 className="hero-title">
            FORGED IN SWEAT.<br />
            <span>BUILT FOR GLORY.</span>
          </h1>

          <p className="hero-subtitle">
            South India's premier athletic training facility. Competition Eleiko power racks, 50m sprint sled turf, 3D anatomical biomechanics, and championship coaching.
          </p>

          <div className="hero-buttons">
            {user ? (
              <>
                <a href="#musclemap" className="btn-primary">
                  LAUNCH MUSCLEMAP 3D
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
                <a href="#virtual-arena" className="btn-secondary">
                  3D ARENA TOUR ➔
                </a>
                <a href="#programs" className="btn-secondary">
                  MY WORKOUT SPLITS
                </a>
              </>
            ) : (
              <>
                <button className="btn-primary" onClick={onOpenLogin}>
                  ENTER ATHLETE PORTAL
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
                <a href="#virtual-arena" className="btn-secondary">
                  3D ARENA TOUR ➔
                </a>
                <a href="#membership" className="btn-secondary">
                  VIEW PASS TIERS
                </a>
              </>
            )}
          </div>

          {/* Athletic Performance Metric Ticker */}
          <div className="hero-metrics-strip">
            <div className="h-metric-item">
              <span className="h-metric-num">5,000+</span>
              <span className="h-metric-label">SQ. FT. OLYMPIC TURF</span>
            </div>
            <div className="h-metric-divider"></div>
            <div className="h-metric-item">
              <span className="h-metric-num">50M</span>
              <span className="h-metric-label">SPRINT & SLED TRACK</span>
            </div>
            <div className="h-metric-divider"></div>
            <div className="h-metric-item">
              <span className="h-metric-num">12+</span>
              <span className="h-metric-label">PRO ATHLETIC COACHES</span>
            </div>
            <div className="h-metric-divider"></div>
            <div className="h-metric-item">
              <span className="h-metric-num">100%</span>
              <span className="h-metric-label">PERIODIZED TRAINING</span>
            </div>
          </div>

          {/* Trusted Equipment Benchmark Bar */}
          {!user && (
            <div className="hero-partners-strip">
              <span className="partners-label">OFFICIAL EQUIPMENT & BIOMECHANICAL BENCHMARKS:</span>
              <div className="partners-list">
                <span>ELEIKO</span>
                <span className="dot">•</span>
                <span>HAMMER STRENGTH</span>
                <span className="dot">•</span>
                <span>ROGUE</span>
                <span className="dot">•</span>
                <span>TECHNOGYM</span>
                <span className="dot">•</span>
                <span>INBODY</span>
              </div>
            </div>
          )}

          {/* Member Features Teaser Grid */}
          {!user && (
            <div className="hero-features-preview">
              <div className="preview-label">
                <span>EXCLUSIVE MEMBER PORTAL MODULES (UNLOCKED AFTER REGISTRATION):</span>
              </div>
              <div className="preview-cards-grid">
                {[
                  {
                    tag: "BIOMECHANICS",
                    title: "3D MuscleMap Engine",
                    desc: "Interactive anatomical model showing primary motor recruitment, rest intervals, and technique masterclasses.",
                    bg: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
                  },
                  {
                    tag: "PERIODIZATION",
                    title: "Athletic Workout Splits",
                    desc: "Calibrated 30-day Kabaddi agility, Olympic strength, and hypertrophy routines with live rest timers.",
                    bg: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80",
                  },
                  {
                    tag: "ARENA CLASSES",
                    title: "Live Class Booking",
                    desc: "Reserve slots for High-Intensity Functional Turf, Power Vinyasa, Combat Conditioning, and Olympic Lifting.",
                    bg: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80",
                  },
                  {
                    tag: "DIAGNOSTICS",
                    title: "AI Coach & Biometrics",
                    desc: "24/7 intelligent training assistant, InBody body fat scans, TDEE calculator, and private photo slider.",
                    bg: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80",
                  },
                ].map((mod) => (
                  <TiltCard3D
                    key={mod.title}
                    className="preview-card-tilt-wrap"
                    maxTilt={9}
                    scale={1.03}
                    onClick={onOpenLogin}
                  >
                    <div
                      className="preview-card"
                      title={`Click to access ${mod.title}`}
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(13, 16, 23, 0.82) 0%, rgba(9, 11, 16, 0.96) 100%), url(${mod.bg})`,
                      }}
                    >
                      <div className="card-top-row pop-3d-sm">
                        <span className="card-tag">{mod.tag}</span>
                        <span className="lock-tag">UNLOCK PORTAL ➔</span>
                      </div>
                      <div className="card-info pop-3d-md">
                        <strong>{mod.title}</strong>
                        <p>{mod.desc}</p>
                      </div>
                    </div>
                  </TiltCard3D>
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