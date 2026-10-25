import React, { useState } from "react";
import HeroBackgroundAnimation from "../components/HeroBackgroundAnimation";
import api from "../services/api.js";
import "../components/styles/LoginPage.css";

const LoginPage = ({ onLoginSuccess, onBackToLanding }) => {
  const [authMode, setAuthMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [tier, setTier] = useState("");
  const [goal, setGoal] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
        setSuccessMessage("✅ Successfully signed in! Unlocking portal...");
        setTimeout(() => {
          onLoginSuccess(res.user);
        }, 500);
      } else {
        setErrorMessage(res.message || "Invalid credentials. Please verify your email and password.");
      }
    } catch (err) {
      setErrorMessage(err.message || "No account found with this email address. Please register under New Member Registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!fullName.trim() || !email.trim() || !password || !goal || !tier) {
      setErrorMessage("Please fill out all required fields, including fitness goal and tier.");
      return;
    }

    if (password.length < 4) {
      setErrorMessage("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);
    try {
      const tierLabels = {
        basic: "Iron Starter",
        pro: "Iron Pro Athlete",
        elite: "Iron Elite VIP",
      };

      const goalLabels = {
        "muscle-building": "Muscle Hypertrophy & Strength",
        "weight-loss": "Fat Loss & Conditioning",
        "athletic": "Athletic Power",
      };

      const payload = {
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        tier: tierLabels[tier] || "Iron Pro Athlete",
        goal: goalLabels[goal] || "Muscle Hypertrophy & Strength",
      };

      const res = await api.register(payload);
      if (res && res.success && res.user) {
        if (rememberMe) {
          localStorage.setItem("ironfit_current_user", JSON.stringify(res.user));
        } else {
          sessionStorage.setItem("ironfit_current_user", JSON.stringify(res.user));
        }
        setSuccessMessage("🎉 Account created successfully! Unlocking Member Portal...");
        setTimeout(() => {
          onLoginSuccess(res.user);
        }, 800);
      } else {
        setErrorMessage(res.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setErrorMessage(err.message || "Email is already registered. Please sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <HeroBackgroundAnimation />
      <div className="login-backdrop-overlay"></div>

      <div className="login-container">
        {onBackToLanding && (
          <button className="login-back-btn" onClick={onBackToLanding}>
            ← Back to Landing Page
          </button>
        )}

        {/* Brand Header */}
        <div className="login-brand-header">
          <div className="login-logo">
            IronFit <span>Elite</span>
          </div>
          <p className="login-tagline">
            Sign in to access your workout splits, classes, and performance analytics.
          </p>
        </div>

        {/* Auth Card */}
        <div className="auth-card">
          {/* Auth Tab Switcher */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${authMode === "login" ? "active" : ""}`}
              onClick={() => {
                setAuthMode("login");
                setEmail("");
                setPassword("");
                setFullName("");
                setGoal("");
                setTier("");
                setErrorMessage("");
                setSuccessMessage("");
              }}
            >
              Member Sign In
            </button>
            <button
              className={`auth-tab ${authMode === "register" ? "active" : ""}`}
              onClick={() => {
                setAuthMode("register");
                setEmail("");
                setPassword("");
                setFullName("");
                setGoal("");
                setTier("");
                setErrorMessage("");
                setSuccessMessage("");
              }}
            >
              New Member Registration
            </button>
          </div>

          {errorMessage && <div className="auth-error-banner">{errorMessage}</div>}
          {successMessage && <div className="auth-success-banner">{successMessage}</div>}

          {authMode === "login" ? (
            /* Login Form */
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <div className="input-group-auth">
                <label>Member Email Address</label>
                <input
                  type="email"
                  value={email}
                  placeholder="Enter your email address"
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  disabled={loading}
                  required
                />
              </div>

              <div className="input-group-auth">
                <div className="password-label-row">
                  <label>Password</label>
                  <span className="forgot-pass-link">Forgot Password?</span>
                </div>
                <input
                  type="password"
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />
              </div>

              <div className="auth-options-row">
                <label className="remember-checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                  <span>Keep me logged in</span>
                </label>
                <span className="secure-badge">🔒 256-Bit SSL</span>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign In to Member Portal ➔"}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form className="auth-form" onSubmit={handleRegisterSubmit}>
              <div className="input-group-auth">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="input-group-auth">
                <label>Email Address *</label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={loading}
                  required
                />
              </div>

              <div className="auth-form-row">
                <div className="input-group-auth">
                  <label>Primary Fitness Goal *</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    disabled={loading}
                    required
                  >
                    <option value="" disabled>Select your goal...</option>
                    <option value="muscle-building">Muscle Hypertrophy & Strength</option>
                    <option value="weight-loss">Fat Loss & Conditioning</option>
                    <option value="athletic">Athletic Power</option>
                  </select>
                </div>
                <div className="input-group-auth">
                  <label>Desired Membership Tier *</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    disabled={loading}
                    required
                  >
                    <option value="" disabled>Select your tier...</option>
                    <option value="pro">Iron Pro Athlete (Popular)</option>
                    <option value="elite">Iron Elite VIP</option>
                    <option value="basic">Iron Starter</option>
                  </select>
                </div>
              </div>

              <div className="input-group-auth">
                <label>Create Secure Password *</label>
                <input
                  type="password"
                  placeholder="Create a password (min 4 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                  required
                />
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? "Creating account..." : "Register & Unlock Member Portal ➔"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
