import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import TiltCard3D from "./TiltCard3D";
import "./styles/ThreeMemberHUD.css";

const ThreeMemberHUD = ({ user, onNavigate }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 540;

    // 1. Three.js Scene, Camera, and Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070d, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 9.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    container.appendChild(renderer.domElement);

    // 2. Cinematic Lighting for Cast Iron & Steel Equipment
    const ambientLight = new THREE.AmbientLight(0x0a101d, 1.8);
    scene.add(ambientLight);

    // Top Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(5, 7, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Electric Orange Rim Light
    const orangeRimLight = new THREE.PointLight(0xff5500, 6.0, 25);
    orangeRimLight.position.set(-7, -2, 4);
    scene.add(orangeRimLight);

    // Cool Titanium Fill Light
    const titaniumFillLight = new THREE.PointLight(0x38bdf8, 3.0, 25);
    titaniumFillLight.position.set(7, 3, -3);
    scene.add(titaniumFillLight);

    // 3. Realistic 3D Cast Iron Hex Dumbbell Assembly
    const dumbbellGroup = new THREE.Group();

    // Materials
    const knurledSteelMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.2,
    });

    const castIronMat = new THREE.MeshStandardMaterial({
      color: 0x121722,
      metalness: 0.65,
      roughness: 0.38,
    });

    const orangeBevelMat = new THREE.MeshStandardMaterial({
      color: 0xff5500,
      emissive: 0xff3300,
      emissiveIntensity: 0.4,
      metalness: 0.8,
      roughness: 0.25,
    });

    // Central Knurled Grip Handle
    const handleGeo = new THREE.CylinderGeometry(0.18, 0.22, 3.4, 32);
    const handleMesh = new THREE.Mesh(handleGeo, knurledSteelMat);
    handleMesh.rotation.z = Math.PI / 2;
    handleMesh.castShadow = true;
    dumbbellGroup.add(handleMesh);

    // Handle Collar Rings
    [-1.7, 1.7].forEach((pos) => {
      const collarGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.16, 32);
      const collarMesh = new THREE.Mesh(collarGeo, orangeBevelMat);
      collarMesh.rotation.z = Math.PI / 2;
      collarMesh.position.x = pos;
      collarMesh.castShadow = true;
      dumbbellGroup.add(collarMesh);
    });

    // Heavy 6-Sided Faceted Hex Heads
    const hexWidth = 1.15;
    const hexRadius = 1.35;

    const buildHexHead = (posX, isRight) => {
      const headGroup = new THREE.Group();
      headGroup.position.x = posX;

      // Main hexagonal body
      const hexGeo = new THREE.CylinderGeometry(hexRadius, hexRadius, hexWidth, 6);
      const hexMesh = new THREE.Mesh(hexGeo, castIronMat);
      hexMesh.rotation.z = Math.PI / 2;
      hexMesh.castShadow = true;
      hexMesh.receiveShadow = true;
      headGroup.add(hexMesh);

      // Outer chamfered / beveled cap
      const bevelGeo = new THREE.CylinderGeometry(hexRadius * 0.86, hexRadius, 0.32, 6);
      const bevelMesh = new THREE.Mesh(bevelGeo, castIronMat);
      bevelMesh.rotation.z = Math.PI / 2;
      bevelMesh.position.x = isRight ? 0.68 : -0.68;
      bevelMesh.castShadow = true;
      headGroup.add(bevelMesh);

      // Inner transition taper
      const taperGeo = new THREE.CylinderGeometry(hexRadius, 0.5, 0.3, 6);
      const taperMesh = new THREE.Mesh(taperGeo, castIronMat);
      taperMesh.rotation.z = Math.PI / 2;
      taperMesh.position.x = isRight ? -0.65 : 0.65;
      headGroup.add(taperMesh);

      // Stamped Face Ring with Neon Accent
      const faceRingGeo = new THREE.CylinderGeometry(0.65, 0.65, 0.06, 6);
      const faceRingMesh = new THREE.Mesh(faceRingGeo, orangeBevelMat);
      faceRingMesh.rotation.z = Math.PI / 2;
      faceRingMesh.position.x = isRight ? 0.86 : -0.86;
      headGroup.add(faceRingMesh);

      return headGroup;
    };

    const leftHead = buildHexHead(-2.45, false);
    const rightHead = buildHexHead(2.45, true);
    dumbbellGroup.add(leftHead);
    dumbbellGroup.add(rightHead);

    // Initial position & angle
    dumbbellGroup.position.set(3.2, 0.3, 0);
    dumbbellGroup.rotation.set(0.35, 0.45, -0.25);
    scene.add(dumbbellGroup);

    // 4. Secondary Background 3D Olympic Weight Plate
    const plateGroup = new THREE.Group();
    const plateRimGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.35, 36);
    const plateRimMesh = new THREE.Mesh(plateRimGeo, castIronMat);
    plateRimMesh.rotation.x = Math.PI / 2;
    plateGroup.add(plateRimMesh);

    const plateAccentGeo = new THREE.TorusGeometry(1.6, 0.08, 16, 36);
    const plateAccentMesh = new THREE.Mesh(plateAccentGeo, orangeBevelMat);
    plateGroup.add(plateAccentMesh);

    const plateHubGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 32);
    const plateHubMesh = new THREE.Mesh(plateHubGeo, knurledSteelMat);
    plateHubMesh.rotation.x = Math.PI / 2;
    plateGroup.add(plateHubMesh);

    plateGroup.position.set(-4.5, -0.6, -3.5);
    plateGroup.rotation.set(0.6, -0.4, 0.2);
    scene.add(plateGroup);

    // 5. Ambient 3D Golden/Amber Floating Embers
    const particleCount = 850;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pSpeed = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 22;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 16;
      pSpeed[i] = 0.003 + Math.random() * 0.008;
    }

    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));

    const pMat = new THREE.PointsMaterial({
      color: 0xff7700,
      size: 0.075,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // 6. Interactive Mouse Tracking & Animation Loop
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startTime) / 1000;

      // Smooth camera parallax
      targetX = mouseX * 1.2;
      targetY = mouseY * 0.8;
      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.y += (targetY + 0.5 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Smooth floating dumbbell rotation
      dumbbellGroup.rotation.y = 0.45 + Math.sin(elapsed * 0.4) * 0.35 + mouseX * 0.3;
      dumbbellGroup.rotation.x = 0.35 + Math.cos(elapsed * 0.3) * 0.25 - mouseY * 0.2;
      dumbbellGroup.rotation.z = -0.25 + Math.sin(elapsed * 0.5) * 0.15;
      dumbbellGroup.position.y = 0.3 + Math.sin(elapsed * 0.9) * 0.18;

      // Background plate slow orbit
      plateGroup.rotation.z += 0.004;
      plateGroup.rotation.y = -0.4 + Math.sin(elapsed * 0.3) * 0.2;
      plateGroup.position.y = -0.6 + Math.cos(elapsed * 0.7) * 0.15;

      // Particle floating drift
      const positions = pGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += pSpeed[i];
        if (positions[i * 3 + 1] > 8) {
          positions[i * 3 + 1] = -8;
          positions[i * 3] = (Math.random() - 0.5) * 22;
        }
      }
      pGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Responsive Resizing
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 540;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const handleNav = (tabId, e) => {
    if (onNavigate) {
      if (e) e.preventDefault();
      onNavigate(tabId);
    }
  };

  return (
    <section className="three-member-hud-wrapper" id="member-hero">
      {/* Three.js 3D Moving Dumbbell Canvas Background */}
      <div ref={mountRef} className="three-member-canvas-bg" />

      {/* Atmospheric Radial Gradients and Architectural Mesh Overlay */}
      <div className="member-hero-backdrop-overlay" />
      <div className="hud-ambient-radar" />

      {/* Member Portal Content (Foreground) */}
      <div className="hud-content-container">
        {/* Top Athlete Profile Bar */}
        <div className="hud-top-command-bar">
          <div className="hud-athlete-profile">
            <div className="hud-avatar-frame">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="hud-avatar-img" />
              ) : (
                <div className="hud-avatar-fallback">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
              )}
              <div className="hud-live-ring" />
            </div>

            <div className="hud-athlete-details">
              <div className="hud-meta-row">
                <span className="hud-tier-pill">{user?.tierBadge || "PRO ATHLETE // TIER 1"}</span>
                <span className="hud-id-tag">ID: {user?.memberId || "IF-839214"}</span>
                <span className="hud-status-badge">● ACTIVE SESSION</span>
              </div>
              <h1 className="hud-athlete-name">
                WELCOME BACK, <span>{user?.name ? user.name.toUpperCase() : "ATHLETE"}</span>
              </h1>
              <p className="hud-objective-text">
                PRIMARY OBJECTIVE: <strong>{user?.goal || "Hypertrophy & Olympic Power"}</strong>
              </p>
            </div>
          </div>

          {/* Quick Launchers */}
          <div className="hud-command-launchers">
            <button
              type="button"
              className="hud-cmd-btn primary"
              onClick={(e) => handleNav("musclemap", e)}
            >
              <span>🧬 LAUNCH 3D MUSCLEMAP</span>
            </button>
            <button
              type="button"
              className="hud-cmd-btn secondary"
              onClick={(e) => handleNav("programs", e)}
            >
              <span>🏋️ WORKOUT PROGRAMS</span>
            </button>
          </div>
        </div>

        {/* 4 Precision Telemetry Cards Grid (Full-Width Clean Architecture) */}
        <div className="member-telemetry-full-grid">
          {/* Card 1: CNS Recovery Readiness */}
          <TiltCard3D className="telemetry-card-tilt" maxTilt={8} scale={1.02}>
            <div className="telemetry-card card-readiness">
              <div className="t-card-header pop-3d-sm">
                <span className="t-card-kicker">CNS RECOVERY READINESS</span>
                <span className="t-card-status optimal">94% OPTIMAL</span>
              </div>
              <div className="t-card-body pop-3d-md">
                <div className="readiness-stat-box">
                  <span className="readiness-big-num">94</span>
                  <span className="readiness-unit">%</span>
                </div>
                <div className="readiness-info">
                  <strong>HRV HIGH • PEAK POWER READY</strong>
                  <p>Neuromuscular fatigue dissipated. Cleared for maximal effort compound lifts.</p>
                </div>
              </div>
              <div className="t-card-progress-track pop-3d-sm">
                <div className="t-card-progress-fill readiness-fill" style={{ width: "94%" }} />
              </div>
            </div>
          </TiltCard3D>

          {/* Card 2: Periodization Split */}
          <TiltCard3D className="telemetry-card-tilt" maxTilt={8} scale={1.02}>
            <div className="telemetry-card card-split">
              <div className="t-card-header pop-3d-sm">
                <span className="t-card-kicker">TRAINING PERIODIZATION</span>
                <span className="t-card-status calibrated">WEEK 03 // DAY 14</span>
              </div>
              <div className="t-card-body pop-3d-md">
                <div className="split-focus-details">
                  <h4 className="split-name">Olympic Pull & Hypertrophy Split</h4>
                  <p className="split-cues">Primary: Heavy Hex Dumbbell Press, Barbell Clean Pulls, Weighted Dips.</p>
                </div>
              </div>
              <div className="t-card-footer-row pop-3d-sm">
                <span className="t-footer-chip">4 SETS / 8-10 REPS</span>
                <button
                  type="button"
                  className="t-card-action-link"
                  onClick={(e) => handleNav("programs", e)}
                >
                  START WORKOUT ➔
                </button>
              </div>
            </div>
          </TiltCard3D>

          {/* Card 3: Weekly Volume Load */}
          <TiltCard3D className="telemetry-card-tilt" maxTilt={8} scale={1.02}>
            <div className="telemetry-card card-volume">
              <div className="t-card-header pop-3d-sm">
                <span className="t-card-kicker">CUMULATIVE TONNAGE</span>
                <span className="t-card-status on-track">84% TO GOAL</span>
              </div>
              <div className="t-card-body pop-3d-md">
                <div className="volume-metric-row">
                  <span className="volume-val">18,450</span>
                  <span className="volume-unit">KG LIFTED THIS WEEK</span>
                </div>
                <p className="volume-desc">+2,400 kg progressive overload achieved versus previous cycle.</p>
              </div>
              <div className="t-card-progress-track pop-3d-sm">
                <div className="t-card-progress-fill volume-fill" style={{ width: "84%" }} />
              </div>
            </div>
          </TiltCard3D>

          {/* Card 4: Upcoming Arena Class */}
          <TiltCard3D className="telemetry-card-tilt" maxTilt={8} scale={1.02}>
            <div className="telemetry-card card-arena">
              <div className="t-card-header pop-3d-sm">
                <span className="t-card-kicker">ARENA RESERVATION</span>
                <span className="t-card-status reserved">CONFIRMED SLOT</span>
              </div>
              <div className="t-card-body pop-3d-md">
                <div className="class-booking-summary">
                  <span className="class-time-badge">TODAY @ 18:30 IST</span>
                  <h4 className="class-title">Olympic Lifting Masterclass (Eleiko Platform)</h4>
                  <span className="class-coach">Coach: Vikramaditya V. // Lead Strength Biomechanist</span>
                </div>
              </div>
              <div className="t-card-footer-row pop-3d-sm">
                <span className="t-footer-chip">SLOT #04 // OAK PLATFORM</span>
                <button
                  type="button"
                  className="t-card-action-link"
                  onClick={(e) => handleNav("classes", e)}
                >
                  VIEW ALL SLOTS ➔
                </button>
              </div>
            </div>
          </TiltCard3D>
        </div>
      </div>
    </section>
  );
};

export default ThreeMemberHUD;
