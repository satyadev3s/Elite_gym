import React, { useState } from "react";
import HeroBackgroundAnimation from "./HeroBackgroundAnimation";
import "./styles/FAQSection.css";

const FAQSection = ({ onOpenLogin }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "How does the interactive 3D MuscleMap work?",
      a: "MuscleMap allows you to click on any anatomical muscle group across anterior (front) and posterior (back) views. It reveals real-time biomechanical recruitment points, optimal rest intervals, sets-per-week volume logs, and verified matching online technique masterclasses to ensure safe, injury-free execution.",
    },
    {
      q: "Can I freeze or cancel my membership anytime?",
      a: "Yes. All monthly and quarterly IronFit Elite memberships can be paused or canceled with zero cancellation penalties via your Member Portal account settings or at the front desk.",
    },
    {
      q: "Are group fitness classes (Yoga, Zumba, HIIT) included?",
      a: "Pro and Elite VIP members enjoy unlimited access to all scheduled group classes. Starters receive 2 complimentary class passes per month and can reserve additional single drop-in slots via our real-time Class Booking module.",
    },
    {
      q: "Is the AI Fitness Coach available 24/7?",
      a: "Yes! The IronFit AI Coach is accessible round-the-clock inside your Member Portal. You can ask for custom push-pull-legs splits, form cues, pre-workout nutrition advice, and safe joint-friendly exercise substitutions anytime.",
    },
    {
      q: "What equipment brands do you feature at the club?",
      a: "Our strength floor is equipped exclusively with competition-grade Eleiko Olympic barbells and calibrated bumpers, Hammer Strength plate-loaded iso-lateral machines, Rogue Monster power racks, and Technogym PureStrength selectorized equipment.",
    },
    {
      q: "Are private progress photos safe and confidential?",
      a: "Absolutely. All progress photos in your Fitness Progress Tracker are stored locally within your secure browser session and feature an interactive Privacy Shield blur toggle to protect your personal transformation records.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="faq-section reveal" id="faq">
      <HeroBackgroundAnimation />
      <div className="faq-container">
        <div className="section-header-center">
          <span className="section-pill">COMMON QUESTIONS</span>
          <h2 className="section-title">
            Frequently Asked <span>Questions</span>
          </h2>
          <p className="section-subtitle">
            Everything you need to know about memberships, facilities, interactive training tools, and club protocols.
          </p>
        </div>

        <div className="faq-accordion-list">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`faq-item ${isOpen ? "open" : ""}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-question-row">
                  <h4>{faq.q}</h4>
                  <span className="faq-toggle-icon">{isOpen ? "−" : "+"}</span>
                </div>
                {isOpen && (
                  <div className="faq-answer-box">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="faq-footer-prompt">
          <p>Still have questions or need assistance?</p>
          <div className="faq-prompt-actions">
            <a href="https://wa.me/916301202481" target="_blank" rel="noreferrer" className="faq-contact-btn">
              💬 Chat on WhatsApp: 6301202481
            </a>
            <button className="faq-login-btn" onClick={onOpenLogin}>
              🔐 Sign In to Member Portal
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
