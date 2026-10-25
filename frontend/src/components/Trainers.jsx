import React from "react";
import HeroBackgroundAnimation from "./HeroBackgroundAnimation";
import "./styles/Trainers.css";
import { trainerData } from "../data/data.js";

const Trainers = () => {
  return (
    <section className="trainers reveal" id="trainers">
      <HeroBackgroundAnimation />
      <div className="section-header-center">
        <span className="section-pill">EXPERT COACHING</span>
        <h2 className="section-title">
          Meet Our <span>Elite</span> Trainers
        </h2>
        <p className="section-subtitle">
          Olympia-certified coaches dedicated to perfecting your biomechanics, power output, and physical longevity.
        </p>
      </div>
      <div className="trainers-grid">
        {trainerData.map((trainer) => (
          <div className="trainer-card" key={trainer.id}>
            <div className="trainer-img-wrapper">
              <img src={trainer.img} alt={trainer.name} />
            </div>
            <div className="trainer-info">
              <h3>{trainer.name}</h3>
              <p>{trainer.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Trainers;
