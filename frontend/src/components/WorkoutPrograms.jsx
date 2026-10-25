import React, { useState, useEffect, useRef } from "react";
import { kabaddiPlanOverview, dailyWorkoutsData } from "../data/kabaddiPlanData.js";
import HeroBackgroundAnimation from "./HeroBackgroundAnimation";
import "./styles/WorkoutPrograms.css";

const getDefaultDayName = () => {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return dayNames[new Date().getDay()] || "Monday";
};

const getInitialExercise = (dayName) => {
  const workout = dailyWorkoutsData.find((d) => d.day === dayName) || dailyWorkoutsData[0];
  const eveningEx = workout.evening?.exercises || [];
  const morningEx = workout.morning?.exercises || [];
  if (eveningEx.length > 0 && !workout.evening?.isRestDay) {
    return eveningEx[0];
  }
  return morningEx[0] || null;
};

const WorkoutPrograms = () => {
  const [activeView, setActiveView] = useState("daily"); // daily | weekly-matrix | diet | timer
  const [selectedDayName, setSelectedDayName] = useState(getDefaultDayName);
  const [sessionFilter, setSessionFilter] = useState("all"); // all | morning | evening | kabaddi
  const [activeExercise, setActiveExercise] = useState(() => getInitialExercise(getDefaultDayName()));
  const [modalExercise, setModalExercise] = useState(null);

  // Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [initialDuration, setInitialDuration] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef(null);
  const playerStageRef = useRef(null);

  // Selected Day Workout Data
  const currentWorkout =
    dailyWorkoutsData.find((d) => d.day === selectedDayName) || dailyWorkoutsData[0];

  // Exercises breakdown for active day
  const morningExercises = currentWorkout.morning?.exercises || [];
  const eveningExercises = currentWorkout.evening?.exercises || [];
  const kabaddiDrills = currentWorkout.day === "Friday" ? kabaddiPlanOverview.kabaddiDrillsFriday : [];

  const allDayExercises = [
    ...morningExercises,
    ...eveningExercises,
    ...(currentWorkout.day === "Friday" ? kabaddiDrills : []),
  ];

  const handleSelectDay = (dayName) => {
    setSelectedDayName(dayName);
    setActiveExercise(getInitialExercise(dayName));
    setSessionFilter("all");
  };

  // Sound feedback using Web Audio API
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } catch {
      // AudioContext restricted or unsupported
    }
  };

  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsTimerRunning(false);
            playBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isTimerRunning]);

  const handleTimerPreset = (secs) => {
    setIsTimerRunning(false);
    setInitialDuration(secs);
    setTimerSeconds(secs);
  };

  const toggleTimer = () => {
    if (timerSeconds === 0) {
      setTimerSeconds(initialDuration);
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(initialDuration);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? "0" : ""}${rem}`;
  };

  const timerProgress =
    initialDuration > 0 ? ((initialDuration - timerSeconds) / initialDuration) * 100 : 0;

  // Filtered exercises list for the card grid
  let displayedExercises = [];
  if (sessionFilter === "morning") {
    displayedExercises = morningExercises;
  } else if (sessionFilter === "evening") {
    displayedExercises = eveningExercises;
  } else if (sessionFilter === "kabaddi") {
    displayedExercises = kabaddiDrills;
  } else {
    displayedExercises = allDayExercises;
  }

  // Active Exercise Navigation within current day
  const currentExIndex = allDayExercises.findIndex(
    (ex) => ex.id === (activeExercise?.id || "")
  );
  const prevExercise = currentExIndex > 0 ? allDayExercises[currentExIndex - 1] : null;
  const nextExercise =
    currentExIndex >= 0 && currentExIndex < allDayExercises.length - 1
      ? allDayExercises[currentExIndex + 1]
      : null;

  const selectExerciseForStage = (ex) => {
    setActiveExercise(ex);
    playerStageRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return (
    <section className="workout-programs-section reveal" id="programs">
      <HeroBackgroundAnimation />
      {/* Header Banner */}
      <div className="section-header">
        <span className="section-tag">30 DAY PLAN: KABADDIN</span>
        <h2 className="section-title">
          Daily Training & <span>Workout Engine</span>
        </h2>
        <p className="section-subtitle">
          {kabaddiPlanOverview.tagline} • Complete Morning Running & Evening Dumbbell Split with High-Definition Exercise Video Tutorials.
        </p>
      </div>

      {/* 5 ATHLETE KPI CARDS (From Top of Infographic) */}
      <div className="athletic-kpi-banner">
        <div className="kpi-card goal-card">
          <span className="kpi-icon">🎯</span>
          <div className="kpi-text">
            <strong>GOAL</strong>
            <span>Speed, Strength, Stamina, Agility & Fitness</span>
          </div>
        </div>

        <div className="kpi-card">
          <span className="kpi-icon">🏃</span>
          <div className="kpi-text">
            <strong>CURRENT STATS</strong>
            <span>Weight: 80 kg • Height: 162 cm</span>
          </div>
        </div>

        <div className="kpi-card target-card">
          <span className="kpi-icon">🏆</span>
          <div className="kpi-text">
            <strong>TARGET (30 DAYS)</strong>
            <span>Better Endurance • More Strength • Speed & Agility</span>
          </div>
        </div>

        <div className="kpi-card">
          <span className="kpi-icon">🏋️</span>
          <div className="kpi-text">
            <strong>EQUIPMENT</strong>
            <span>Dumbbells (30 kg) • Running Shoes • Mat</span>
          </div>
        </div>

        <div className="kpi-card focus-card">
          <span className="kpi-icon">⚡</span>
          <div className="kpi-text">
            <strong>FOCUS</strong>
            <span>Speed • Strength • Endurance • Consistency</span>
          </div>
        </div>
      </div>

      {/* Main Feature View Navigation Dock */}
      <div className="view-tabs-container">
        <div className="view-tabs">
          <button
            className={`view-tab-btn ${activeView === "daily" ? "active" : ""}`}
            onClick={() => setActiveView("daily")}
          >
            📅 Daily Workouts & Video Coach
          </button>
          <button
            className={`view-tab-btn ${activeView === "weekly-matrix" ? "active" : ""}`}
            onClick={() => setActiveView("weekly-matrix")}
          >
            📋 7-Day Schedule Matrix
          </button>
          <button
            className={`view-tab-btn ${activeView === "diet" ? "active" : ""}`}
            onClick={() => setActiveView("diet")}
          >
            🥗 Athletic Diet Plan
          </button>
          <button
            className={`view-tab-btn ${activeView === "timer" ? "active" : ""}`}
            onClick={() => setActiveView("timer")}
          >
            ⏱️ Rest Timer {isTimerRunning && <span className="timer-live-dot">●</span>}
          </button>
        </div>
      </div>

      {/* ============================================================
          VIEW 1: DAILY WORKOUTS & VIDEO COACH
          ============================================================ */}
      {activeView === "daily" && (
        <div className="daily-view-container">
          {/* Day Selector Pills Bar (Monday to Sunday) */}
          <div className="day-pills-bar">
            {dailyWorkoutsData.map((d) => (
              <button
                key={d.day}
                className={`day-pill-btn ${selectedDayName === d.day ? "active" : ""}`}
                onClick={() => handleSelectDay(d.day)}
              >
                <span className="day-pill-code">{d.code}</span>
                <span className="day-pill-name">{d.day}</span>
                <span className="day-pill-sub">{d.evening.split}</span>
              </button>
            ))}
          </div>

          {/* Active Day Header Banner */}
          <div className="active-day-header-banner">
            <div className="adh-left">
              <span className="adh-badge">
                {currentWorkout.code} • {currentWorkout.evening.split}
              </span>
              <h3 className="adh-title">
                {currentWorkout.day}: {currentWorkout.focus}
              </h3>
              <p className="adh-sub">
                🌅 Morning: {currentWorkout.morning.distance} | 🌆 Evening: {currentWorkout.evening.split}
              </p>
            </div>
            <div className="adh-right">
              <button
                className="adh-timer-btn"
                onClick={() => {
                  setActiveView("timer");
                  handleTimerPreset(60);
                }}
              >
                ⏱️ Open Rest Timer
              </button>
            </div>
          </div>

          {/* ============================================================
              MASTERCLASS ACTIVE VIDEO PLAYER STAGE
              Plays the selected exercise video tutorial right on screen
              ============================================================ */}
          {activeExercise && (
            <div className="active-video-stage-card" ref={playerStageRef}>
              <div className="stage-top-bar">
                <div className="stage-badges">
                  <span className={`stage-phase-badge ${activeExercise.phase?.toLowerCase() || "exercise"}`}>
                    {activeExercise.phase === "Morning"
                      ? "🌅 MORNING PROTOCOL"
                      : activeExercise.phase === "Evening"
                      ? "🌆 EVENING DUMBBELL"
                      : "⚡ KABADDI MATCH DRILL"}
                  </span>
                  <span className="stage-live-indicator">🔴 ACTIVE TUTORIAL DEMO</span>
                </div>
                <div className="stage-nav-controls">
                  <button
                    className="stage-nav-btn"
                    disabled={!prevExercise}
                    onClick={() => prevExercise && selectExerciseForStage(prevExercise)}
                    title={prevExercise ? `Previous: ${prevExercise.name}` : "First exercise"}
                  >
                    ◀ Prev
                  </button>
                  <span className="stage-nav-counter">
                    {currentExIndex + 1} / {allDayExercises.length}
                  </span>
                  <button
                    className="stage-nav-btn"
                    disabled={!nextExercise}
                    onClick={() => nextExercise && selectExerciseForStage(nextExercise)}
                    title={nextExercise ? `Next: ${nextExercise.name}` : "Last exercise"}
                  >
                    Next ▶
                  </button>
                </div>
              </div>

              <div className="stage-content-grid">
                {/* 16:9 Video Player Screen */}
                <div className="stage-player-wrapper">
                  <div className="video-top-shield" aria-hidden="true" />
                  {activeExercise.youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${activeExercise.youtubeId}?autoplay=0&mute=0&controls=1&rel=0&modestbranding=1&iv_load_policy=3&showinfo=0`}
                      title={`${activeExercise.name} Video Tutorial`}
                      className="stage-video-iframe"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="stage-no-video">
                      <img
                        src={activeExercise.thumbnail}
                        alt={activeExercise.name}
                        className="stage-fallback-img"
                      />
                      <div className="stage-no-video-overlay">
                        <span>⚡ Athletic Conditioning Movement</span>
                        <p>Perform with maximum velocity and disciplined form.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Details Panel */}
                <div className="stage-details-panel">
                  <div className="stage-details-header">
                    <span className="stage-muscle-tag">🎯 {activeExercise.muscle}</span>
                    <h3 className="stage-exercise-title">{activeExercise.name}</h3>
                  </div>

                  {/* Prescription Stats */}
                  <div className="stage-stats-row">
                    <div className="stage-stat-pill">
                      <span className="stat-label">Prescription</span>
                      <strong className="stat-val">
                        {activeExercise.sets} × {activeExercise.reps}
                      </strong>
                    </div>
                    {activeExercise.rest > 0 && (
                      <div className="stage-stat-pill">
                        <span className="stat-label">Rest Interval</span>
                        <strong className="stat-val">{activeExercise.rest}s</strong>
                      </div>
                    )}
                  </div>

                  {/* Biomechanical Cues */}
                  <div className="stage-cues-box">
                    <div className="cue-row">
                      <span className="cue-icon">💡</span>
                      <div>
                        <strong>Form & Execution Cue:</strong>
                        <p>{activeExercise.tips}</p>
                      </div>
                    </div>
                    {activeExercise.mistakes && (
                      <div className="cue-row mistake-cue">
                        <span className="cue-icon">⚠️</span>
                        <div>
                          <strong>Avoid Common Error:</strong>
                          <p>{activeExercise.mistakes}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Interactive Action Buttons */}
                  <div className="stage-actions-row">
                    {activeExercise.rest > 0 && (
                      <button
                        className="btn-stage-timer"
                        onClick={() => {
                          handleTimerPreset(activeExercise.rest);
                          setIsTimerRunning(true);
                          setActiveView("timer");
                        }}
                      >
                        ⏱️ Start Rest Timer ({activeExercise.rest}s)
                      </button>
                    )}
                    <button
                      className="btn-stage-modal"
                      onClick={() => setModalExercise(activeExercise)}
                    >
                      ⛶ Widescreen Cinema
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Session Phase Filter Tabs (Morning / Evening / Drills) */}
          <div className="session-filter-container">
            <span className="filter-heading">Filter Exercises:</span>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${sessionFilter === "all" ? "active" : ""}`}
                onClick={() => setSessionFilter("all")}
              >
                🔥 All Day Protocol ({allDayExercises.length})
              </button>
              <button
                className={`filter-btn ${sessionFilter === "morning" ? "active" : ""}`}
                onClick={() => setSessionFilter("morning")}
              >
                🌅 Morning Conditioning ({morningExercises.length})
              </button>
              <button
                className={`filter-btn ${sessionFilter === "evening" ? "active" : ""}`}
                onClick={() => setSessionFilter("evening")}
              >
                🌆 Evening Dumbbell Split ({eveningExercises.length})
              </button>
              {currentWorkout.day === "Friday" && (
                <button
                  className={`filter-btn kabaddi-btn ${sessionFilter === "kabaddi" ? "active" : ""}`}
                  onClick={() => setSessionFilter("kabaddi")}
                >
                  ⚡ Friday Kabaddi Drills ({kabaddiDrills.length})
                </button>
              )}
            </div>
          </div>

          {/* Warmup & Cooldown Protocol Strip (Required from Infographic) */}
          <div className="daily-protocol-banner">
            <div className="dp-item">
              <span className="dp-badge">🌿 10 MIN WARM-UP (BEFORE SESSION)</span>
              <p>{currentWorkout.morning.warmup}</p>
            </div>
            <div className="dp-item">
              <span className="dp-badge">🧘 10 MIN COOL DOWN (AFTER SESSION)</span>
              <p>{currentWorkout.morning.cooldown}</p>
            </div>
          </div>

          {/* ============================================================
              RICH VIDEO CARDS GRID
              Each card has full thumbnail, play badge, sets/reps, & cues
              ============================================================ */}
          <div className="video-cards-grid">
            {displayedExercises.map((ex, idx) => {
              const isCurrentPlaying = activeExercise?.id === ex.id;
              return (
                <div
                  key={ex.id || idx}
                  className={`video-exercise-card ${isCurrentPlaying ? "playing-active" : ""}`}
                  onClick={() => selectExerciseForStage(ex)}
                >
                  {/* Card Thumbnail Container */}
                  <div className="card-thumb-wrapper">
                    <img
                      src={ex.thumbnail}
                      alt={ex.name}
                      className="card-thumb-img"
                      loading="lazy"
                    />
                    <div className="card-thumb-overlay" />

                    {/* Play Badge Overlay */}
                    <div className="card-play-pill">
                      <span className="play-triangle">▶</span>
                      <span className="play-text">
                        {isCurrentPlaying ? "NOW PLAYING" : "PLAY DEMO"}
                      </span>
                    </div>

                    {/* Corner Badges */}
                    <span className="card-order-badge">#{idx + 1}</span>
                    <span className={`card-phase-badge ${ex.phase?.toLowerCase() || ""}`}>
                      {ex.phase === "Morning"
                        ? "🌅 MORNING"
                        : ex.phase === "Evening"
                        ? "🌆 EVENING"
                        : "⚡ KABADDI"}
                    </span>
                  </div>

                  {/* Card Information Body */}
                  <div className="card-body">
                    <div className="card-muscle-row">
                      <span className="card-muscle-pill">{ex.muscle}</span>
                    </div>

                    <h4 className="card-exercise-name">{ex.name}</h4>

                    {/* Prescription Matrix */}
                    <div className="card-presc-grid">
                      <div className="presc-col">
                        <span className="presc-lbl">Sets</span>
                        <strong className="presc-val">{ex.sets}</strong>
                      </div>
                      <div className="presc-col">
                        <span className="presc-lbl">Reps / Time</span>
                        <strong className="presc-val">{ex.reps}</strong>
                      </div>
                      <div className="presc-col">
                        <span className="presc-lbl">Rest</span>
                        <strong className="presc-val">
                          {ex.rest > 0 ? `${ex.rest}s` : "Flow"}
                        </strong>
                      </div>
                    </div>

                    {/* Form Cue Snippet */}
                    <p className="card-cue-snippet">
                      <strong>💡 Cue:</strong> {ex.tips}
                    </p>

                    {/* Card Actions */}
                    <div className="card-actions-row">
                      <button
                        className="btn-card-play"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectExerciseForStage(ex);
                        }}
                      >
                        ▶ Play Video
                      </button>
                      {ex.rest > 0 && (
                        <button
                          className="btn-card-timer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTimerPreset(ex.rest);
                            setIsTimerRunning(true);
                            setActiveView("timer");
                          }}
                        >
                          ⏱️ {ex.rest}s Timer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sunday Special Message if Sunday Evening */}
          {currentWorkout.evening.isRestDay && (
            <div className="sunday-rest-celebration">
              <span className="rest-icon">🧘</span>
              <h3>Sunday Complete Rest & Neurological Recovery</h3>
              <p>
                Muscle hypertrophy, bone density, and nervous system recovery occur during uninterrupted rest.
                Follow the 7-meal diet schedule, stay hydrated, and prepare mentally for Monday's push session.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          VIEW 2: 7-DAY SCHEDULE MATRIX (FULL BLUEPRINT)
          ============================================================ */}
      {activeView === "weekly-matrix" && (
        <div className="matrix-view-container">
          <div className="matrix-intro-box">
            <h3>7-Day Weekly Training Blueprint (Infographic Grid)</h3>
            <p>
              Two training sessions per day: morning speed-endurance and evening dumbbell splits.
              Click any day column to jump directly into its high-definition video demonstrations.
            </p>
          </div>

          {/* 7-Day Table Exactly as Infographic */}
          <div className="schedule-table-card">
            {/* Header Days Row */}
            <div className="matrix-grid-row header-row">
              {dailyWorkoutsData.map((d) => (
                <div key={d.day} className="matrix-col-header">
                  <strong>{d.day.toUpperCase()}</strong>
                  <span className="matrix-split-tag">{d.evening.split}</span>
                </div>
              ))}
            </div>

            {/* Morning Plan Row */}
            <div className="matrix-grid-row morning-row">
              {dailyWorkoutsData.map((d) => (
                <div
                  key={d.day}
                  className="matrix-cell morning-cell"
                  onClick={() => {
                    setSelectedDayName(d.day);
                    setActiveView("daily");
                  }}
                >
                  <span className="cell-phase-tag">🌅 MORNING</span>
                  <p className="cell-distance">
                    <strong>{d.morning.distance}</strong>
                  </p>
                  <ul className="cell-ex-bullet-list">
                    {d.morning.exercises.map((ex, i) => (
                      <li key={i}>• {ex.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Evening Dumbbell Plan Row */}
            <div className="matrix-grid-row evening-row">
              {dailyWorkoutsData.map((d) => (
                <div
                  key={d.day}
                  className="matrix-cell evening-cell"
                  onClick={() => {
                    setSelectedDayName(d.day);
                    setActiveView("daily");
                  }}
                >
                  <span className="cell-phase-tag">🌆 EVENING</span>
                  <p className="cell-split">
                    <strong>{d.evening.split}</strong>
                  </p>
                  <ul className="cell-ex-bullet-list">
                    {d.evening.exercises.map((ex, i) => (
                      <li key={i}>
                        • {ex.name} <span className="cell-sets">({ex.sets})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Dumbbell Weight Guide, Friday Drills, and Important Tips (Infographic Middle Section) */}
          <div className="infographic-middle-grid">
            {/* 1. Dumbbell Weight Guide (30 kg) */}
            <div className="info-block-card">
              <div className="ibc-header">
                <span className="ibc-icon">🏋️</span>
                <div>
                  <h4>DUMBBELL WEIGHT GUIDE (30 KG)</h4>
                  <span className="ibc-sub">Gradual load progression for clean form</span>
                </div>
              </div>
              <table className="ibc-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Recommended Load</th>
                    <th>Focus & Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {kabaddiPlanOverview.dumbbellWeightGuide.map((g, i) => (
                    <tr key={i}>
                      <td>
                        <strong>{g.level}</strong>
                      </td>
                      <td>
                        <span className="load-badge">{g.weight}</span>
                      </td>
                      <td>{g.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="table-caption-bar">
                ⚡ Use weight according to your strength and increase gradually.
              </div>
            </div>

            {/* 2. Friday Kabaddi Specific Drills */}
            <div className="info-block-card">
              <div className="ibc-header">
                <span className="ibc-icon">⚡</span>
                <div>
                  <h4>KABADDIN SPECIFIC DRILLS (FRIDAY MORNING)</h4>
                  <span className="ibc-sub">Match-specific agility & explosive power</span>
                </div>
              </div>
              <div className="drills-list-stack">
                {kabaddiPlanOverview.kabaddiDrillsFriday.map((dr, idx) => (
                  <div key={idx} className="drill-list-item">
                    <div className="dli-top">
                      <strong className="dli-title">
                        {dr.drill} – <span className="dli-duration">{dr.duration}</span>
                      </strong>
                    </div>
                    <p className="dli-desc">{dr.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Important Tips (6 Items) */}
            <div className="info-block-card tips-card">
              <div className="ibc-header">
                <span className="ibc-icon">🏆</span>
                <div>
                  <h4>IMPORTANT TIPS FOR SUCCESS</h4>
                  <span className="ibc-sub">Non-negotiable athletic performance rules</span>
                </div>
              </div>
              <ul className="tips-checklist">
                {kabaddiPlanOverview.importantTips.map((tip, i) => (
                  <li key={i}>
                    <span className="check-icon">✅</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section: Target Progress, Avoid List, and Keys to Success (Infographic Bottom Section) */}
          <div className="infographic-bottom-grid">
            {/* Target Progress (30 Days) */}
            <div className="bottom-card progress-target-card">
              <h4>⏱️ TARGET PROGRESS (30 DAYS)</h4>
              <table className="target-table">
                <thead>
                  <tr>
                    <th>WEEK</th>
                    <th>FOCUS</th>
                    <th>TARGET IMPROVEMENT</th>
                  </tr>
                </thead>
                <tbody>
                  {kabaddiPlanOverview.targetProgress30Days.map((tp, i) => (
                    <tr key={i}>
                      <td>
                        <strong>{tp.week}</strong>
                      </td>
                      <td>{tp.focus}</td>
                      <td>
                        <span className="pace-badge">{tp.targetRun}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Avoid List */}
            <div className="bottom-card avoid-card">
              <h4>❌ AVOID (STRICT NEGATIVES)</h4>
              <ul className="avoid-list">
                {kabaddiPlanOverview.avoidList.map((item, i) => (
                  <li key={i}>
                    <span className="cross-icon">✖</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key to Success */}
            <div className="bottom-card keys-card">
              <h4>🔑 KEY TO SUCCESS</h4>
              <div className="keys-stack">
                {kabaddiPlanOverview.keysToSuccess.map((k, i) => (
                  <div key={i} className="key-pill">
                    <span className="key-ico">{k.icon}</span>
                    <strong className="key-txt">{k.name}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Banner Tagline */}
          <div className="gold-footer-banner">
            ⭐ DISCIPLINE TODAY • STRONG TOMORROW • SUCCESS FOREVER ⭐
          </div>
        </div>
      )}

      {/* ============================================================
          VIEW 3: ATHLETIC DIET & MEAL PLAN (EXACT 7 MEALS)
          ============================================================ */}
      {activeView === "diet" && (
        <div className="diet-view-container">
          <div className="diet-header-banner">
            <span className="diet-tag">DIET PLAN (EXAMPLE)</span>
            <h3>Nutritional Timing & Athletic Fueling Schedule</h3>
            <p>
              Structured 7-meal schedule tailored to maintain high energy for morning running intervals and fuel muscle hypertrophy during evening dumbbell training.
            </p>
          </div>

          <div className="diet-meals-grid">
            {kabaddiPlanOverview.dietPlan.map((meal) => (
              <div key={meal.step} className="meal-food-card">
                <div className="meal-img-wrapper">
                  <img src={meal.image} alt={meal.name} className="meal-img" loading="lazy" />
                  <span className="meal-step-tag">Step {meal.step}</span>
                  <span className="meal-clock-badge">⏰ {meal.time}</span>
                </div>
                <div className="meal-card-body">
                  <div className="meal-title-row">
                    <span className="meal-emoji-big">{meal.icon}</span>
                    <h4 className="meal-food-title">{meal.name}</h4>
                  </div>
                  <div className="meal-ingredients-box">
                    <strong>Recommended Food:</strong>
                    <p>{meal.items}</p>
                  </div>
                  <p className="meal-benefit-text">{meal.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Key to Success Banner */}
          <div className="gold-footer-banner">
            ⭐ DISCIPLINE TODAY • STRONG TOMORROW • SUCCESS FOREVER ⭐
          </div>
        </div>
      )}

      {/* ============================================================
          VIEW 4: REST INTERVAL TIMER
          ============================================================ */}
      {activeView === "timer" && (
        <div className="timer-view-container">
          <div className="rest-timer-box">
            <div className="timer-header">
              <span className="timer-tag">HIGH INTENSITY INTERVALS</span>
              <h3>⏱️ Athletic Rest Interval Timer</h3>
              <p>Strict rest intervals maximize hypertrophy and restore phosphocreatine reserves.</p>
            </div>

            <div className="timer-circle-wrapper">
              <svg className="timer-svg" viewBox="0 0 100 100">
                <circle className="timer-bg-circle" cx="50" cy="50" r="45" />
                <circle
                  className="timer-progress-circle"
                  cx="50"
                  cy="50"
                  r="45"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * timerProgress) / 100}
                />
              </svg>
              <div className="timer-display-inner">
                <span className="timer-time">{formatTime(timerSeconds)}</span>
                <span className="timer-status">
                  {isTimerRunning
                    ? "Resting & Recovering..."
                    : timerSeconds === 0
                    ? "🔔 TIME'S UP! NEXT SET!"
                    : "Ready to Start"}
                </span>
              </div>
            </div>

            <div className="timer-controls">
              <button
                className={`timer-main-btn ${isTimerRunning ? "pause" : "start"}`}
                onClick={toggleTimer}
              >
                {isTimerRunning ? "Pause Rest" : "Start Rest Timer"}
              </button>
              <button className="timer-reset-btn" onClick={resetTimer}>
                Reset
              </button>
            </div>

            <div className="timer-presets">
              <span className="presets-label">Quick Interval Presets:</span>
              <div className="preset-buttons">
                {[30, 45, 60, 75, 90, 120, 180].map((secs) => (
                  <button
                    key={secs}
                    className={`preset-btn ${initialDuration === secs ? "active" : ""}`}
                    onClick={() => handleTimerPreset(secs)}
                  >
                    {secs >= 60 ? `${secs / 60}m` : `${secs}s`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          EXERCISE TECHNIQUE DEMONSTRATION CINEMA MODAL
          ============================================================ */}
      {modalExercise && (
        <div className="modal-backdrop" onClick={() => setModalExercise(null)}>
          <div className="demo-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setModalExercise(null)}
              title="Close Tutorial"
            >
              ✕
            </button>

            <div className="demo-header">
              <span className="demo-muscle-tag">
                {modalExercise.phase?.toUpperCase()} • {modalExercise.muscle}
              </span>
              <h3>{modalExercise.name}</h3>
              <div className="demo-presc-row">
                <span>🎯 Target: {modalExercise.muscle}</span>
                <span>
                  🔢 Prescription: {modalExercise.sets} × {modalExercise.reps}
                </span>
                {modalExercise.rest > 0 && <span>⏱️ Rest: {modalExercise.rest}s</span>}
              </div>
            </div>

            {/* Video Player */}
            {modalExercise.youtubeId ? (
              <div className="exercise-video-embed-box">
                <div className="video-top-shield" aria-hidden="true" />
                <iframe
                  src={`https://www.youtube.com/embed/${modalExercise.youtubeId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&iv_load_policy=3&showinfo=0`}
                  title={`${modalExercise.name} Tutorial`}
                  className="program-video-iframe"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="no-video-placeholder">
                <img
                  src={modalExercise.thumbnail}
                  alt={modalExercise.name}
                  className="modal-fallback-img"
                />
                <p>⚡ High-intensity movement. Perform with controlled cadence.</p>
              </div>
            )}

            <div className="demo-info-section">
              <div className="info-block success">
                <h5>✅ Form & Biomechanical Cues:</h5>
                <p>{modalExercise.tips}</p>
              </div>

              {modalExercise.mistakes && (
                <div className="info-block warning">
                  <h5>⚠️ Mistakes to Avoid:</h5>
                  <p>{modalExercise.mistakes}</p>
                </div>
              )}
            </div>

            <div className="demo-actions">
              {modalExercise.rest > 0 && (
                <button
                  className="start-rest-action-btn"
                  onClick={() => {
                    handleTimerPreset(modalExercise.rest);
                    setIsTimerRunning(true);
                    setModalExercise(null);
                    setActiveView("timer");
                  }}
                >
                  Start Prescribed Rest ({modalExercise.rest}s) ⏱️
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default WorkoutPrograms;
