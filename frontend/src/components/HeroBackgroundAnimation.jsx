import React, { useEffect, useRef } from "react";
import "./styles/HeroBackgroundAnimation.css";

const HeroBackgroundAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    // Mouse tracking for interactive particle reaction
    const mouse = { x: null, y: null, radius: 150 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const parent = canvas.parentElement;
    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);

    // Dynamic particles pool
    const particleCount = Math.min(Math.floor((width * height) / 16000), 75);
    const colors = [
      "rgba(255, 107, 0, ",   // Neon Flame Orange
      "rgba(255, 170, 68, ",  // Warm Amber
      "rgba(255, 75, 43, ",   // Fire Red
      "rgba(16, 185, 129, ",  // Bio-Recovery Emerald
      "rgba(255, 255, 255, "  // White Energy Spark
    ];

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.1,
        vy: -Math.random() * 0.9 - 0.3, // Drifting upwards like workout embers
        radius: Math.random() * 2.6 + 1.2,
        colorBase: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.35,
        pulseSpeed: Math.random() * 0.04 + 0.02,
        pulseVal: Math.random() * Math.PI,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Position update
        p.x += p.vx;
        p.y += p.vy;
        p.pulseVal += p.pulseSpeed;

        // Wrap around boundaries
        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;
        if (p.y < -15) p.y = height + 15;
        if (p.y > height + 15) p.y = -15;

        // Interactive mouse repulsion/reaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius && dist > 0) {
            const force = (1 - dist / mouse.radius) * 2.2;
            p.x -= (dx / dist) * force;
            p.y -= (dy / dist) * force;
          }
        }

        const currentAlpha = p.alpha + Math.sin(p.pulseVal) * 0.25;
        const boundedAlpha = Math.max(0.18, Math.min(currentAlpha, 0.95));

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.colorBase}${boundedAlpha})`;
        ctx.shadowBlur = p.radius * 5;
        ctx.shadowColor = `${p.colorBase}0.85)`;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby particles with luminous lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 125) {
            const lineAlpha = (1 - dist / 125) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 120, 30, ${lineAlpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="hero-animated-bg-container" aria-hidden="true">
      {/* Dynamic Glowing Energy Waves */}
      <div className="bg-glow-wave wave-primary"></div>
      <div className="bg-glow-wave wave-secondary"></div>
      <div className="bg-glow-wave wave-accent"></div>

      {/* Cyberpunk Grid */}
      <div className="bg-grid-cyber"></div>

      {/* Interactive 60fps Energy Canvas */}
      <canvas ref={canvasRef} className="hero-particles-canvas" />

      {/* Luminous Light Sweep Scanline */}
      <div className="bg-scanline-shimmer"></div>
    </div>
  );
};

export default HeroBackgroundAnimation;
