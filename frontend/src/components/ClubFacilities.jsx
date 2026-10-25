import React from "react";
import HeroBackgroundAnimation from "./HeroBackgroundAnimation";
import "./styles/ClubFacilities.css";

const ClubFacilities = ({ onOpenLogin }) => {
  const facilityItems = [
    {
      icon: "🏋️‍♂️",
      title: "Olympic Lifting & Power Racks",
      desc: "Calibrated Eleiko plates, Texas power bars, and competition platforms built for raw strength.",
      tag: "Heavy Strength",
    },
    {
      icon: "🧬",
      title: "3D MuscleMap Biomechanics",
      desc: "Interactive visual anatomy engine showing real-time muscle recruitment and exercise mastery.",
      tag: "Exclusive Tech",
    },
    {
      icon: "🧘‍♀️",
      title: "Mind & Movement Studio",
      desc: "Sound-insulated spaces for Vinyasa Yoga, core flow, and functional mobility restoration.",
      tag: "Recovery & Flow",
    },
    {
      icon: "⚡",
      title: "High-Intensity Functional Turf",
      desc: "50-meter sled track, plyo stations, battle ropes, and kettlebells for athletic conditioning.",
      tag: "Metabolic HIIT",
    },
    {
      icon: "🛡️",
      title: "Bio-Recovery & Infrared Sauna",
      desc: "Cold plunge tubs, infrared hyperthermia, and pneumatic compression boots for zero DOMS.",
      tag: "Rapid Recovery",
    },
    {
      icon: "🤖",
      title: "AI Coaching & Macro Diagnostics",
      desc: "24/7 intelligent training assistant delivering calibrated splits, calorie estimates, and form safety.",
      tag: "AI Powered",
    },
  ];

  return (
    <section className="facilities-section reveal" id="features">
      <HeroBackgroundAnimation />
      <div className="facilities-container">
        <div className="section-header-center">
          <span className="section-pill">WORLD-CLASS AMENITIES</span>
          <h2 className="section-title">
            Engineered For <span>Uncompromising</span> Athletes
          </h2>
          <p className="section-subtitle">
            From competition-grade barbells to AI-powered biomechanical guidance, IronFit Elite provides
            every tool you need to transcend your physical boundaries.
          </p>
        </div>

        <div className="facilities-grid">
          {facilityItems.map((item, index) => (
            <div key={index} className="facility-card">
              <div className="facility-card-top">
                <span className="f-icon">{item.icon}</span>
                <span className="f-tag">{item.tag}</span>
              </div>
              <h3 className="f-title">{item.title}</h3>
              <p className="f-desc">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="facilities-cta-banner">
          <div className="cta-banner-text">
            <h4>Ready to Experience the IronFit Standard?</h4>
            <p>Access our interactive 3D MuscleMap, video masterclasses, and customized workout splits now.</p>
          </div>
          <div className="cta-banner-buttons">
            <button className="banner-login-btn" onClick={onOpenLogin}>
              🔐 Enter Member Portal
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClubFacilities;
