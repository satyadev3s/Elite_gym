import React, { useState, useEffect } from "react";
import HeroBackgroundAnimation from "../components/HeroBackgroundAnimation";
import api from "../services/api.js";
import "../components/styles/LoginPage.css";

const LoginPage = ({ initialMode = "login", onLoginSuccess, onBackToLanding }) => {
  const [authMode, setAuthMode] = useState(initialMode); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthMode(initialMode);
  }, [initialMode]);

  // Sync mode changes with URL hash
  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setErrorMessage("");
    setSuccessMessage("");
    window.location.hash = `#${mode}`;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both your email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.login(email.trim().toLowerCase(), password);
      if (res && res.success && res.user) {
        if (rememberMe) {
          localStorage.setItem("ironfit_current_user", JSON.stringify(res.user));
        } else {
          sessionStorage.setItem("ironfit_current_user", JSON.stringify(res.user));
        }
        setSuccessMessage("Credentials verified. Unlocking Member Portal...");
        setTimeout(() => {
          onLoginSuccess(res.user);
        }, 500);
      } else {
        setErrorMessage(res.message || "Invalid credentials. Please verify your email and password.");
      }
    } catch (err) {
      setErrorMessage(err.message || "No account found with this email. Click '1-Click Demo Login' or register below.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (password.length < 4) {
      setErrorMessage("Password must be at least 4 characters long.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        tier: "Iron Pro Athlete",
        goal: "Muscle Hypertrophy & Strength",
      };

      const res = await api.register(payload);
      if (res && res.success && res.user) {
        if (rememberMe) {
          localStorage.setItem("ironfit_current_user", JSON.stringify(res.user));
        } else {
          sessionStorage.setItem("ironfit_current_user", JSON.stringify(res.user));
        }
        setSuccessMessage("Athlete profile created! Entering Member Portal...");
        setTimeout(() => {
          onLoginSuccess(res.user);
        }, 600);
      } else {
        setErrorMessage(res.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setErrorMessage(err.message || "This email is already registered. Please sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-showcase-page">
      {/* 3D Gym Equipment Animation Background */}
      <HeroBackgroundAnimation variant="dual-dumbbell" position="left" />
      <div className="login-stage-backdrop" />

      {/* Main Luxury Split Card */}
      <div className="login-split-card">
        {/* Left Column: Athletic Prestige Showcase */}
        <div className="login-prestige-showcase">
          <div className="prestige-header">
            <span className="prestige-pill">
              <span className="pill-pulse" />
              <span>PREMIER FITNESS & GYM</span>
            </span>
            <h2 className="prestige-headline">
              HYDERABAD'S PREMIER GYM <span>TRANSFORM YOUR BODY.</span>
            </h2>
            <p className="prestige-sub">
              Access your gym membership dashboard, personalized workout routines, certified personal trainer bookings, and 3D exercise form guide.
            </p>
          </div>

          {/* 3 Pillar Stats */}
          <div className="prestige-stats-grid">
            <div className="p-stat-box">
              <span className="p-stat-val">5,000</span>
              <span className="p-stat-unit">SQ. FT. GYM FLOOR</span>
              <span className="p-stat-lbl">Free Weights & Power Racks</span>
            </div>
            <div className="p-stat-box">
              <span className="p-stat-val">3D</span>
              <span className="p-stat-unit">WORKOUT GUIDE</span>
              <span className="p-stat-lbl">Exercise Form & Muscle Targeting</span>
            </div>
            <div className="p-stat-box">
              <span className="p-stat-val">4.9 ★</span>
              <span className="p-stat-unit">MEMBER RATING</span>
              <span className="p-stat-lbl">Over 2,400 Active Gym Members</span>
            </div>
          </div>

          {/* Athlete Testimonial Card */}
          <div className="prestige-quote-card">
            <div className="quote-avatars-row">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Athlete" className="q-avatar" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Athlete" className="q-avatar" />
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" alt="Athlete" className="q-avatar" />
              <div className="q-avatar-count">+2.4k</div>
            </div>
            <p className="quote-text">
              "The certified personal trainers and top-tier equipment helped me lose 8 kg while building real strength. Best gym in Hyderabad."
            </p>
            <span className="quote-author">— Vikramaditya V. • Certified Trainer</span>
          </div>

          {/* Security Guarantee Strip */}
          <div className="prestige-trust-footer">
            <span>🛡️ 256-BIT SECURE LOGIN</span>
            <span>•</span>
            <span>HYDERABAD GYM HQ</span>
            <span>•</span>
            <span>INSTANT ACCESS</span>
          </div>
        </div>

        {/* Right Column: Luxury Authentication Form */}
        <div className="login-auth-pane">
          {/* Top Bar with Return Link & Portal Status */}
          <div className="auth-pane-topbar">
            {onBackToLanding && (
              <button className="auth-back-link" onClick={onBackToLanding}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>RETURN TO GYM HOME</span>
              </button>
            )}
            <span className="auth-live-indicator">
              <span className="live-dot" />
              <span>MEMBER PORTAL</span>
            </span>
          </div>

          {/* Brand Logo */}
          <div className="auth-brand-lockup">
            <div className="auth-logo-text">
              ELITE <span>// FITNESS</span>
            </div>
            <p className="auth-logo-sub">PREMIER FITNESS CLUB & GYM</p>
          </div>

          {/* Segmented Auth Mode Switcher */}
          <div className="auth-mode-switcher">
            <button
              type="button"
              className={`mode-btn ${authMode === "login" ? "active" : ""}`}
              onClick={() => switchAuthMode("login")}
            >
              MEMBER SIGN IN
            </button>
            <button
              type="button"
              className={`mode-btn ${authMode === "register" ? "active" : ""}`}
              onClick={() => switchAuthMode("register")}
            >
              JOIN THE GYM (NEW MEMBER)
            </button>
          </div>

          {/* Feedback Banners */}
          {errorMessage && (
            <div className="auth-alert error">
              <span className="alert-icon">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="auth-alert success">
              <span className="alert-icon">✓</span>
              <span>{successMessage}</span>
            </div>
          )}

          {authMode === "login" ? (
            /* Sign In Form */
            <form className="auth-form-body" onSubmit={handleLoginSubmit}>
              <div className="form-field-group">
                <label className="field-label">ATHLETE EMAIL ADDRESS *</label>
                <div className="field-input-box">
                  <svg className="input-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    placeholder="name@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-field-group">
                <div className="field-label-split">
                  <label className="field-label">PASSWORD *</label>
                  <button
                    type="button"
                    className="forgot-pass-btn"
                    onClick={() => alert("Please message concierge at +91 63012 02481 or your arena coach to reset credentials.")}
                  >
                    FORGOT PASSWORD?
                  </button>
                </div>
                <div className="field-input-box">
                  <svg className="input-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="Enter account password"
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              <div className="auth-sub-row">
                <label className="checkbox-wrap">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                  <span>Stay authenticated on this device</span>
                </label>
                <span className="ssl-chip">SSL 256-BIT</span>
              </div>

              <button type="submit" className="auth-primary-btn" disabled={loading}>
                <span>{loading ? "AUTHENTICATING..." : "SIGN IN TO MEMBER PORTAL"}</span>
                <span className="arrow-sym">➔</span>
              </button>
            </form>
          ) : (
            /* Registration Form */
            <form className="auth-form-body" onSubmit={handleRegisterSubmit}>
              <div className="form-field-group">
                <label className="field-label">FULL ATHLETE NAME *</label>
                <div className="field-input-box">
                  <svg className="input-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    placeholder="e.g. David Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label className="field-label">EMAIL ADDRESS *</label>
                <div className="field-input-box">
                  <svg className="input-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label className="field-label">CREATE PASSWORD *</label>
                <div className="field-input-box">
                  <svg className="input-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 4 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-primary-btn" disabled={loading}>
                <span>{loading ? "CREATING GYM ACCOUNT..." : "JOIN THE GYM NOW"}</span>
                <span className="arrow-sym">➔</span>
              </button>
            </form>
          )}

          <p className="auth-terms-note">
            By signing in or registering, you agree to the Elite Fitness Gym Safety Protocol and Member Terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
