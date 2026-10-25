import React, { useState, useEffect } from "react";
import "./styles/Navbar.css";

const Navbar = ({ user, activeTab, onSelectTab, onLogout, onOpenLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll detection for dynamic frosted glass elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleMemberTabClick = (tabId, e) => {
    if (e) e.preventDefault();
    closeMenu();
    if (onSelectTab) {
      onSelectTab(tabId);
    } else {
      window.location.hash = `#${tabId}`;
    }
  };

  const handlePublicNavClick = (e, href) => {
    if (e) e.preventDefault();
    closeMenu();
    const targetId = href.replace("#", "").trim();

    if (targetId === "hero" || !targetId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (window.location.hash !== "#hero") {
        window.history.pushState(null, "", "#hero");
      }
      return;
    }

    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.classList.add("active");
      targetElement.scrollIntoView({ behavior: "smooth" });
      if (window.location.hash !== href) {
        window.history.pushState(null, "", href);
      }
    } else {
      window.location.hash = href;
    }
  };

  const memberNavItems = [
    { id: "dashboard", label: "Dashboard", icon: "⚡" },
    { id: "musclemap", label: "MuscleMap 3D", icon: "🧬" },
    { id: "programs", label: "Workout Splits", icon: "🏋️" },
    { id: "classes", label: "Live Classes", icon: "📅" },
    { id: "progress", label: "Biometrics", icon: "📊" },
  ];

  const publicNavItems = [
    { href: "#hero", label: "Home" },
    { href: "#features", label: "Facilities" },
    { href: "#trainers", label: "Trainers" },
    { href: "#membership", label: "Plans" },
    { href: "#testimonials", label: "Results" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav className={`navbar ${user ? "navbar-member" : "navbar-public"} ${isScrolled ? "navbar-scrolled" : ""}`}>
      {/* Ambient Top Glow Line */}
      <div className="nav-ambient-glow"></div>

      {/* Brand Logo & Portal Badge */}
      <div className="nav-brand-group">
        <a
          href={user ? "#dashboard" : "#hero"}
          className="nav-brand"
          onClick={(e) => {
            if (user) {
              handleMemberTabClick("dashboard", e);
            } else {
              handlePublicNavClick(e, "#hero");
            }
          }}
        >
          <div className="nav-brand-emblem" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.5 5H4.5C3.67 5 3 5.67 3 6.5V17.5C3 18.33 3.67 19 4.5 19H6.5C7.33 19 8 18.33 8 17.5V6.5C8 5.67 7.33 5 6.5 5ZM19.5 5H17.5C16.67 5 16 5.67 16 6.5V17.5C16 18.33 16.67 19 17.5 19H19.5C20.33 19 21 18.33 21 17.5V6.5C21 5.67 20.33 5 19.5 5ZM10 11H14V13H10V11ZM1 8H2.5V16H1V8ZM21.5 8H23V16H21.5V8Z" />
            </svg>
          </div>
          <div className="nav-brand-text">
            <span className="brand-iron">IRONFIT</span>
            <span className="brand-elite">ELITE</span>
          </div>
        </a>

        {user && (
          <div className="nav-portal-badge" title="Authenticated Session">
            <span className="portal-pulse-dot"></span>
            <span>MEMBER PORTAL</span>
          </div>
        )}
      </div>

      {/* Center Navigation Box Dock */}
      <div className={`nav-center-dock ${isMenuOpen ? "mobile-open" : ""}`}>
        <ul className="nav-links">
          {user ? (
            memberNavItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`nav-tab-pill ${activeTab === item.id ? "active" : ""}`}
                  onClick={(e) => handleMemberTabClick(item.id, e)}
                >
                  <span className="tab-icon">{item.icon}</span>
                  <span className="tab-label">{item.label}</span>
                  {activeTab === item.id && <span className="tab-active-indicator" />}
                </a>
              </li>
            ))
          ) : (
            publicNavItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="nav-public-link"
                  onClick={(e) => handlePublicNavClick(e, item.href)}
                >
                  {item.label}
                </a>
              </li>
            ))
          )}
        </ul>

        {/* Mobile Drawer Footer */}
        <div className="mobile-drawer-footer">
          {user ? (
            <div className="mobile-user-summary">
              <span className="mobile-user-greeting">Signed in as <strong>{user.name}</strong></span>
              <button className="mobile-logout-btn" onClick={onLogout}>
                Sign Out
              </button>
            </div>
          ) : (
            <button
              className="mobile-login-btn"
              onClick={() => {
                closeMenu();
                onOpenLogin();
              }}
            >
              Sign In to Member Portal ➔
            </button>
          )}
        </div>
      </div>

      {/* Right Actions: Member Portal CTA or User Chip */}
      <div className="nav-right-actions">
        {user ? (
          <div className="nav-user-chip">
            <div className="nav-avatar-wrapper">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="nav-user-avatar" />
              ) : (
                <div className="nav-avatar-fallback">{user.name.charAt(0).toUpperCase()}</div>
              )}
              <span className="nav-online-dot" title="Active Session"></span>
            </div>
            <div className="nav-user-info">
              <span className="nav-user-name">{user.name}</span>
              <span className="nav-user-badge">{user.tierBadge || "⭐ Pro Member"}</span>
            </div>
            <button
              className="nav-logout-btn"
              onClick={onLogout}
              title="Sign Out of IronFit Elite"
              aria-label="Sign Out"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span className="logout-text">Sign Out</span>
            </button>
          </div>
        ) : (
          <button className="nav-login-btn" onClick={onOpenLogin}>
            <svg className="nav-btn-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Member Portal</span>
            <svg className="nav-btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        )}

        {/* Mobile Hamburger Toggle Button */}
        <button
          className={`mobile-menu-btn ${isMenuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {isMenuOpen && <div className="nav-backdrop" onClick={closeMenu} />}
    </nav>
  );
};

export default Navbar;