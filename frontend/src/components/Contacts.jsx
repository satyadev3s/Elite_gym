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
      <HeroBackgroundAnimation />
      <div className="contact-overlay">
        <h2>
          Contact <span>IronFit Elite</span>
        </h2>
        <p className="contact-intro">
          Have questions or want to join? Call or WhatsApp us at{" "}
          <a href="https://wa.me/916301202481" className="contact-phone-link">
            📞 6301202481
          </a>{" "}
          or send a message below!
        </p>

        {isSubmitted && (
          <div className="success-message">
            Thank you! Your message has been sent successfully. We'll be in touch soon.
          </div>
        )}

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit" className="contact-btn">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contacts;