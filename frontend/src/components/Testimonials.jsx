import React, { useState } from "react";
import HeroBackgroundAnimation from "./HeroBackgroundAnimation";
import "./styles/Testimonials.css";

const Testimonials = () => {
  const [activeTab, setActiveTab] = useState("all");

  const testimonials = [
    {
      id: 1,
      name: "David Kowalski",
      role: "Iron Pro Member • 8 Months",
      category: "hypertrophy",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      headline: "Gained 6.5 kg of lean mass with periodized splits",
      quote:
        "The MuscleMap visualizer changed how I train back and chest. Being able to see the anatomical recruitment cues alongside verified technique masterclasses fixed my plateau completely.",
      stats: { metric: "+6.5 kg", label: "Lean Muscle Gained" },
    },
    {
      id: 2,
      name: "Sarah Jenkins",
      role: "Iron Elite VIP • 1 Year",
      category: "fat-loss",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      headline: "Dropped 14% body fat while increasing squat strength",
      quote:
        "Between the HIIT group classes and the macro calorie calculators, Elite Fitness provided structure without the guesswork. The progress photo slider kept me accountable week after week.",
      stats: { metric: "-14%", label: "Body Fat Reduction" },
    },
    {
      id: 3,
      name: "Marcus Vance",
      role: "Iron Starter • 4 Months",
      category: "rehab",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      headline: "Zero shoulder impingement on incline pressing now",
      quote:
        "The form cues on the exercise demos pointed out that I was flaring my elbows at 90 degrees. Tucking them at 45 degrees as shown eliminated my rotator cuff pain entirely.",
      stats: { metric: "100%", label: "Pain-Free Lifting" },
    },
  ];

  const filteredTestimonials =
    activeTab === "all"
      ? testimonials
      : testimonials.filter((t) => t.category === activeTab);

  return (
    <section className="testimonials-section reveal" id="testimonials">
      <HeroBackgroundAnimation variant="dual-dumbbell" position="left" />
      <div className="testimonials-container">
        <div className="section-header-center">
          <span className="section-pill">ATHLETE PROOF</span>
          <h2 className="section-title">
            FORGED BY <span>NUMBERS</span>, PROVEN BY SWEAT
          </h2>
          <p className="section-subtitle">
            Documented metric improvements from competitive weightlifters, Kabaddi athletes, and dedicated lifters.
          </p>

          <div className="testimonials-filter-bar">
            <button
              className={`t-filter-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Athletes
            </button>
            <button
              className={`t-filter-btn ${activeTab === "hypertrophy" ? "active" : ""}`}
              onClick={() => setActiveTab("hypertrophy")}
            >
              Hypertrophy
            </button>
            <button
              className={`t-filter-btn ${activeTab === "fat-loss" ? "active" : ""}`}
              onClick={() => setActiveTab("fat-loss")}
            >
              Speed & Conditioning
            </button>
            <button
              className={`t-filter-btn ${activeTab === "rehab" ? "active" : ""}`}
              onClick={() => setActiveTab("rehab")}
            >
              Mobility & Joint Rehab
            </button>
          </div>
        </div>

        <div className="testimonials-grid">
          {filteredTestimonials.map((item) => (
            <div key={item.id} className="testimonial-card">
              <div className="t-card-header">
                <img src={item.avatar} alt={item.name} className="t-avatar" loading="lazy" />
                <div className="t-author-info">
                  <h4>{item.name}</h4>
                  <span className="t-role">{item.role}</span>
                </div>
                <span className="t-verified-badge">VERIFIED PR</span>
              </div>

              <div className="t-stat-pill">
                <strong>{item.stats.metric}</strong> {item.stats.label}
              </div>

              <h5 className="t-headline">"{item.headline}"</h5>
              <p className="t-quote">{item.quote}</p>
            </div>
          ))}
        </div>

        {/* Member Trust Numbers */}
        <div className="trust-stats-ribbon">
          <div className="trust-stat-box">
            <span className="t-stat-num">3,200+</span>
            <span className="t-stat-lbl">Active Athletes</span>
          </div>
          <div className="trust-stat-box">
            <span className="t-stat-num">98.4%</span>
            <span className="t-stat-lbl">Goal PR Rate</span>
          </div>
          <div className="trust-stat-box">
            <span className="t-stat-num">100%</span>
            <span className="t-stat-lbl">Periodized Programs</span>
          </div>
          <div className="trust-stat-box">
            <span className="t-stat-num">45+</span>
            <span className="t-stat-lbl">Weekly Arena Sessions</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
