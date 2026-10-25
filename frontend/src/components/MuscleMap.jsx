import React, { useState } from "react";
import { muscleGroupsData } from "../data/muscleMapData.js";
import VideoModal from "./VideoModal.jsx";
import HeroBackgroundAnimation from "./HeroBackgroundAnimation";
import "./styles/MuscleMap.css";

const MuscleMap = () => {
  const [selectedMuscleId, setSelectedMuscleId] = useState("chest");
  const [bodyView, setBodyView] = useState("front"); // front | back
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [logToast, setLogToast] = useState(null);
  const [activeModalExercise, setActiveModalExercise] = useState(null);

  // Persistent training log state for muscle groups
  const [muscleStates, setMuscleStates] = useState(muscleGroupsData);

  const selectedMuscle = muscleStates[selectedMuscleId] || muscleStates.chest;
  const currentExercise = selectedMuscle.exercises[activeExerciseIndex] || selectedMuscle.exercises[0];

  const handleSelectMuscle = (id) => {
    setSelectedMuscleId(id);
    setActiveExerciseIndex(0);
  };

  const handleLogWorkoutToday = () => {
    setMuscleStates((prev) => {
      const current = prev[selectedMuscleId];
      return {
        ...prev,
        [selectedMuscleId]: {
          ...current,
          lastTrained: "Today (Just now)",
          setsThisWeek: current.setsThisWeek + 4,
          weeklyVolumeKg: current.weeklyVolumeKg + 1200,
          recoveryScore: 35, // High fatigue / fresh workout
          recoveryStatus: "Recovery Phase (DOMS Peak)",
          recoveryColor: "#ef4444",
        },
      };
    });

    setLogToast(`✅ Logged 4 sets for ${selectedMuscle.name}! Recovery countdown started.`);
    setTimeout(() => setLogToast(null), 4000);
  };

  return (
    <section className="musclemap-section reveal" id="musclemap">
      <HeroBackgroundAnimation />
      <div className="section-header">
        <span className="section-tag">Interactive Biomechanics</span>
        <h2 className="section-title">
          MuscleMap — <span>Your Body, Your Journey</span>
        </h2>
        <p className="section-subtitle">
          Select any muscle on the interactive 3D-styled anatomical map. Access curated demonstration videos, training volume history, and bio-recovery readiness.
        </p>

        {logToast && <div className="muscle-log-toast">{logToast}</div>}

        {/* View Toggle (Front vs Back) */}
        <div className="map-view-switcher">
          <button
            className={`map-view-btn ${bodyView === "front" ? "active" : ""}`}
            onClick={() => setBodyView("front")}
          >
            👤 Anterior (Front View)
          </button>
          <button
            className={`map-view-btn ${bodyView === "back" ? "active" : ""}`}
            onClick={() => setBodyView("back")}
          >
            🔄 Posterior (Back View)
          </button>
        </div>
      </div>

      <div className="musclemap-container">
        {/* LEFT COLUMN: 3D Anatomical Body Map Visualizer */}
        <div className="bodymap-visualizer-card">
          <div className="visualizer-header">
            <span className="visualizer-title">
              {bodyView === "front" ? "Anterior Muscle Kinetic Chain" : "Posterior Kinetic Chain"}
            </span>
            <span className="hint-pill">Click a muscle to inspect ➔</span>
          </div>

          <div className="body-canvas-wrapper">
            {/* Interactive Anatomical SVG Body Map */}
            <svg
              viewBox="0 0 320 540"
              className="anatomical-svg-body"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="bodyBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e2229" />
                  <stop offset="100%" stopColor="#11141a" />
                </linearGradient>
              </defs>

              {/* Head & Neck silhouette */}
              <circle cx="160" cy="45" r="24" fill="#252a33" stroke="#333b47" strokeWidth="2" />
              <path d="M150,68 L170,68 L174,86 L146,86 Z" fill="#252a33" />

              {bodyView === "front" ? (
                /* --- ANTERIOR / FRONT MUSCLES --- */
                <g className="anterior-muscles">
                  {/* SHOULDERS (Deltoids) */}
                  <g
                    className={`muscle-svg-group ${selectedMuscleId === "shoulders" ? "active" : ""}`}
                    onClick={() => handleSelectMuscle("shoulders")}
                  >
                    {/* Left Deltoid */}
                    <path
                      d="M110,88 C96,96 85,116 88,138 C94,142 108,130 114,116 Z"
                      className="muscle-path"
                    />
                    {/* Right Deltoid */}
                    <path
                      d="M210,88 C224,96 235,116 232,138 C226,142 212,130 206,116 Z"
                      className="muscle-path"
                    />
                    <text x="160" y="104" className="muscle-svg-label">Shoulders</text>
                  </g>

                  {/* CHEST (Pectorals) */}
                  <g
                    className={`muscle-svg-group ${selectedMuscleId === "chest" ? "active" : ""}`}
                    onClick={() => handleSelectMuscle("chest")}
                  >
                    <path
                      d="M116,92 C140,88 158,102 160,118 C158,138 132,150 114,146 C108,124 110,104 116,92 Z"
                      className="muscle-path"
                    />
                    <path
                      d="M204,92 C180,88 162,102 160,118 C162,138 188,150 206,146 C212,124 210,104 204,92 Z"
                      className="muscle-path"
                    />
                    <text x="160" y="130" className="muscle-svg-label">Pecs</text>
                  </g>

                  {/* BICEPS */}
                  <g
                    className={`muscle-svg-group ${selectedMuscleId === "biceps" ? "active" : ""}`}
                    onClick={() => handleSelectMuscle("biceps")}
                  >
                    <path
                      d="M86,142 C82,160 84,185 92,204 C98,202 104,182 102,156 Z"
                      className="muscle-path"
                    />
                    <path
                      d="M234,142 C238,160 236,185 228,204 C222,202 216,182 218,156 Z"
                      className="muscle-path"
                    />
                    <text x="74" y="180" className="muscle-svg-label">Biceps</text>
                    <text x="246" y="180" className="muscle-svg-label">Biceps</text>
                  </g>

                  {/* Forearms */}
                  <path d="M88,210 L76,275 L86,280 L100,214 Z" fill="#252a33" />
                  <path d="M232,210 L244,275 L234,280 L220,214 Z" fill="#252a33" />

                  {/* ABS & CORE */}
                  <g
                    className={`muscle-svg-group ${selectedMuscleId === "abs" ? "active" : ""}`}
                    onClick={() => handleSelectMuscle("abs")}
                  >
                    <path
                      d="M128,156 C144,152 176,152 192,156 C194,184 196,218 190,246 C168,252 152,252 130,246 C124,218 126,184 128,156 Z"
                      className="muscle-path"
                    />
                    {/* Six pack subdivisions */}
                    <line x1="160" y1="156" x2="160" y2="248" stroke="#0d0d0d" strokeWidth="2" />
                    <line x1="135" y1="184" x2="185" y2="184" stroke="#0d0d0d" strokeWidth="2" />
                    <line x1="133" y1="214" x2="187" y2="214" stroke="#0d0d0d" strokeWidth="2" />
                    <text x="160" y="204" className="muscle-svg-label">Core / Abs</text>
                  </g>

                  {/* Hips / Pelvis base */}
                  <path d="M130,252 L190,252 L196,280 L124,280 Z" fill="#252a33" />

                  {/* QUADRICEPS */}
                  <g
                    className={`muscle-svg-group ${selectedMuscleId === "quads" ? "active" : ""}`}
                    onClick={() => handleSelectMuscle("quads")}
                  >
                    {/* Left Quad */}
                    <path
                      d="M124,284 C120,320 122,370 134,410 C146,412 156,368 156,286 Z"
                      className="muscle-path"
                    />
                    {/* Right Quad */}
                    <path
                      d="M196,284 C200,320 198,370 186,410 C174,412 164,368 164,286 Z"
                      className="muscle-path"
                    />
                    <text x="160" y="345" className="muscle-svg-label">Quads</text>
                  </g>

                  {/* Knee Joints */}
                  <circle cx="134" cy="422" r="8" fill="#252a33" />
                  <circle cx="186" cy="422" r="8" fill="#252a33" />

                  {/* CALVES (Front - Tibialis) */}
                  <g
                    className={`muscle-svg-group ${selectedMuscleId === "calves" ? "active" : ""}`}
                    onClick={() => handleSelectMuscle("calves")}
                  >
                    <path
                      d="M126,432 C122,460 126,488 132,514 L142,514 C146,488 144,460 142,432 Z"
                      className="muscle-path"
                    />
                    <path
                      d="M194,432 C198,460 194,488 188,514 L178,514 C174,488 176,460 178,432 Z"
                      className="muscle-path"
                    />
                    <text x="160" y="475" className="muscle-svg-label">Calves</text>
                  </g>
                </g>
              ) : (
                /* --- POSTERIOR / BACK MUSCLES --- */
                <g className="posterior-muscles">
                  {/* UPPER BACK & TRAPS */}
                  <g
                    className={`muscle-svg-group ${selectedMuscleId === "traps" ? "active" : ""}`}
                    onClick={() => handleSelectMuscle("traps")}
                  >
                    <path
                      d="M160,86 L124,96 L130,138 L160,165 L190,138 L196,96 Z"
                      className="muscle-path"
                    />
                    <text x="160" y="125" className="muscle-svg-label">Traps</text>
                  </g>

                  {/* LATS */}
                  <g
                    className={`muscle-svg-group ${selectedMuscleId === "lats" ? "active" : ""}`}
                    onClick={() => handleSelectMuscle("lats")}
                  >
                    <path
                      d="M122,106 C106,128 108,166 124,205 C136,186 142,165 138,142 Z"
                      className="muscle-path"
                    />
                    <path
                      d="M198,106 C214,128 212,166 196,205 C184,186 178,165 182,142 Z"
                      className="muscle-path"
                    />
                    <text x="160" y="180" className="muscle-svg-label">Lats</text>
                  </g>

                  {/* TRICEPS */}
                  <g
                    className={`muscle-svg-group ${selectedMuscleId === "triceps" ? "active" : ""}`}
                    onClick={() => handleSelectMuscle("triceps")}
                  >
                    <path
                      d="M86,126 C78,154 82,185 92,204 C98,198 102,170 100,138 Z"
                      className="muscle-path"
                    />
                    <path
                      d="M234,126 C242,154 238,185 228,204 C222,198 218,170 220,138 Z"
                      className="muscle-path"
                    />
                    <text x="70" y="165" className="muscle-svg-label">Triceps</text>
                    <text x="250" y="165" className="muscle-svg-label">Triceps</text>
                  </g>

                  {/* GLUTES */}
                  <g
                    className={`muscle-svg-group ${selectedMuscleId === "glutes" ? "active" : ""}`}
                    onClick={() => handleSelectMuscle("glutes")}
                  >
                    <path
                      d="M122,238 C118,272 126,298 158,300 C159,274 158,248 158,236 Z"
                      className="muscle-path"
                    />
                    <path
                      d="M198,238 C202,272 194,298 162,300 C161,274 162,248 162,236 Z"
                      className="muscle-path"
                    />
                    <text x="160" y="270" className="muscle-svg-label">Glutes</text>
                  </g>

                  {/* HAMSTRINGS */}
                  <g
                    className={`muscle-svg-group ${selectedMuscleId === "hamstrings" ? "active" : ""}`}
                    onClick={() => handleSelectMuscle("hamstrings")}
                  >
                    <path
                      d="M122,306 C120,344 124,386 136,412 C146,410 156,368 156,306 Z"
                      className="muscle-path"
                    />
                    <path
                      d="M198,306 C200,344 196,386 184,412 C174,410 164,368 164,306 Z"
                      className="muscle-path"
                    />
                    <text x="160" y="360" className="muscle-svg-label">Hamstrings</text>
                  </g>

                  {/* CALVES (Back - Gastrocnemius) */}
                  <g
                    className={`muscle-svg-group ${selectedMuscleId === "calves" ? "active" : ""}`}
                    onClick={() => handleSelectMuscle("calves")}
                  >
                    <path
                      d="M122,428 C116,456 122,488 132,514 L142,514 C148,488 150,456 142,428 Z"
                      className="muscle-path"
                    />
                    <path
                      d="M198,428 C204,456 198,488 188,514 L178,514 C172,488 170,456 178,428 Z"
                      className="muscle-path"
                    />
                    <text x="160" y="475" className="muscle-svg-label">Calves</text>
                  </g>
                </g>
              )}
            </svg>
          </div>

          {/* Quick Muscle Selector Pills */}
          <div className="quick-muscle-pills">
            {(bodyView === "front"
              ? ["chest", "shoulders", "biceps", "abs", "quads", "calves"]
              : ["traps", "lats", "triceps", "glutes", "hamstrings", "calves"]
            ).map((id) => (
              <button
                key={id}
                className={`quick-pill ${selectedMuscleId === id ? "active" : ""}`}
                onClick={() => handleSelectMuscle(id)}
              >
                {muscleStates[id]?.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Muscle Intelligence, Videos, History & Recovery */}
        <div className="muscle-intel-dashboard">
          {/* Header Card */}
          <div className="intel-header-card">
            <div className="intel-title-row">
              <div>
                <span className="muscle-category-tag">{selectedMuscle.category}</span>
                <h3 className="muscle-main-name">{selectedMuscle.name}</h3>
                <p className="muscle-function">{selectedMuscle.function}</p>
              </div>

              {/* Bio-Recovery Gauge */}
              <div className="recovery-battery-box">
                <span className="rec-battery-label">Muscle Readiness</span>
                <div className="battery-meter-visual">
                  <div
                    className="battery-fill"
                    style={{
                      width: `${selectedMuscle.recoveryScore}%`,
                      background: selectedMuscle.recoveryColor,
                    }}
                  ></div>
                </div>
                <div className="battery-score-row">
                  <span className="score-val" style={{ color: selectedMuscle.recoveryColor }}>
                    {selectedMuscle.recoveryScore}%
                  </span>
                  <span className="status-text">{selectedMuscle.recoveryStatus}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Training History & Log Set Action */}
          <div className="training-history-card">
            <div className="history-header">
              <h4>📊 Recent Training History</h4>
              <button className="log-trained-btn" onClick={handleLogWorkoutToday}>
                + Log Trained Today
              </button>
            </div>

            <div className="history-stats-grid">
              <div className="stat-pill">
                <span className="stat-label">Last Stimulated</span>
                <span className="stat-val highlight">{selectedMuscle.lastTrained}</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Sets This Week</span>
                <span className="stat-val">{selectedMuscle.setsThisWeek} sets</span>
              </div>
              <div className="stat-pill">
                <span className="stat-label">Total Volume Load</span>
                <span className="stat-val">{selectedMuscle.weeklyVolumeKg.toLocaleString()} kg</span>
              </div>
            </div>
          </div>

          {/* Targeted Exercise Video Showcase */}
          <div className="exercise-video-card">
            <div className="exercise-tabs-header">
              <h4>🎬 Curated Exercise Demonstration</h4>
              <div className="exercise-switcher-chips">
                {selectedMuscle.exercises.map((ex, idx) => (
                  <button
                    key={ex.id}
                    className={`ex-chip ${activeExerciseIndex === idx ? "active" : ""}`}
                    onClick={() => {
                      setActiveExerciseIndex(idx);
                      setIsPlaying(false);
                      if (videoRef.current) {
                        videoRef.current.pause();
                        videoRef.current.currentTime = 0;
                      }
                    }}
                  >
                    {ex.title.split(" ")[0]} {ex.title.split(" ")[1] || ""}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Player */}
            <div className="video-player-container">
              <div className="video-viewport">
                <div className="video-top-shield" aria-hidden="true" />
                {currentExercise.youtubeId ? (
                  <iframe
                    className="active-video-element"
                    src={`https://www.youtube.com/embed/${currentExercise.youtubeId}?autoplay=0&mute=1&rel=0&controls=1&modestbranding=1&iv_load_policy=3&showinfo=0`}
                    title={`${currentExercise.title} Online Tutorial`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={currentExercise.videoUrl || "/workout_demo.mp4"}
                    poster={currentExercise.videoPoster}
                    playsInline
                    loop
                    controls
                    className="active-video-element"
                  />
                )}

                <div className="video-top-badge">
                  <span className="badge-hd">1080p Online HD</span>
                  <span className="badge-type">{currentExercise.type}</span>
                </div>
              </div>

              {/* Video Info & Biomechanical Form Cues */}
              <div className="video-details-box">
                <div className="video-title-row">
                  <div>
                    <h5>{currentExercise.title}</h5>
                    <span className="prescription-pill">{currentExercise.prescription}</span>
                  </div>
                  <button
                    className="open-theater-video-btn"
                    onClick={() => setActiveModalExercise(currentExercise)}
                  >
                    🎬 Open Match Video in Full Theater ➔
                  </button>
                </div>

                <div className="form-cues-section">
                  <h6>💡 Biomechanical Execution Checklist:</h6>
                  <ul className="cues-list">
                    {currentExercise.cues.map((cue, i) => (
                      <li key={i}>✓ {cue}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Recovery Guidance Protocols */}
          <div className="recovery-guidance-card">
            <h4>🛡️ Targeted Recovery & Mobility Protocol</h4>
            <div className="protocol-grid">
              <div className="protocol-item">
                <span className="p-icon">⏱️</span>
                <div>
                  <strong>Recommended Rest Interval:</strong>
                  <p>{selectedMuscle.recoveryGuidance.optimalRestHours}</p>
                </div>
              </div>
              <div className="protocol-item">
                <span className="p-icon">🧘</span>
                <div>
                  <strong>Mobility & Myofascial Release:</strong>
                  <p>{selectedMuscle.recoveryGuidance.mobilityStretch}</p>
                </div>
              </div>
              <div className="protocol-item">
                <span className="p-icon">💧</span>
                <div>
                  <strong>Hydration Protocol:</strong>
                  <p>{selectedMuscle.recoveryGuidance.hydrationRule}</p>
                </div>
              </div>
              <div className="protocol-item">
                <span className="p-icon">🥩</span>
                <div>
                  <strong>Nutritional Muscle Repair:</strong>
                  <p>{selectedMuscle.recoveryGuidance.nutritionTip}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeModalExercise && (
        <VideoModal
          exercise={activeModalExercise}
          onClose={() => setActiveModalExercise(null)}
        />
      )}
    </section>
  );
};

export default MuscleMap;
