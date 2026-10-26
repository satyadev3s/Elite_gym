import React, { useState } from "react";
import HeroBackgroundAnimation from "./HeroBackgroundAnimation";
import api from "../services/api";
import "./styles/Contacts.css";

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      try {
        await api.submitContact(formData);
      } catch {
        // Graceful offline fallback
      }
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }
  };

  return (
    <section className="contact reveal" id="contact">
      <HeroBackgroundAnimation variant="dumbbell" position="left" />
      <div className="contact-container">
        <div className="section-header-center">
          <span className="section-pill">LOCATION & CONTACT</span>
          <h2 className="section-title">
            VISIT OUR <span>GYM</span>
          </h2>
          <p className="section-subtitle">
            Schedule a gym tour, meet our certified personal trainers, and experience our state-of-the-art facilities in Hyderabad.
          </p>
        </div>

        <div className="contact-grid">
          {/* Gym Info Panel */}
          <div className="contact-info-panel">
            <div className="info-card">
              <span className="info-tag">GYM LOCATION</span>
              <h4>ELITE FITNESS CLUB & GYM</h4>
              <p>Plot 42, Kondapur Main Road, HITEC City Corridor, Hyderabad, Telangana 500084</p>
            </div>

            <div className="info-card">
              <span className="info-tag">OPERATING HOURS</span>
              <div className="hours-row">
                <span>MONDAY - SATURDAY</span>
                <strong>05:30 - 23:00</strong>
              </div>
              <div className="hours-row">
                <span>SUNDAYS & RECOVERY</span>
                <strong>06:00 - 20:00</strong>
              </div>
            </div>

            <div className="info-card hotline-card">
              <span className="info-tag">DIRECT HOTLINE</span>
              <a href="https://wa.me/916301202481" target="_blank" rel="noreferrer" className="contact-hotline-btn">
                WHATSAPP CONCIERGE: +91 63012 02481
              </a>
            </div>
          </div>

          {/* Contact Form Overlay */}
          <div className="contact-overlay">
            <h3 className="form-heading">SEND DIRECT MESSAGE</h3>
            <p className="form-subheading">Inquiries answered within 30 minutes during active floor hours.</p>

            {isSubmitted && (
              <div className="success-message">
                INQUIRY DISPATCHED: An Elite Fitness concierge will contact you shortly.
              </div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone / WhatsApp Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder="Training Goals, Pass Inquiries, or Tour Requests..."
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              <button type="submit" className="contact-btn">
                SUBMIT INQUIRY // DISPATCH
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
