import React from "react";
import HeroBackgroundAnimation from "./HeroBackgroundAnimation";
import TiltCard3D from "./TiltCard3D";
import "./styles/ClubFacilities.css";

const ClubFacilities = ({ onOpenLogin }) => {
  const facilityItems = [
    {
      title: "Olympic Barbells & Heavy Power Racks",
      desc: "Competition Eleiko IWF barbells, calibrated iron plates, and heavy-duty power racks built for squats, bench presses, and deadlifts.",
      tag: "FREE WEIGHTS",
      specs: "Eleiko IWF Barbells • Calibrated Plates • Oak Platforms",
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Functional Turf & Conditioning Zone",
      desc: "50m athletic turf track equipped for sled pushes, battle ropes, box jumps, kettlebells, and HIIT metabolic conditioning.",
      tag: "CARDIO & HIIT",
      specs: "Heavy Sleds • Plyo Boxes • Agility Ladders • Battle Ropes",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Boxing & Combat Fitness Zone",
      desc: "Heavy punching bags, speed bags, contest-grade mats, and combat conditioning equipment for cardiovascular stamina.",
      tag: "BOXING & COMBAT",
      specs: "Heavy Bags • Speed Bags • Shock Mats • Rotational Power",
      image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "3D Muscle & Workout Analytics",
      desc: "Interactive 3D muscle targeting interface showing exercise form cues, primary muscle recruitment, and set-by-set progress tracking.",
      tag: "3D WORKOUT TECH",
      specs: "Interactive 3D Engine • Form Cues • Routine Logs",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Steam, Sauna & Cold Plunge Suite",
      desc: "Twin 3°C cold plunge tubs, Finnish steam rooms, and infrared recovery saunas for accelerated muscle recovery.",
      tag: "RECOVERY SUITE",
      specs: "3°C Cold Plunge • Infrared Sauna • Steam Rooms",
      image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Calisthenics Rig & Functional Strength",
      desc: "Custom heavy-gauge pull-up rigs, gymnastics rings, dip bars, and pegboards for bodyweight mastery and core strength.",
      tag: "FUNCTIONAL RIG",
      specs: "Gymnastics Rings • Heavy Rig • Pegboards • Parallel Bars",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <section className="facilities-section reveal" id="features">
      <HeroBackgroundAnimation variant="kettlebell" position="left" />
      <div className="facilities-container">
        <div className="section-header-center">
          <span className="section-pill">PREMIER GYM FACILITIES</span>
          <h2 className="section-title">
            WORLD-CLASS <span>GYM EQUIPMENT</span> & AMENITIES
          </h2>
          <p className="section-subtitle">
            From competition Olympic power racks and free weights to modern cardio machines, functional turf, and recovery suites — our gym is built for your fitness transformation.
          </p>
        </div>

        <div className="facilities-grid">
          {facilityItems.map((item, index) => (
            <TiltCard3D key={index} className="facility-tilt-card-wrap" maxTilt={8} scale={1.025}>
              <div className="facility-card">
                <div className="facility-photo-wrapper">
                  <img src={item.image} alt={item.title} className="facility-photo" loading="lazy" />
                  <span className="facility-badge pop-3d-sm">{item.tag}</span>
                </div>
                <div className="facility-body">
                  <h3 className="facility-title pop-3d-md">{item.title}</h3>
                  <p className="facility-desc">{item.desc}</p>
                  <div className="facility-specs-row pop-3d-sm">
                    <span className="specs-indicator">SPEC:</span>
                    <span className="specs-text">{item.specs}</span>
                  </div>
                </div>
              </div>
            </TiltCard3D>
          ))}
        </div>

        <div className="facilities-cta-banner">
          <div className="cta-banner-text">
            <h4>READY TO TRANSFORM YOUR BODY AT ELITE FITNESS?</h4>
            <p>Get full access to our world-class gym equipment, free weights, cardio zone, certified personal trainers, and customized workout plans with your gym membership.</p>
          </div>
          <div className="cta-banner-buttons">
            <button className="banner-login-btn" onClick={onOpenLogin}>
              JOIN OUR GYM TODAY
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClubFacilities;
