import React from "react";
import "./styles/VideoModal.css";

const VideoModal = ({ exercise, onClose, onStartRest }) => {
  if (!exercise) return null;

  const youtubeSrc = exercise.youtubeId
    ? `https://www.youtube.com/embed/${exercise.youtubeId}?autoplay=1&mute=0&rel=0&controls=1&modestbranding=1&iv_load_policy=3&showinfo=0`
    : null;

  return (
    <div className="video-modal-backdrop" onClick={onClose}>
      <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="video-modal-header">
          <div className="vm-header-left">
            <span className="vm-category-pill">{exercise.type || "Technique Masterclass"}</span>
            <span className="vm-target-pill">Target: {exercise.target || exercise.muscle}</span>
          </div>
          <button className="vm-close-btn" onClick={onClose} aria-label="Close video player">
            ✕
          </button>
        </div>

        {/* Real Online Match Video Player */}
        <div className="vm-player-wrapper">
          <div className="video-top-shield" aria-hidden="true" />
          {youtubeSrc ? (
            <iframe
              className="vm-iframe"
              src={youtubeSrc}
              title={`${exercise.title || exercise.name} Demonstration`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="vm-placeholder">
              <p>Exercise demonstration video loading...</p>
            </div>
          )}
        </div>

        {/* Exercise Metadata & Form Checklist */}
        <div className="vm-details-body">
          <div className="vm-title-row">
            <div>
              <h3>{exercise.title || exercise.name}</h3>
              <p className="vm-prescription">
                Recommended Volume: <strong>{exercise.prescription || `${exercise.sets} Sets × ${exercise.reps}`}</strong>
              </p>
            </div>
            {exercise.rest && (
              <button
                className="vm-rest-btn"
                onClick={() => {
                  if (onStartRest) onStartRest(exercise.rest);
                  onClose();
                }}
              >
                ⏱️ Start {exercise.rest}s Rest Timer
              </button>
            )}
          </div>

          <div className="vm-cues-grid">
            <div className="vm-cue-box positive">
              <h5>💡 Elite Form & Execution Points:</h5>
              <ul>
                {exercise.cues ? (
                  exercise.cues.map((cue, i) => <li key={i}>✓ {cue}</li>)
                ) : (
                  <li>✓ {exercise.tips || "Maintain full range of motion with strict control."}</li>
                )}
              </ul>
            </div>

            {(exercise.mistakes || exercise.commonMistakes) && (
              <div className="vm-cue-box negative">
                <h5>⚠️ Common Mistakes to Avoid:</h5>
                <p>{exercise.mistakes || exercise.commonMistakes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
