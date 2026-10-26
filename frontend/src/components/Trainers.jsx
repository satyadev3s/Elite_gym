import React from "react";
import HeroBackgroundAnimation from "./HeroBackgroundAnimation";
import TiltCard3D from "./TiltCard3D";
import "./styles/Trainers.css";
import { trainerData } from "../data/data.js";

const Trainers = () => {
  return (
    <section className="trainers reveal" id="trainers">
      <HeroBackgroundAnimation variant="dumbbell" position="right" />
      <div className="section-header-center">
        <span className="section-pill">CERTIFIED PERSONAL TRAINERS</span>
        <h2 className="section-title">
          TRAIN WITH <span>CERTIFIED GYM COACHES</span>
        </h2>
        <p className="section-subtitle">
          Certified fitness trainers and nutrition specialists dedicated to guiding your workouts, perfecting your lifting form, and accelerating your progress.
        </p>
      </div>
      <div className="trainers-grid">
        {trainerData.map((trainer) => (
          <TiltCard3D key={trainer.id} className="trainer-tilt-wrap" maxTilt={10} scale={1.03}>
            <div className="trainer-card">
              <div className="trainer-img-wrapper">
                <img src={trainer.img} alt={trainer.name} loading="lazy" />
                <span className="trainer-badge pop-3d-sm">{trainer.tag}</span>
              </div>
              <div className="trainer-info">
                <h3 className="trainer-name pop-3d-md">{trainer.name}</h3>
                <p className="trainer-role">{trainer.role}</p>
                <div className="trainer-cred pop-3d-sm">{trainer.credential}</div>
              </div>
            </div>
          </TiltCard3D>
        ))}
      </div>
    </section>
  );
};

export default Trainers;
