import React, { useState, useEffect } from "react";
import HeroBackgroundAnimation from "./HeroBackgroundAnimation";
import "./styles/ProgressTracker.css";

const ProgressTracker = () => {
  // Local storage keys
  const STORAGE_KEY_LOGS = "ironfit_progress_logs_v1";
  const STORAGE_KEY_GOALS = "ironfit_goals_v1";
  const STORAGE_KEY_PHOTOS = "ironfit_progress_photos_v1";
  const STORAGE_KEY_STREAK = "ironfit_workout_streak_v1";

  // Initial sample weight logs if empty
  const defaultLogs = [
    { date: "Oct 01", weight: 75.8, waist: 33.5, bodyFat: 19.2 },
    { date: "Oct 05", weight: 75.2, waist: 33.2, bodyFat: 18.9 },
    { date: "Oct 09", weight: 74.6, waist: 32.8, bodyFat: 18.5 },
    { date: "Oct 12", weight: 74.1, waist: 32.4, bodyFat: 18.1 },
    { date: "Oct 16", weight: 73.5, waist: 32.0, bodyFat: 17.6 },
  ];

  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGS);
      return saved ? JSON.parse(saved) : defaultLogs;
    } catch {
      return defaultLogs;
    }
  });

  const [goals] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GOALS);
      return saved
        ? JSON.parse(saved)
        : { targetWeight: 70.0, weeklyWorkouts: 5, bodyFatTarget: 14.0, dailyWaterLiters: 3.5 };
    } catch {
      return { targetWeight: 70.0, weeklyWorkouts: 5, bodyFatTarget: 14.0, dailyWaterLiters: 3.5 };
    }
  });

  // Workout completion tracking
  const [completedWorkoutsThisWeek, setCompletedWorkoutsThisWeek] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STREAK);
      return saved ? JSON.parse(saved) : [true, true, true, false, true, false, false];
    } catch {
      return [true, true, true, false, true, false, false];
    }
  });

  // Progress photos with privacy controls
  const [photos, setPhotos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PHOTOS);
      return saved
        ? JSON.parse(saved)
        : {
            before: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80",
            after: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80",
          };
    } catch {
      return { before: null, after: null };
    }
  });

  const [isPhotoBlurred, setIsPhotoBlurred] = useState(false);
  const [newLogWeight, setNewLogWeight] = useState("");
  const [newLogWaist, setNewLogWaist] = useState("");
  const [newLogFat, setNewLogFat] = useState("");
  const [activeChartMetric, setActiveChartMetric] = useState("weight"); // weight | waist | bodyFat

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
    } catch {
      // Ignore
    }
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GOALS, JSON.stringify(goals));
    } catch {
      // Ignore
    }
  }, [goals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STREAK, JSON.stringify(completedWorkoutsThisWeek));
    } catch {
      // Ignore
    }
  }, [completedWorkoutsThisWeek]);

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!newLogWeight) return;
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const newEntry = {
      date: today,
      weight: parseFloat(newLogWeight),
      waist: newLogWaist ? parseFloat(newLogWaist) : logs[logs.length - 1]?.waist || 32,
      bodyFat: newLogFat ? parseFloat(newLogFat) : logs[logs.length - 1]?.bodyFat || 18,
    };
    setLogs((prev) => [...prev, newEntry]);
    setNewLogWeight("");
    setNewLogWaist("");
    setNewLogFat("");
  };

  const toggleDayWorkout = (index) => {
    setCompletedWorkoutsThisWeek((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  const handlePhotoUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = { ...photos, [type]: reader.result };
        setPhotos(updated);
        try {
          localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(updated));
        } catch {
          // Ignore
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Metrics for SVG Chart
  const chartData = logs.map((log) => ({
    date: log.date,
    val: log[activeChartMetric] || 0,
  }));

  const minVal = Math.min(...chartData.map((d) => d.val), 60);
  const maxVal = Math.max(...chartData.map((d) => d.val), 80);
  const valRange = maxVal - minVal || 1;

  const svgWidth = 520;
  const svgHeight = 220;
  const padding = 35;

  const points = chartData.map((d, i) => {
    const x = padding + (i / (chartData.length - 1 || 1)) * (svgWidth - padding * 2);
    const y = svgHeight - padding - ((d.val - minVal) / valRange) * (svgHeight - padding * 2);
    return { x, y, ...d };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  const completedCount = completedWorkoutsThisWeek.filter(Boolean).length;
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Goal calculation
  const latestWeight = logs[logs.length - 1]?.weight || 73.5;
  const initialWeight = logs[0]?.weight || 75.8;
  const weightLost = (initialWeight - latestWeight).toFixed(1);

  return (
    <section className="progress-tracker-section reveal" id="progress">
      <HeroBackgroundAnimation />
      <div className="section-header">
        <span className="section-tag">Transformation Journal</span>
        <h2 className="section-title">
          Fitness Progress & <span>Milestones</span>
        </h2>
        <p className="section-subtitle">
          Track body weight trends, weekly workout consistency, body measurements, and private progress photos.
        </p>
      </div>

      <div className="tracker-grid">
        {/* LEFT COLUMN: Goals & Workout Streak */}
        <div className="tracker-col">
          {/* Personal Goals Card */}
          <div className="dashboard-card">
            <div className="card-top-row">
              <h3>🎯 Personal Fitness Goals</h3>
              <span className="live-status-pill">Active Phase</span>
            </div>

            <div className="goal-items-list">
              <div className="goal-item">
                <div className="goal-info">
                  <span className="goal-name">Target Body Weight</span>
                  <span className="goal-nums">
                    Current: <strong>{latestWeight} kg</strong> / Goal: <strong>{goals.targetWeight} kg</strong>
                  </span>
                </div>
                <div className="goal-prog-bar">
                  <div
                    className="goal-fill-orange"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(10, (1 - Math.abs(latestWeight - goals.targetWeight) / 10) * 100)
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="goal-item">
                <div className="goal-info">
                  <span className="goal-name">Target Body Fat</span>
                  <span className="goal-nums">
                    Current: <strong>{logs[logs.length - 1]?.bodyFat}%</strong> / Goal: <strong>{goals.bodyFatTarget}%</strong>
                  </span>
                </div>
                <div className="goal-prog-bar">
                  <div className="goal-fill-green" style={{ width: "75%" }}></div>
                </div>
              </div>

              <div className="goal-item">
                <div className="goal-info">
                  <span className="goal-name">Weekly Workout Target</span>
                  <span className="goal-nums">
                    {completedCount} of {goals.weeklyWorkouts} Sessions Completed
                  </span>
                </div>
                <div className="goal-prog-bar">
                  <div
                    className="goal-fill-blue"
                    style={{ width: `${Math.min(100, (completedCount / goals.weeklyWorkouts) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="summary-highlight">
              🏆 You have shredded <strong>{weightLost > 0 ? weightLost : 0} kg</strong> since starting this phase!
            </div>
          </div>

          {/* Workout Completion Tracker (Weekly Streak) */}
          <div className="dashboard-card">
            <div className="card-top-row">
              <h3>🔥 Weekly Workout Consistency</h3>
              <span className="streak-badge">{completedCount} / 7 Days</span>
            </div>
            <p className="card-subtext">Click each day to check off your completed workout session:</p>

            <div className="days-checkbox-row">
              {daysOfWeek.map((day, idx) => {
                const isDone = completedWorkoutsThisWeek[idx];
                return (
                  <button
                    key={day}
                    className={`day-streak-btn ${isDone ? "completed" : ""}`}
                    onClick={() => toggleDayWorkout(idx)}
                    title={`Toggle ${day}`}
                  >
                    <span className="day-abbr">{day}</span>
                    <span className="day-check">{isDone ? "✓" : "○"}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Log New Entry Form */}
          <div className="dashboard-card">
            <h3>📝 Record New Measurement Log</h3>
            <form className="quick-log-form" onSubmit={handleAddLog}>
              <div className="log-inputs-row">
                <div className="log-field">
                  <label>Weight (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="73.2"
                    value={newLogWeight}
                    onChange={(e) => setNewLogWeight(e.target.value)}
                    required
                  />
                </div>
                <div className="log-field">
                  <label>Waist (in)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="31.8"
                    value={newLogWaist}
                    onChange={(e) => setNewLogWaist(e.target.value)}
                  />
                </div>
                <div className="log-field">
                  <label>Body Fat %</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="17.2"
                    value={newLogFat}
                    onChange={(e) => setNewLogFat(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="save-log-btn">
                Add Entry to Timeline
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Charts & Progress Photos */}
        <div className="tracker-col">
          {/* Progress Chart */}
          <div className="dashboard-card">
            <div className="card-top-row">
              <h3>📈 Progress Trend Chart</h3>
              <div className="metric-switch-chips">
                <button
                  className={`metric-chip ${activeChartMetric === "weight" ? "active" : ""}`}
                  onClick={() => setActiveChartMetric("weight")}
                >
                  Weight (kg)
                </button>
                <button
                  className={`metric-chip ${activeChartMetric === "waist" ? "active" : ""}`}
                  onClick={() => setActiveChartMetric("waist")}
                >
                  Waist (in)
                </button>
                <button
                  className={`metric-chip ${activeChartMetric === "bodyFat" ? "active" : ""}`}
                  onClick={() => setActiveChartMetric("bodyFat")}
                >
                  Body Fat %
                </button>
              </div>
            </div>

            {/* Responsive SVG Chart */}
            <div className="chart-wrapper">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="progress-svg-chart"
              >
                {/* Horizontal Grid lines */}
                <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="rgba(255,255,255,0.06)" />
                <line x1={padding} y1={svgHeight / 2} x2={svgWidth - padding} y2={svgHeight / 2} stroke="rgba(255,255,255,0.06)" />
                <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="rgba(255,255,255,0.12)" />

                {/* Trend line */}
                <polyline
                  fill="none"
                  stroke="#ff6b00"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={polylinePoints}
                />

                {/* Data Points */}
                {points.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r="5" fill="#ff6b00" stroke="#161616" strokeWidth="2" />
                    <text
                      x={p.x}
                      y={p.y - 10}
                      textAnchor="middle"
                      fill="#ff8c00"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {p.val}
                    </text>
                    <text
                      x={p.x}
                      y={svgHeight - padding + 18}
                      textAnchor="middle"
                      fill="#888"
                      fontSize="9"
                    >
                      {p.date}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Progress Photos with Privacy Controls */}
          <div className="dashboard-card">
            <div className="card-top-row">
              <h3>📸 Visual Physique Progress</h3>
              <div className="privacy-ctrls">
                <button
                  className={`privacy-toggle-btn ${isPhotoBlurred ? "blurred" : ""}`}
                  onClick={() => setIsPhotoBlurred(!isPhotoBlurred)}
                >
                  {isPhotoBlurred ? "👁️ Reveal Photos" : "🔒 Blur for Privacy"}
                </button>
              </div>
            </div>

            <div className="photos-comparison-grid">
              {/* Before Photo */}
              <div className="photo-card">
                <span className="photo-tag">Starting Baseline</span>
                <div className={`photo-preview-box ${isPhotoBlurred ? "blurred" : ""}`}>
                  {photos.before ? (
                    <img src={photos.before} alt="Before Transformation" />
                  ) : (
                    <div className="photo-placeholder">No Image</div>
                  )}
                </div>
                <label className="upload-photo-label">
                  📷 Upload Starting Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, "before")}
                    style={{ display: "none" }}
                  />
                </label>
              </div>

              {/* After Photo */}
              <div className="photo-card">
                <span className="photo-tag current">Current Progress</span>
                <div className={`photo-preview-box ${isPhotoBlurred ? "blurred" : ""}`}>
                  {photos.after ? (
                    <img src={photos.after} alt="Current Physique" />
                  ) : (
                    <div className="photo-placeholder">No Image</div>
                  )}
                </div>
                <label className="upload-photo-label current">
                  📸 Upload Current Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, "after")}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgressTracker;
