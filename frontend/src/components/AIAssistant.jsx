import React, { useState, useRef, useEffect } from "react";
import "./styles/AIAssistant.css";
const getAssistantTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hello! I am your **IronFit AI Coach**. I can generate custom workout routines, guide exercise biomechanics, optimize your weekly training splits, and offer nutritional tips with proper safety guidance.\n\nHow can I help power your training today?",
      time: "Just now",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatMessagesEndRef = useRef(null);

  const samplePrompts = [
    "Give me a beginner chest workout",
    "How should I structure my weekly training?",
    "What should I eat before morning workouts?",
    "How to prevent knee pain during squats?",
    "Quick 20-min dumbbell fat-burn routine",
  ];

  const scrollToBottom = () => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Intelligent Fitness Knowledge Base & Generator
  const generateFitnessResponse = (query) => {
    const q = query.toLowerCase();

    if (q.includes("chest") && (q.includes("beginner") || q.includes("workout"))) {
      return `### 🏋️ Beginner Chest Hypertrophy Routine
Here is a safe, joint-friendly chest workout designed to build pressing strength and pectoralis fiber recruitment without overloading the anterior deltoids:

1. **Dumbbell Flat Bench Press**
   - **Sets / Reps:** 3 Sets × 10–12 Reps
   - **Rest:** 60 seconds
   - **Form Cue:** Keep dumbbells angled at 45° to protect rotator cuffs. Squeeze your pecs firmly at the top.

2. **Incline Push-Ups (Hands on a Bench)**
   - **Sets / Reps:** 3 Sets × 10–12 Reps
   - **Rest:** 45 seconds
   - **Form Cue:** Maintain a rigid core plank. Do not allow your lower back to sag.

3. **Standing Cable / Resistance Band Chest Flyes**
   - **Sets / Reps:** 3 Sets × 12–15 Reps
   - **Rest:** 45 seconds
   - **Form Cue:** Soft bend in elbows, imagine hugging a large barrel. Focus on the stretch.

4. **Kneeling Diamond Push-Ups**
   - **Sets / Reps:** 2 Sets × As Many Reps As Possible (AMRAP)
   - **Rest:** 60 seconds
   - **Form Cue:** Targets inner chest and tricep extension.

⚠️ **Safety & Warm-up Guidance:** Spend 5 minutes on light dynamic arm circles, band pull-aparts, and warm-up pushups. If you experience sharp joint pain in your front shoulder, reduce weight immediately.`;
    }

    if (q.includes("weekly") || q.includes("structure") || q.includes("split") || q.includes("routine")) {
      return `### 📅 How to Structure Your Weekly Training Split
The optimal weekly structure balances muscular stimulus with 48 hours of recovery per muscle group:

#### 1. For 3 Days / Week (Best for Beginners):
- **Monday:** Full Body A (Squat, Bench Press, Lat Pulldown, Core)
- **Wednesday:** Full Body B (Deadlift variation, Overhead Press, Cable Row, Lunges)
- **Friday:** Full Body C (Leg Press, Incline DB Press, Chin-ups, Arms)
- **Tue / Thu / Sat / Sun:** Active recovery, walking (8,000–10,000 steps), mobility.

#### 2. For 4 Days / Week (Upper / Lower Split):
- **Monday:** Upper Body Strength (Heavy compound presses & pulls)
- **Tuesday:** Lower Body & Core (Squats, RDLs, Calves)
- **Wednesday:** Rest / Cardio & Sauna
- **Thursday:** Upper Body Hypertrophy (Higher rep volume, accessories)
- **Friday:** Lower Body Hypertrophy (Lunges, Leg curls, Hamstrings)
- **Weekend:** Complete rest & meal preparation.

#### 3. For 5–6 Days / Week (Push / Pull / Legs Split):
- **Mon/Thu:** Push (Chest, Shoulders, Triceps)
- **Tue/Fri:** Pull (Back, Rear Delts, Biceps)
- **Wed/Sat:** Legs & Abs (Quads, Glutes, Hamstrings)
- **Sunday:** Complete Rest.

⚠️ **Safety Note:** Always schedule at least 1–2 complete rest days per week to prevent overtraining syndrome, tendonitis, and central nervous system fatigue.`;
    }

    if (q.includes("eat") || q.includes("diet") || q.includes("nutrition") || q.includes("morning")) {
      return `### 🍳 Pre-Workout & Morning Fuel Guidelines
Fueling before morning training depends on whether you have 30 minutes or 2 hours prior to lifting:

- **If working out in 30–45 mins:**
  - Fast-digesting carbohydrates with minimal fat and fiber (to avoid gastrointestinal cramps).
  - *Examples:* 1 Banana with 1 tsp honey, 1 slice sourdough with jam, or a small rice cake.
  - 300–400ml water + pinch of pink Himalayan salt for electrolytes.

- **If working out in 90–120 mins:**
  - Balanced meal containing complex carbohydrates and lean protein.
  - *Examples:* Oatmeal with whey protein and berries, or 2 boiled eggs with whole-grain toast.

- **Post-Workout Recovery (Within 90 mins):**
  - Aim for 25–35g high-quality protein (whey isolate, eggs, chicken breast, or tofu) plus 40–50g carbohydrates to replenish glycogen stores.

⚠️ **Hydration Reminder:** Start sipping water immediately upon waking. Dehydration of just 2% reduces muscle force output by up to 15%.`;
    }

    if (q.includes("knee") || q.includes("squat") || q.includes("pain") || q.includes("form")) {
      return `### 🦵 How to Prevent Knee Pain During Squats
Knee discomfort during squats is most frequently caused by poor hip mobility, ankle stiffness, or improper knee path:

1. **Check Knee Tracking:** Ensure your knees track in the exact same direction as your toes (approx. 15–30° outward angle). Never let knees collapse inward (*valgus collapse*).
2. **Sit Back into the Hips First:** Initiate the descent by hinging your hips back as if sitting into an office chair, rather than shoving knees forward first.
3. **Elevate Your Heels:** If ankle mobility is restricted, place a 2.5kg plate under your heels or use Olympic lifting shoes to relieve patellar tendon pressure.
4. **Warm-Up the Quadriceps & Glute Medius:** Perform 2 sets of glute bridges and light backward walking lunges prior to loaded squats.

⚠️ **Medical Advisory:** Mild muscular fatigue is normal, but sharp, pinching, or swelling sensations in the patellar tendon require cessation of squats. Switch to Spanish Squats or Glute Bridges and consult a licensed physical therapist.`;
    }

    if (q.includes("20-min") || q.includes("quick") || q.includes("fat-burn") || q.includes("hiit")) {
      return `### ⚡ High-Intensity 20-Minute Dumbbell Shred Circuit
Perform each exercise for **40 seconds of work**, followed by **20 seconds of rest**. Complete 4 total rounds (20 mins total):

1. **Dumbbell Thrusters (Squat to Overhead Press)** — 40s work
2. **Alternating Renegade Rows in Plank** — 40s work
3. **Kettlebell or Dumbbell Swings** — 40s work
4. **Bodyweight Mountain Climbers with Knee Drive** — 40s work
5. **Full Rest & Hydration Interval** — 60s rest

*Estimated Calorie Burn: 220–280 kcal + Elevated 24-hr metabolic afterburn (EPOC).*

⚠️ **Safety Rule:** Quality of movement always trumps speed. If your lower back rounds during thrusters or swings, drop weight and use bodyweight.`;
    }

    // Default intelligent response
    return `### 💡 Coach Advice for: "${query}"

Here is a recommended approach tailored to your fitness journey:

- **Core Movement Principles:** Focus on compound multi-joint exercises (Squats, Presses, Rows, Hinges). These burn the most calories and build dense functional tissue.
- **Progressive Overload:** Always aim to add 1 rep or small increment of load every 1–2 weeks while preserving strict form.
- **Recovery:** Muscle growth occurs during sleep and recovery, not in the gym. Prioritize 7–9 hours of sleep and adequate protein intake (1.6g–2.2g per kg of bodyweight).

Would you like me to generate a tailored routine for a specific body part, or adjust a program for your current fitness level?

⚠️ *IronFit Medical Disclaimer: All AI recommendations are educational suggestions. Please adjust weights and movements based on your individual physical tolerance.*`;
  };

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg = {
      sender: "user",
      text,
      time: getAssistantTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking & reply
    setTimeout(() => {
      const responseText = generateFitnessResponse(text);
      const aiMsg = {
        sender: "ai",
        text: responseText,
        time: getAssistantTime(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  };

  const formatMarkdown = (content) => {
    // Simple parser for headers, bold, bullets
    return content.split("\n").map((line, idx) => {
      if (line.startsWith("### ")) {
        return <h4 key={idx} className="ai-heading">{line.replace("### ", "")}</h4>;
      }
      if (line.startsWith("#### ")) {
        return <h5 key={idx} className="ai-subheading">{line.replace("#### ", "")}</h5>;
      }
      if (line.startsWith("⚠️ ")) {
        return (
          <div key={idx} className="ai-safety-warning">
            {line}
          </div>
        );
      }
      if (line.startsWith("- ")) {
        return <li key={idx} className="ai-list-item">{parseBold(line.replace("- ", ""))}</li>;
      }
      if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ") || line.startsWith("4. ") || line.startsWith("5. ")) {
        return <div key={idx} className="ai-numbered-item">{parseBold(line)}</div>;
      }
      if (line.trim() === "") {
        return <div key={idx} className="ai-spacer"></div>;
      }
      return <p key={idx} className="ai-para">{parseBold(line)}</p>;
    });
  };

  const parseBold = (str) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="ai-assistant-wrapper">
      {/* Floating Toggle Button */}
      <button
        className={`ai-fab-btn ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open AI Fitness Coach"
      >
        <div className="fab-pulse-ring"></div>
        <span className="fab-icon">{isOpen ? "✕" : "🤖"}</span>
        <span className="fab-text">Ask AI Coach</span>
      </button>

      {/* Chat Window Drawer */}
      {isOpen && (
        <div className="ai-chat-window">
          {/* Chat Header */}
          <div className="ai-chat-header">
            <div className="ai-header-left">
              <div className="ai-avatar">🤖</div>
              <div>
                <h4>IronFit AI Coach</h4>
                <span className="ai-status">● Live Smart Assistant</span>
              </div>
            </div>
            <button className="chat-minimize-btn" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          {/* Quick Prompts Chips */}
          <div className="quick-prompts-scroller">
            {samplePrompts.map((prompt, i) => (
              <button
                key={i}
                className="prompt-chip"
                onClick={() => handleSendMessage(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="ai-messages-container">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-bubble-row ${msg.sender === "user" ? "user-row" : "ai-row"}`}
              >
                {msg.sender === "ai" && <div className="bubble-avatar">🤖</div>}
                <div className={`chat-bubble ${msg.sender}`}>
                  <div className="bubble-content">{formatMarkdown(msg.text)}</div>
                  <span className="bubble-timestamp">{msg.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble-row ai-row">
                <div className="bubble-avatar">🤖</div>
                <div className="chat-bubble ai typing">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatMessagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            className="ai-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              type="text"
              placeholder="Ask for a workout, exercise form, or advice..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              type="submit"
              className="send-message-btn"
              disabled={!inputValue.trim()}
            >
              ➔
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
