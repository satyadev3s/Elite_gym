import React, { useState } from "react";
import HeroBackgroundAnimation from "./HeroBackgroundAnimation";
import "./styles/FitnessCalculators.css";

const FitnessCalculators = () => {
  const [activeTab, setActiveTab] = useState("bmi"); // bmi | calories | water

  // --- BMI Calculator State ---
  const [bmiUnit, setBmiUnit] = useState("metric"); // metric (kg, cm) | imperial (lbs, in)
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(72);
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(9);
  const [weightLbs, setWeightLbs] = useState(158);

  const calculateBMI = () => {
    let bmiVal = 0;
    if (bmiUnit === "metric") {
      if (height > 0 && weight > 0) {
        const heightMeters = height / 100;
        bmiVal = weight / (heightMeters * heightMeters);
      }
    } else {
      const totalInches = heightFeet * 12 + heightInches;
      if (totalInches > 0 && weightLbs > 0) {
        bmiVal = (weightLbs / (totalInches * totalInches)) * 703;
      }
    }
    return parseFloat(bmiVal.toFixed(1));
  };

  const bmi = calculateBMI();

  const getBmiCategory = (score) => {
    if (score < 18.5) return { label: "Underweight", color: "#38bdf8", advice: "Consider a caloric surplus with nutrient-dense foods to build healthy muscle." };
    if (score < 25) return { label: "Normal (Healthy)", color: "#22c55e", advice: "Excellent! Maintain your balanced nutritional intake and regular physical activity." };
    if (score < 30) return { label: "Overweight", color: "#eab308", advice: "A moderate caloric deficit and structured resistance training will optimize body composition." };
    return { label: "Obese (Class I+)", color: "#ef4444", advice: "Consider consulting a medical professional alongside starting low-impact cardiovascular routines." };
  };

  const bmiCategory = getBmiCategory(bmi);

  // --- Daily Calorie Needs (TDEE / BMR) State ---
  const [calGender, setCalGender] = useState("male");
  const [calAge, setCalAge] = useState(26);
  const [calWeight, setCalWeight] = useState(74); // kg
  const [calHeight, setCalHeight] = useState(178); // cm
  const [activityLevel, setActivityLevel] = useState("moderate"); // sedentary | light | moderate | heavy | athlete
  const [calGoal, setCalGoal] = useState("maintain"); // cut | maintain | bulk

  const calculateTDEE = () => {
    // Mifflin-St Jeor Formula
    let bmr = 10 * calWeight + 6.25 * calHeight - 5 * calAge;
    bmr += calGender === "male" ? 5 : -161;

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      heavy: 1.725,
      athlete: 1.9,
    };

    const tdee = Math.round(bmr * (activityMultipliers[activityLevel] || 1.55));
    let targetCalories = tdee;
    if (calGoal === "cut") targetCalories = Math.round(tdee - 500); // 500 cal deficit
    if (calGoal === "bulk") targetCalories = Math.round(tdee + 400); // 400 cal surplus

    // Macronutrient breakdown (approx: 30% Protein, 40% Carb, 30% Fat)
    const proteinGrams = Math.round((targetCalories * 0.3) / 4);
    const carbGrams = Math.round((targetCalories * 0.4) / 4);
    const fatGrams = Math.round((targetCalories * 0.3) / 9);

    return { bmr: Math.round(bmr), tdee, targetCalories, proteinGrams, carbGrams, fatGrams };
  };

  const tdeeData = calculateTDEE();

  // --- Daily Water Intake State ---
  const [waterWeight, setWaterWeight] = useState(72);
  const [workoutMinutes, setWorkoutMinutes] = useState(45);
  const [glassesLogged, setGlassesLogged] = useState(4); // 250ml per glass

  const calculateRecommendedWater = () => {
    // Standard rule: ~35ml per kg + ~350ml per 30 mins workout
    const baseWater = waterWeight * 35;
    const workoutExtra = (workoutMinutes / 30) * 350;
    const totalMl = Math.round(baseWater + workoutExtra);
    const glasses = Math.round(totalMl / 250);
    return { totalLiters: (totalMl / 1000).toFixed(1), totalMl, targetGlasses: glasses };
  };

  const waterData = calculateRecommendedWater();
  const waterProgress = Math.min(100, Math.round((glassesLogged / waterData.targetGlasses) * 100));


  return (
    <section className="fitness-calculators-section reveal" id="calculators">
      <HeroBackgroundAnimation />
      <div className="section-header">
        <span className="section-tag">Scientific Tools</span>
        <h2 className="section-title">
          Fitness & Body <span>Calculators</span>
        </h2>
        <p className="section-subtitle">
          Calculate your metabolic rate, body mass index, macro allocations, and daily hydration goals.
        </p>


        {/* Calculator Tabs */}
        <div className="calc-tabs">
          <button
            className={`calc-tab-btn ${activeTab === "bmi" ? "active" : ""}`}
            onClick={() => setActiveTab("bmi")}
          >
            ⚖️ BMI Calculator
          </button>
          <button
            className={`calc-tab-btn ${activeTab === "calories" ? "active" : ""}`}
            onClick={() => setActiveTab("calories")}
          >
            🔥 Calorie & TDEE Needs
          </button>
          <button
            className={`calc-tab-btn ${activeTab === "water" ? "active" : ""}`}
            onClick={() => setActiveTab("water")}
          >
            💧 Water Intake Logger
          </button>
        </div>
      </div>

      <div className="calc-card-container">
        {/* TAB 1: BMI CALCULATOR */}
        {activeTab === "bmi" && (
          <div className="calc-body-box">
            <div className="calc-box-header">
              <h3>Body Mass Index (BMI) Benchmark</h3>
              <div className="unit-toggle">
                <button
                  className={`unit-btn ${bmiUnit === "metric" ? "active" : ""}`}
                  onClick={() => setBmiUnit("metric")}
                >
                  Metric (cm / kg)
                </button>
                <button
                  className={`unit-btn ${bmiUnit === "imperial" ? "active" : ""}`}
                  onClick={() => setBmiUnit("imperial")}
                >
                  Imperial (in / lbs)
                </button>
              </div>
            </div>

            <div className="calc-grid-layout">
              <div className="inputs-col">
                {bmiUnit === "metric" ? (
                  <>
                    <div className="input-field">
                      <div className="label-row">
                        <label>Height (cm)</label>
                        <span className="slider-val">{height} cm</span>
                      </div>
                      <input
                        type="range"
                        min="120"
                        max="220"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                      />
                    </div>

                    <div className="input-field">
                      <div className="label-row">
                        <label>Weight (kg)</label>
                        <span className="slider-val">{weight} kg</span>
                      </div>
                      <input
                        type="range"
                        min="40"
                        max="160"
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="input-field">
                      <div className="label-row">
                        <label>Height (Feet & Inches)</label>
                        <span className="slider-val">{heightFeet}' {heightInches}"</span>
                      </div>
                      <div className="dual-slider">
                        <input
                          type="range"
                          min="4"
                          max="7"
                          value={heightFeet}
                          onChange={(e) => setHeightFeet(Number(e.target.value))}
                        />
                        <input
                          type="range"
                          min="0"
                          max="11"
                          value={heightInches}
                          onChange={(e) => setHeightInches(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="input-field">
                      <div className="label-row">
                        <label>Weight (lbs)</label>
                        <span className="slider-val">{weightLbs} lbs</span>
                      </div>
                      <input
                        type="range"
                        min="80"
                        max="350"
                        value={weightLbs}
                        onChange={(e) => setWeightLbs(Number(e.target.value))}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* BMI Output Card */}
              <div className="result-col">
                <div className="bmi-display-circle" style={{ borderColor: bmiCategory.color }}>
                  <span className="score-label">Your BMI</span>
                  <span className="score-num" style={{ color: bmiCategory.color }}>
                    {bmi}
                  </span>
                  <span className="cat-pill" style={{ background: bmiCategory.color }}>
                    {bmiCategory.label}
                  </span>
                </div>

                <div className="bmi-ranges-bar">
                  <div className="range-seg blue" title="Underweight (&lt; 18.5)"></div>
                  <div className="range-seg green" title="Normal (18.5 - 24.9)"></div>
                  <div className="range-seg yellow" title="Overweight (25 - 29.9)"></div>
                  <div className="range-seg red" title="Obese (30+)"></div>
                </div>

                <p className="bmi-advice-text">{bmiCategory.advice}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CALORIE & TDEE ESTIMATOR */}
        {activeTab === "calories" && (
          <div className="calc-body-box">
            <div className="calc-box-header">
              <h3>Daily Energy Expenditure & Macronutrient Target</h3>
              <p>Mifflin-St Jeor equation customized to your body metrics and lifestyle.</p>
            </div>

            <div className="calc-grid-layout">
              <div className="inputs-col">
                <div className="form-row-2">
                  <div className="input-field">
                    <label>Biological Gender</label>
                    <div className="pill-toggle">
                      <button
                        className={`pill-btn ${calGender === "male" ? "active" : ""}`}
                        onClick={() => setCalGender("male")}
                      >
                        Male
                      </button>
                      <button
                        className={`pill-btn ${calGender === "female" ? "active" : ""}`}
                        onClick={() => setCalGender("female")}
                      >
                        Female
                      </button>
                    </div>
                  </div>

                  <div className="input-field">
                    <label>Age: {calAge} yrs</label>
                    <input
                      type="range"
                      min="15"
                      max="80"
                      value={calAge}
                      onChange={(e) => setCalAge(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="input-field">
                    <label>Weight: {calWeight} kg</label>
                    <input
                      type="range"
                      min="40"
                      max="150"
                      value={calWeight}
                      onChange={(e) => setCalWeight(Number(e.target.value))}
                    />
                  </div>

                  <div className="input-field">
                    <label>Height: {calHeight} cm</label>
                    <input
                      type="range"
                      min="130"
                      max="210"
                      value={calHeight}
                      onChange={(e) => setCalHeight(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="input-field">
                  <label>Activity Level</label>
                  <select
                    className="calc-select"
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                  >
                    <option value="sedentary">Sedentary (Desk Job, Little to No Exercise)</option>
                    <option value="light">Lightly Active (1-3 days gym / week)</option>
                    <option value="moderate">Moderately Active (3-5 days resistance / cardio)</option>
                    <option value="heavy">Very Active (6-7 days intense training)</option>
                    <option value="athlete">Elite Athlete / Physical Labor Twice Daily</option>
                  </select>
                </div>

                <div className="input-field">
                  <label>Primary Goal</label>
                  <div className="goal-pills">
                    <button
                      className={`goal-btn ${calGoal === "cut" ? "active" : ""}`}
                      onClick={() => setCalGoal("cut")}
                    >
                      🔥 Fat Shred (-500 kcal)
                    </button>
                    <button
                      className={`goal-btn ${calGoal === "maintain" ? "active" : ""}`}
                      onClick={() => setCalGoal("maintain")}
                    >
                      ⚖️ Maintain Weight
                    </button>
                    <button
                      className={`goal-btn ${calGoal === "bulk" ? "active" : ""}`}
                      onClick={() => setCalGoal("bulk")}
                    >
                      💪 Lean Bulk (+400 kcal)
                    </button>
                  </div>
                </div>
              </div>

              {/* TDEE & Macro Breakdown Results */}
              <div className="result-col">
                <div className="tdee-card">
                  <div className="target-calories-box">
                    <span className="cal-sub">Target Daily Caloric Intake</span>
                    <span className="cal-large-num">{tdeeData.targetCalories}</span>
                    <span className="cal-unit">kcal / day</span>
                  </div>

                  <div className="energy-split-info">
                    <div className="split-item">
                      <span className="split-label">Basal Metabolic (BMR):</span>
                      <span className="split-val">{tdeeData.bmr} kcal</span>
                    </div>
                    <div className="split-item">
                      <span className="split-label">Maintenance (TDEE):</span>
                      <span className="split-val">{tdeeData.tdee} kcal</span>
                    </div>
                  </div>

                  <div className="macro-breakdown-grid">
                    <div className="macro-card protein">
                      <span className="m-label">Protein (30%)</span>
                      <span className="m-val">{tdeeData.proteinGrams}g</span>
                      <span className="m-cal">{tdeeData.proteinGrams * 4} kcal</span>
                    </div>
                    <div className="macro-card carbs">
                      <span className="m-label">Carbs (40%)</span>
                      <span className="m-val">{tdeeData.carbGrams}g</span>
                      <span className="m-cal">{tdeeData.carbGrams * 4} kcal</span>
                    </div>
                    <div className="macro-card fats">
                      <span className="m-label">Fats (30%)</span>
                      <span className="m-val">{tdeeData.fatGrams}g</span>
                      <span className="m-cal">{tdeeData.fatGrams * 9} kcal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WATER INTAKE REMINDER */}
        {activeTab === "water" && (
          <div className="calc-body-box">
            <div className="calc-box-header">
              <h3>Personalized Hydration Goal & Daily Logger</h3>
              <p>Maintains cellular hydration, joint lubrication, and peak muscular contraction capacity.</p>
            </div>

            <div className="calc-grid-layout">
              <div className="inputs-col">
                <div className="input-field">
                  <div className="label-row">
                    <label>Body Weight: {waterWeight} kg</label>
                  </div>
                  <input
                    type="range"
                    min="45"
                    max="140"
                    value={waterWeight}
                    onChange={(e) => setWaterWeight(Number(e.target.value))}
                  />
                </div>

                <div className="input-field">
                  <div className="label-row">
                    <label>Workout Duration: {workoutMinutes} mins</label>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    step="15"
                    value={workoutMinutes}
                    onChange={(e) => setWorkoutMinutes(Number(e.target.value))}
                  />
                </div>

                <div className="hydration-tip-box">
                  💡 <strong>Coach Tip:</strong> Drink 500ml upon waking, sip 200ml every 15-20 minutes of training, and monitor urine color (pale straw indicates optimal hydration).
                </div>
              </div>

              {/* Water Progress Ring and Glass Logger */}
              <div className="result-col">
                <div className="water-card">
                  <div className="water-header">
                    <h4>Daily Hydration Status</h4>
                    <span className="water-rec-tag">Recommended: {waterData.totalLiters}L ({waterData.targetGlasses} glasses)</span>
                  </div>

                  <div className="water-meter">
                    <div className="water-level-bar" style={{ width: `${waterProgress}%` }}></div>
                    <span className="water-pct">{waterProgress}% Logged</span>
                  </div>

                  <div className="glasses-control">
                    <div className="glasses-count">
                      <span>Logged Today: <strong>{glassesLogged * 250} ml</strong> ({glassesLogged} glasses)</span>
                    </div>
                    <div className="glass-buttons">
                      <button
                        className="glass-action-btn minus"
                        disabled={glassesLogged <= 0}
                        onClick={() => setGlassesLogged((prev) => Math.max(0, prev - 1))}
                      >
                        - 1 Glass
                      </button>
                      <button
                        className="glass-action-btn plus"
                        onClick={() => setGlassesLogged((prev) => prev + 1)}
                      >
                        + Drink Glass (250ml) 💧
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default FitnessCalculators;
