import React, { useState } from "react";
import {
  membershipPlans,
  personalTrainingPackages,
  comparisonFeatures,
} from "../data/fitnessData.js";
import HeroBackgroundAnimation from "./HeroBackgroundAnimation";
import TiltCard3D from "./TiltCard3D";
import api from "../services/api.js";
import "./styles/MembershipPlans.css";

const MembershipPlans = ({ onLoginSuccess, onProceedToPayment }) => {
  const [billingCycle, setBillingCycle] = useState("monthly"); // monthly | quarterly | yearly
  const [showModal, setShowModal] = useState(false);
  const [showRenewToast, setShowRenewToast] = useState(false);
  const [autoRenew, setAutoRenew] = useState(true);
  const [daysRemaining, setDaysRemaining] = useState(14);

  // Multi-step Checkout Flow: "details" | "payment" | "success"
  const [checkoutStep, setCheckoutStep] = useState("details");
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [registeredMember, setRegisteredMember] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    goal: "muscle-building",
    planId: "pro",
    cycle: "monthly",
    ptAddon: "none",
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState("card"); // card | upi
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    upiId: "",
  });

  const openRegisterModal = (plan) => {
    const targetPlan = plan || membershipPlans[1];
    if (onProceedToPayment) {
      onProceedToPayment(targetPlan, billingCycle);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      planId: targetPlan.id,
      cycle: billingCycle,
    }));
    setCheckoutStep("details");
    setCheckoutError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setRegisteredMember(null);
    setCheckoutStep("details");
    setCheckoutError("");
    setIsProcessing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({ ...prev, [name]: value }));
  };

  // Price computation
  const chosenPlan =
    membershipPlans.find((p) => p.id === formData.planId) || membershipPlans[1];
  const basePrice = chosenPlan.prices[formData.cycle] || chosenPlan.prices.monthly;
  const chosenPT = personalTrainingPackages.find((pt) => pt.id === formData.ptAddon);
  const ptPrice = chosenPT ? chosenPT.price : 0;
  const totalAmount = (basePrice + ptPrice).toFixed(2);

  // Proceed from Step 1 (Details) to Step 2 (Payment)
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setCheckoutError("");

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.password.trim()) {
      setCheckoutError("Please fill out your name, email, and password to create your account.");
      return;
    }

    if (formData.password.length < 4) {
      setCheckoutError("Password must be at least 4 characters.");
      return;
    }

    setCheckoutStep("payment");
  };

  // Complete Payment & Connect to Login
  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setCheckoutError("");

    if (paymentMethod === "card") {
      if (!paymentData.cardNumber.trim() || !paymentData.cardExpiry.trim() || !paymentData.cardCvv.trim()) {
        setCheckoutError("Please fill out complete card payment details.");
        return;
      }
    } else if (paymentMethod === "upi") {
      if (!paymentData.upiId.trim() || !paymentData.upiId.includes("@")) {
        setCheckoutError("Please provide a valid UPI ID (e.g. name@okhdfcbank).");
        return;
      }
    }

    setIsProcessing(true);

    try {
      // 1. Register member in MongoDB with their chosen plan and credentials
      const goalLabels = {
        "muscle-building": "Muscle Hypertrophy & Strength",
        "weight-loss": "Fat Loss & Conditioning",
        "athletic": "Athletic Power",
        functional: "Functional Strength & Endurance",
        rehab: "Postural Mobility & Wellness",
      };

      const payload = {
        name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        tier: chosenPlan.name,
        goal: goalLabels[formData.goal] || "Muscle Hypertrophy & Strength",
        phone: formData.phone.trim(),
      };

      let activeUser = null;

      try {
        const res = await api.register(payload);
        if (res && res.success && res.user) {
          activeUser = res.user;
        }
      } catch (err) {
        // If user is already registered, authenticate them and update tier
        if (err.message && err.message.toLowerCase().includes("already registered")) {
          const loginRes = await api.login(formData.email.trim().toLowerCase(), formData.password);
          if (loginRes && loginRes.success && loginRes.user) {
            await api.updateProfile({
              email: formData.email.trim().toLowerCase(),
              tier: chosenPlan.name,
              goal: payload.goal,
            }).catch(() => {});
            activeUser = {
              ...loginRes.user,
              tier: chosenPlan.name,
              tierBadge: chosenPlan.name.includes("VIP") ? "👑 VIP Member" : "⭐ Pro Member",
            };
          } else {
            throw new Error("This email is already registered. Please enter the correct password to renew.");
          }
        } else {
          throw err;
        }
      }

      if (!activeUser) {
        throw new Error("Unable to complete registration. Please check your network and try again.");
      }

      // 2. Persist active session in browser
      localStorage.setItem("ironfit_current_user", JSON.stringify(activeUser));

      // 3. Compute digital pass expiry
      const expiry = new Date();
      if (formData.cycle === "yearly") {
        expiry.setFullYear(expiry.getFullYear() + 1);
      } else if (formData.cycle === "quarterly") {
        expiry.setMonth(expiry.getMonth() + 3);
      } else {
        expiry.setMonth(expiry.getMonth() + 1);
      }

      setRegisteredMember({
        memberId: activeUser.memberId || "IF-" + Math.floor(100000 + Math.random() * 900000),
        fullName: activeUser.name,
        planName: chosenPlan.name,
        cycle: formData.cycle,
        ptPackage: chosenPT ? chosenPT.title : "None",
        expiryDate: expiry.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        totalPaid: totalAmount,
      });

      setCheckoutStep("success");

      // 4. Automatically transition to Member Portal
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(activeUser);
        }
      }, 1800);
    } catch (err) {
      setCheckoutError(err.message || "Payment processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRenewNow = () => {
    setDaysRemaining((prev) => prev + (billingCycle === "yearly" ? 365 : billingCycle === "quarterly" ? 90 : 30));
    setShowRenewToast(true);
    setTimeout(() => {
      setShowRenewToast(false);
    }, 4500);
  };

  return (
    <section className="membership-section reveal" id="membership">
      <HeroBackgroundAnimation variant="plate" position="center" />
      <div className="section-header">
        <span className="section-tag">GYM MEMBERSHIP PLANS</span>
        <h2 className="section-title">
          CHOOSE YOUR <span>GYM MEMBERSHIP</span>
        </h2>
        <p className="section-subtitle">
          Transparent, all-inclusive gym membership plans with zero hidden fees. Full access to gym equipment, free weights, locker rooms, steam sauna, and certified trainers.
        </p>

        {/* Billing Cycle Switcher */}
        <div className="billing-switcher-container">
          <div className="billing-switcher">
            <button
              className={`switch-btn ${billingCycle === "monthly" ? "active" : ""}`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </button>
            <button
              className={`switch-btn ${billingCycle === "quarterly" ? "active" : ""}`}
              onClick={() => setBillingCycle("quarterly")}
            >
              Quarterly <span className="save-badge">Save 15%</span>
            </button>
            <button
              className={`switch-btn ${billingCycle === "yearly" ? "active" : ""}`}
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly <span className="save-badge hot">Save 30%</span>
            </button>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="plans-grid">
        {membershipPlans.map((plan) => {
          const price = plan.prices[billingCycle];
          const cycleLabel =
            billingCycle === "yearly" ? "/year" : billingCycle === "quarterly" ? "/quarter" : "/mo";

          return (
            <TiltCard3D
              key={plan.id}
              className={`plan-tilt-wrap ${plan.popular ? "popular-tilt" : ""}`}
              maxTilt={7}
              scale={plan.popular ? 1.03 : 1.02}
            >
              <div
                className={`plan-card ${plan.popular ? "popular-card" : ""}`}
              >
                {plan.popular && <div className="popular-badge pop-3d-sm">MOST CHOSEN TIER</div>}
                <div className="plan-badge pop-3d-sm">{plan.badge}</div>
                <h3 className="plan-title pop-3d-md">{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>

                <div className="plan-price-wrapper pop-3d-sm">
                  <span className="currency">₹</span>
                  <span className="price-number">{price.toLocaleString("en-IN")}</span>
                  <span className="billing-period">{cycleLabel}</span>
                </div>

                {billingCycle !== "monthly" && (
                  <div className="equivalent-price">
                    Equivalent to ₹
                    {Math.round(price / (billingCycle === "yearly" ? 12 : 3)).toLocaleString("en-IN")}
                    /month
                  </div>
                )}

                <button
                  className={`plan-cta-btn ${plan.popular ? "cta-highlight" : ""} pop-3d-md`}
                  onClick={() => openRegisterModal(plan)}
                >
                  SELECT {plan.name.toUpperCase()}
                </button>

                <div className="plan-features-list">
                  <div className="features-group-title">Included Benefits</div>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="feature-item included">
                      <span className="icon">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feat, idx) => (
                    <div key={idx} className="feature-item excluded">
                      <span className="icon">✕</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard3D>
          );
        })}
      </div>

      {/* Personal Training Packages Section */}
      <div className="pt-packages-section">
        <div className="pt-header">
          <span className="pt-tag">1-On-1 Coaching</span>
          <h3>Personal Training Packages</h3>
          <p>Accelerate your results under the guidance of certified elite strength coaches.</p>
        </div>

        <div className="pt-cards-grid">
          {personalTrainingPackages.map((pkg) => (
            <div key={pkg.id} className="pt-card">
              {pkg.badge && <span className="pt-card-badge">{pkg.badge}</span>}
              <h4>{pkg.title}</h4>
              <div className="pt-trainer-tier">Coach Level: {pkg.trainerTier}</div>
              <p className="pt-desc">{pkg.description}</p>
              <div className="pt-price-box">
                <span className="pt-price">₹{pkg.price.toLocaleString("en-IN")}</span>
                <span className="pt-per-session">(₹{pkg.pricePerSession.toLocaleString("en-IN")}/session)</span>
              </div>
              <ul className="pt-perks">
                {pkg.perks.map((perk, i) => (
                  <li key={i}>✓ {perk}</li>
                ))}
              </ul>
              <button
                className="pt-select-btn"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, ptAddon: pkg.id }));
                  openRegisterModal(membershipPlans[1]);
                }}
              >
                Add Coaching Package
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Feature Comparison Table */}
      <div className="comparison-table-wrapper">
        <h3 className="comparison-title">Full Amenities & Benefits Comparison</h3>
        <div className="table-responsive">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="feature-header">Facility & Privilege</th>
                <th>Iron Starter</th>
                <th className="highlight-col">Iron Pro Athlete</th>
                <th>Iron Elite VIP</th>
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((row, idx) => (
                <tr key={idx}>
                  <td className="feature-name">{row.feature}</td>
                  <td>
                    {typeof row.basic === "boolean" ? (
                      row.basic ? (
                        <span className="check-yes">✓</span>
                      ) : (
                        <span className="check-no">—</span>
                      )
                    ) : (
                      row.basic
                    )}
                  </td>
                  <td className="highlight-col">
                    {typeof row.pro === "boolean" ? (
                      row.pro ? (
                        <span className="check-yes">✓</span>
                      ) : (
                        <span className="check-no">—</span>
                      )
                    ) : (
                      <span className="bold-text">{row.pro}</span>
                    )}
                  </td>
                  <td>
                    {typeof row.elite === "boolean" ? (
                      row.elite ? (
                        <span className="check-yes">✓</span>
                      ) : (
                        <span className="check-no">—</span>
                      )
                    ) : (
                      <span className="bold-text gold">{row.elite}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compact Online Checkout & Payment Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-card checkout-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal} aria-label="Close modal">
              ✕
            </button>

            {/* Compact Stepper Indicator */}
            <div className="checkout-stepper">
              <div className={`step-item ${checkoutStep === "details" ? "active" : checkoutStep !== "details" ? "completed" : ""}`}>
                <span className="step-num">1</span>
                <span className="step-label">Details</span>
              </div>
              <div className="step-divider"></div>
              <div className={`step-item ${checkoutStep === "payment" ? "active" : checkoutStep === "success" ? "completed" : ""}`}>
                <span className="step-num">2</span>
                <span className="step-label">Payment</span>
              </div>
              <div className="step-divider"></div>
              <div className={`step-item ${checkoutStep === "success" ? "active" : ""}`}>
                <span className="step-num">3</span>
                <span className="step-label">Access</span>
              </div>
            </div>

            {checkoutError && <div className="checkout-error-banner">{checkoutError}</div>}

            {/* STEP 1: Compact Account Details Form */}
            {checkoutStep === "details" && (
              <>
                <div className="modal-header compact">
                  <h3>Account & Membership Setup</h3>
                  <p>Credentials will connect directly to your Member Portal login.</p>
                </div>

                <form className="register-form compact" onSubmit={handleProceedToPayment}>
                  <div className="form-row compact">
                    <div className="form-group compact">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group compact">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Your email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row compact">
                    <div className="form-group compact">
                      <label>Password *</label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Min 4 characters"
                        value={formData.password}
                        onChange={handleInputChange}
                        autoComplete="new-password"
                        required
                      />
                    </div>
                    <div className="form-group compact">
                      <label>Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="e.g. 6301202481"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row compact">
                    <div className="form-group compact">
                      <label>Plan Tier</label>
                      <select
                        name="planId"
                        value={formData.planId}
                        onChange={handleInputChange}
                      >
                        {membershipPlans.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group compact">
                      <label>Billing Cycle</label>
                      <select
                        name="cycle"
                        value={formData.cycle}
                        onChange={handleInputChange}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly (Save 15%)</option>
                        <option value="yearly">Yearly (Save 30%)</option>
                      </select>
                    </div>
                  </div>

                  <div className="plan-summary-pill compact">
                    <div className="summary-left">
                      <strong>{chosenPlan.name}</strong> • {formData.cycle.toUpperCase()}
                      {chosenPT && <span> + PT</span>}
                    </div>
                    <div className="summary-price">₹{totalAmount}</div>
                  </div>

                  <button type="submit" className="submit-register-btn compact">
                    Proceed to Payment (₹{totalAmount}) ➔
                  </button>
                </form>
              </>
            )}

            {/* STEP 2: Compact Payment Gateway Path */}
            {checkoutStep === "payment" && (
              <>
                <div className="modal-header compact">
                  <h3>Payment Checkout</h3>
                  <p>Encrypted payment gateway with instant portal activation.</p>
                </div>

                <div className="checkout-order-summary-compact">
                  <div className="summary-compact-left">
                    <span className="summary-plan-badge">{chosenPlan.name}</span>
                    <span className="summary-cycle-text">{formData.cycle.toUpperCase()} BILLING</span>
                  </div>
                  <div className="summary-compact-right">
                    <span className="summary-price-label">Total:</span>
                    <span className="summary-price-val">₹{totalAmount}</span>
                  </div>
                </div>

                {/* Compact Payment Method Switcher */}
                <div className="payment-method-tabs compact">
                  <button
                    type="button"
                    className={`pay-tab-btn compact ${paymentMethod === "card" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    💳 Card
                  </button>
                  <button
                    type="button"
                    className={`pay-tab-btn compact ${paymentMethod === "upi" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("upi")}
                  >
                    📱 UPI
                  </button>
                </div>

                <form className="payment-form compact" onSubmit={handleProcessPayment}>
                  {paymentMethod === "card" ? (
                    <div className="card-fields-group compact">
                      <div className="form-group compact">
                        <label>Card Number</label>
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="4532 •••• •••• 8820"
                          maxLength="19"
                          value={paymentData.cardNumber}
                          onChange={handlePaymentInputChange}
                          required
                        />
                      </div>

                      <div className="form-row compact">
                        <div className="form-group compact">
                          <label>Expiry (MM/YY)</label>
                          <input
                            type="text"
                            name="cardExpiry"
                            placeholder="MM / YY"
                            maxLength="5"
                            value={paymentData.cardExpiry}
                            onChange={handlePaymentInputChange}
                            required
                          />
                        </div>
                        <div className="form-group compact">
                          <label>CVV</label>
                          <input
                            type="password"
                            name="cardCvv"
                            placeholder="•••"
                            maxLength="4"
                            value={paymentData.cardCvv}
                            onChange={handlePaymentInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="upi-fields-group compact">
                      <div className="form-group compact">
                        <label>UPI ID (VPA)</label>
                        <input
                          type="text"
                          name="upiId"
                          placeholder="yourname@okhdfcbank"
                          value={paymentData.upiId}
                          onChange={handlePaymentInputChange}
                          required
                        />
                      </div>
                      <div className="upi-apps-row compact">
                        <span className="upi-app-badge">GPay</span>
                        <span className="upi-app-badge">PhonePe</span>
                        <span className="upi-app-badge">Paytm</span>
                      </div>
                    </div>
                  )}

                  <div className="payment-actions-row compact">
                    <button
                      type="button"
                      className="back-step-btn compact"
                      onClick={() => setCheckoutStep("details")}
                      disabled={isProcessing}
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="submit-payment-btn compact"
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : `Pay ₹${totalAmount} & Unlock Portal ➔`}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* STEP 3: Compact Payment Success Pass */}
            {checkoutStep === "success" && registeredMember && (
              <div className="digital-pass-wrapper compact">
                <div className="pass-success-icon compact">🎉</div>
                <h3 className="compact-title">Payment Confirmed!</h3>
                <p className="pass-subtext compact">
                  Your <strong>{registeredMember.planName}</strong> membership is active. Unlocking portal...
                </p>

                <div className="digital-card compact">
                  <div className="digital-card-top">
                    <div className="card-brand">
                      IronFit <span>Elite</span>
                    </div>
                    <span className="card-tier-pill">{registeredMember.planName}</span>
                  </div>

                  <div className="digital-card-mid">
                    <div className="card-member-name">{registeredMember.fullName}</div>
                    <div className="card-detail-item">
                      <span className="label">Member ID:</span>
                      <span className="val">{registeredMember.memberId}</span>
                    </div>
                    <div className="card-detail-item">
                      <span className="label">Paid:</span>
                      <span className="val">₹{registeredMember.totalPaid} ({registeredMember.cycle.toUpperCase()})</span>
                    </div>
                    <div className="card-detail-item">
                      <span className="label">Valid Until:</span>
                      <span className="val">{registeredMember.expiryDate}</span>
                    </div>
                  </div>

                  <div className="digital-card-bottom">
                    <div className="simulated-barcode">
                      <div className="barcode-bars"></div>
                      <span className="barcode-num">{registeredMember.memberId}</span>
                    </div>
                    <div className="qr-sim">
                      <div className="qr-box">
                        <span>PAID</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pass-actions compact">
                  <button
                    className="done-btn compact"
                    onClick={() => {
                      closeModal();
                      const saved = localStorage.getItem("ironfit_current_user");
                      if (saved && onLoginSuccess) {
                        onLoginSuccess(JSON.parse(saved));
                      }
                    }}
                  >
                    Enter Member Portal ➔
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default MembershipPlans;
