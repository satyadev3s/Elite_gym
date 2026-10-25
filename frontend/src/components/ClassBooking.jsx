import React, { useState } from "react";
import { groupClassesData } from "../data/fitnessData.js";
import HeroBackgroundAnimation from "./HeroBackgroundAnimation";
import "./styles/ClassBooking.css";

const generateBookingRef = () => "BK-" + Math.floor(1000 + Math.random() * 9000);
const getCurrentBookingTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const ClassBooking = () => {
  const [classes, setClasses] = useState(groupClassesData);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedDay, setSelectedDay] = useState("All");
  const [bookedClasses, setBookedClasses] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const [activeView, setActiveView] = useState("schedule"); // schedule | my-bookings

  const categories = ["All", "Yoga", "Zumba", "Strength", "HIIT", "Pilates", "Cycling"];
  const days = ["All", "Mon, Wed, Fri", "Tue, Thu, Sat", "Tue, Thu"];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleBookClass = (classItem) => {
    if (bookedClasses.some((b) => b.id === classItem.id)) {
      showToast("⚠️ You have already reserved a spot in this class!");
      return;
    }

    if (classItem.booked >= classItem.capacity) {
      showToast("❌ Class is at maximum capacity. Please join the waitlist.");
      return;
    }

    // Increment booked count
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classItem.id ? { ...c, booked: c.booked + 1 } : c
      )
    );

    const bookingRef = generateBookingRef();
    const newBooking = {
      ...classItem,
      bookingRef,
      bookingTime: getCurrentBookingTime(),
    };

    setBookedClasses((prev) => [...prev, newBooking]);
    showToast(`✅ Successfully booked ${classItem.name}! Pass Ref: ${bookingRef}`);
  };

  const handleCancelBooking = (bookingId) => {
    const cancelled = bookedClasses.find((b) => b.id === bookingId);
    if (!cancelled) return;

    // Restore capacity
    setClasses((prev) =>
      prev.map((c) =>
        c.id === bookingId ? { ...c, booked: Math.max(0, c.booked - 1) } : c
      )
    );

    setBookedClasses((prev) => prev.filter((b) => b.id !== bookingId));
    showToast(`🔄 Booking for "${cancelled.name}" has been cancelled. Capacity restored.`);
  };

  const filteredClasses = classes.filter((c) => {
    const matchesCat = activeCategory === "All" || c.category === activeCategory;
    const matchesDay = selectedDay === "All" || c.days.includes(selectedDay);
    return matchesCat && matchesDay;
  });

  return (
    <section className="class-booking-section reveal" id="classes">
      <HeroBackgroundAnimation />
      <div className="section-header">
        <span className="section-tag">Group Fitness</span>
        <h2 className="section-title">
          Live Studio <span>Class Schedule</span>
        </h2>
        <p className="section-subtitle">
          From meditative Vinyasa Yoga to high-energy Zumba, HIIT, and barbell strength circuits. Reserve your spot instantly.
        </p>

        {/* View Switcher */}
        <div className="booking-view-switcher">
          <button
            className={`booking-tab-btn ${activeView === "schedule" ? "active" : ""}`}
            onClick={() => setActiveView("schedule")}
          >
            📋 Explore All Classes ({classes.length})
          </button>
          <button
            className={`booking-tab-btn ${activeView === "my-bookings" ? "active" : ""}`}
            onClick={() => setActiveView("my-bookings")}
          >
            🎟️ My Booked Classes ({bookedClasses.length})
          </button>
        </div>
      </div>

      {toastMessage && <div className="booking-toast-alert">{toastMessage}</div>}

      {activeView === "schedule" ? (
        <>
          {/* Filter Bar */}
          <div className="class-filters-bar">
            <div className="filter-block">
              <span className="f-title">Category:</span>
              <div className="category-chips">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`cat-chip ${activeCategory === cat ? "active" : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-block">
              <span className="f-title">Day:</span>
              <select
                className="day-select"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Classes Grid */}
          <div className="classes-grid">
            {filteredClasses.map((item) => {
              const spotsLeft = item.capacity - item.booked;
              const isFull = spotsLeft <= 0;
              const isBookedByUser = bookedClasses.some((b) => b.id === item.id);
              const capacityPercentage = Math.round((item.booked / item.capacity) * 100);

              return (
                <div key={item.id} className="class-card">
                  <div className="class-card-top">
                    <span className="class-category-badge">{item.category}</span>
                    <span className="class-difficulty">{item.difficulty}</span>
                  </div>

                  <h3 className="class-title">{item.name}</h3>
                  <p className="class-desc">{item.description}</p>

                  <div className="class-meta-list">
                    <div className="meta-item">
                      <span className="meta-icon">👤</span>
                      <span>Coach: <strong>{item.instructor}</strong></span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">🕒</span>
                      <span>{item.time} ({item.days})</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">📍</span>
                      <span>{item.studio}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">⚡</span>
                      <span>Est. Burn: {item.caloriesBurn}</span>
                    </div>
                  </div>

                  {/* Capacity Meter */}
                  <div className="capacity-section">
                    <div className="capacity-header">
                      <span>Live Capacity</span>
                      <span className="capacity-numbers">
                        {item.booked} / {item.capacity} booked ({spotsLeft} spots left)
                      </span>
                    </div>
                    <div className="capacity-progress-bar">
                      <div
                        className={`capacity-fill ${
                          isFull
                            ? "full"
                            : capacityPercentage > 75
                            ? "warning"
                            : "available"
                        }`}
                        style={{ width: `${capacityPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Booking Action */}
                  <div className="class-card-footer">
                    {isBookedByUser ? (
                      <div className="already-booked-badge">
                        <span>✓ You're Booked!</span>
                        <button
                          className="quick-cancel-btn"
                          onClick={() => handleCancelBooking(item.id)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        className={`book-now-btn ${isFull ? "disabled" : ""}`}
                        disabled={isFull}
                        onClick={() => handleBookClass(item)}
                      >
                        {isFull ? "Class Full (Waitlist)" : "Reserve Slot"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* My Bookings View */
        <div className="my-bookings-container">
          {bookedClasses.length === 0 ? (
            <div className="empty-bookings-box">
              <div className="empty-icon">🎟️</div>
              <h3>No Active Class Reservations</h3>
              <p>You haven't reserved any group fitness sessions yet.</p>
              <button
                className="browse-classes-btn"
                onClick={() => setActiveView("schedule")}
              >
                Browse Upcoming Classes ➔
              </button>
            </div>
          ) : (
            <div className="my-bookings-list">
              <div className="my-bookings-header">
                <h3>Your Active Passes</h3>
                <p>Present your booking reference at the studio entrance 5 minutes before class.</p>
              </div>

              {bookedClasses.map((item) => (
                <div key={item.id} className="booking-pass-card">
                  <div className="pass-left">
                    <div className="pass-ref">PASS: {item.bookingRef}</div>
                    <h4>{item.name}</h4>
                    <div className="pass-meta">
                      <span>Instructor: {item.instructor}</span>
                      <span>•</span>
                      <span>Time: {item.time}</span>
                      <span>•</span>
                      <span>Studio: {item.studio}</span>
                    </div>
                  </div>

                  <div className="pass-right">
                    <button
                      className="cancel-booking-btn"
                      onClick={() => handleCancelBooking(item.id)}
                    >
                      Cancel Reservation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ClassBooking;
