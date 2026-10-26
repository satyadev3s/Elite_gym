import React, { useRef, useState, useCallback } from "react";
import "./styles/TiltCard3D.css";

/**
 * High-performance 3D Parallax Tilt Card
 * Features:
 * - Sub-pixel mouse tracking with requestAnimationFrame
 * - Real 3D depth layering (translateZ on child elements)
 * - Dynamic specular light glare sheen
 * - Spring damping reset on mouse leave
 */
const TiltCard3D = ({
  children,
  className = "",
  maxTilt = 12,
  glare = true,
  scale = 1.025,
  onClick,
  style = {},
  ...props
}) => {
  const cardRef = useRef(null);
  const rafRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({
    transform: "perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
  });

  const handleMouseMove = useCallback(
    (e) => {
      const card = cardRef.current;
      if (!card) return;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        // Normalized offsets from -0.5 to +0.5
        const normX = clientX / rect.width - 0.5;
        const normY = clientY / rect.height - 0.5;

        // Calculate rotation angles
        const rotY = +(normX * maxTilt * 2).toFixed(2);
        const rotX = -(normY * maxTilt * 2).toFixed(2);

        // Glare coordinates in percentages
        const glareX = Math.round((clientX / rect.width) * 100);
        const glareY = Math.round((clientY / rect.height) * 100);

        setTiltStyle({
          transform: `perspective(1100px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(${scale}, ${scale}, ${scale})`,
          glareX,
          glareY,
          glareOpacity: 0.18,
          transition: "transform 0.08s ease-out",
        });
      });
    },
    [maxTilt, scale]
  );

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    setTiltStyle({
      transform: "perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
      transition: "transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)",
    });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`tilt-card-3d-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        ...style,
        transform: tiltStyle.transform,
        transition: tiltStyle.transition,
      }}
      {...props}
    >
      <div className="tilt-card-inner">
        {children}

        {glare && (
          <div
            className="tilt-card-glare"
            style={{
              opacity: tiltStyle.glareOpacity,
              background: `radial-gradient(circle at ${tiltStyle.glareX}% ${tiltStyle.glareY}%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.04) 40%, transparent 70%)`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TiltCard3D;
