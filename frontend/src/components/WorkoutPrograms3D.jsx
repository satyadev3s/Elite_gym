import React, { useState } from "react";
import HeroBackgroundAnimation from "./HeroBackgroundAnimation";
import TiltCard3D from "./TiltCard3D";
import "./styles/WorkoutPrograms3D.css";

const PROGRAMS = [
  {
    id: "muscle-building",
    title: "Muscle Building",
    tag: "HYPERTROPHY",
    tagline: "Mechanical Tension & Mass",
    desc: "Targeted hypertrophy splits utilizing scientific progressive overload, full range biomechanics, and calibrated recovery cycles.",
    specs: "4-5 Days/Wk • 60 Min • RPE 8-9",
    bg: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
    badge: "MOST POPULAR",
  },
  {
    id: "weight-loss",
    title: "Weight Loss",
    tag: "METABOLIC BURN",
    tagline: "High-Calorie EPOC Circuits",
    desc: "Explosive fat oxidation combining prowler sled sprints, battle ropes, and continuous heart-rate zone conditioning.",
    specs: "3-4 Days/Wk • 45 Min • 750+ kcal/session",
    bg: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
    badge: "FAST RESULTS",
  },
  {
    id: "strength-training",
    title: "Strength Training",
    tag: "MAX FORCE OUTPUT",
    tagline: "Olympic Barbells & Power Racks",
    desc: "Competition Eleiko barbell lifts, heavy deadlift platforms, and central nervous system force adaptation for pure power.",
    specs: "3-4 Days/Wk • 75 Min • Heavy Singles & 5x5",
    bg: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80",
    badge: "OLYMPIC GRADE",
  },
  {
    id: "cardio-training",
    title: "Cardio Training",
    tag: "AEROBIC ENDURANCE",
    tagline: "Vo2 Max & Sprint Conditioning",
    desc: "Indoor 50m sprint track, non-motorized Skillmill runs, rowers, and high-altitude simulation to maximize lung capacity.",
    specs: "3-5 Days/Wk • 40 Min • Vo2 Max Gates",
    bg: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    badge: "HIGH VELOCITY",
  },
  {
    id: "personal-training",
    title: "Personal Training",
    tag: "1-ON-1 COACHING",
    tagline: "Custom Biomechanical Masterclass",
    desc: "Direct guidance from Olympia-certified coaches. Form correction masterclasses, weekly InBody scans, and nutrition periodization.",
    specs: "Custom Schedule • Private Arena • 1-on-1",
    bg: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
    badge: "ELITE VIP",
  },
];

const WorkoutPrograms3D = ({ onOpenLogin }) => {
  const [selectedProgram, setSelectedProgram] = useState(null);

  return (
    <section className="programs-3d-section reveal" id="programs-preview">
      <HeroBackgroundAnimation variant="dumbbell" position="right" />
      <div className="programs-3d-container">
        {/* Header */}
        <div className="section-header-center">
          <span className="section-pill">PERIODIZED DISCIPLINES</span>
          <h2 className="section-title">
            ENGINEERED <span>WORKOUT PROGRAMS</span>
          </h2>
          <p className="section-subtitle">
            Calibrated training protocols tailored for Olympic force, lean hypertrophy, metabolic fat loss, and championship stamina. Hover in 3D to explore program details.
          </p>
        </div>

        {/* 5 Interactive 3D Program Cards Grid */}
        <div className="programs-3d-grid">
          {PROGRAMS.map((prog) => (
            <TiltCard3D
              key={prog.id}
              className="program-tilt-wrap"
              maxTilt={10}
              scale={1.03}
              onClick={() => setSelectedProgram(prog)}
            >
              <div
                className="program-3d-card"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(10, 13, 20, 0.7) 0%, rgba(5, 6, 9, 0.96) 100%), url(${prog.bg})`,
                }}
              >
                {/* Top Badge */}
                <div className="card-header-row pop-3d-sm">
                  <span className="program-tag">{prog.tag}</span>
                  <span className="program-badge-pill">{prog.badge}</span>
                </div>

                {/* Body */}
                <div className="program-card-body pop-3d-md">
                  <h3 className="program-title">{prog.title}</h3>
                  <span className="program-tagline">{prog.tagline}</span>
                  <p className="program-desc">{prog.desc}</p>
                </div>

                {/* Specs Footer */}
                <div className="program-card-footer pop-3d-sm">
                  <div className="spec-chip">
                    <span className="spec-indicator">PARAM:</span>
                    <span className="spec-val">{prog.specs}</span>
                  </div>
                  <button className="btn-card-explore" onClick={(e) => {
                    e.stopPropagation();
                    onOpenLogin();
                  }}>
                    JOIN PROGRAM ➔
                  </button>
                </div>
              </div>
            </TiltCard3D>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkoutPrograms3D;
