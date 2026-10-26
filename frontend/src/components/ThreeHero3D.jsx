import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./styles/ThreeHero3D.css";

const ThreeHero3D = ({ user, onOpenLogin }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, and Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050609, 0.025);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 11);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.appendChild(renderer.domElement);

    // 2. Cinematic Lighting System
    const ambientLight = new THREE.AmbientLight(0x0f1420, 1.6);
    scene.add(ambientLight);

    // Key Light from Top-Front-Right
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(6, 8, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Electric Orange Rim Light
    const orangeRimLight = new THREE.PointLight(0xff5500, 5.5, 30);
    orangeRimLight.position.set(8, -2, -4);
    scene.add(orangeRimLight);

    // Neon Red Ambient Fill Light
    const redFillLight = new THREE.PointLight(0xff1e42, 4.8, 30);
    redFillLight.position.set(-8, 3, 4);
    scene.add(redFillLight);

    // 3. Realistic 3D Olympic Barbell Assembly
    const barbellGroup = new THREE.Group();

    // High-grade Steel Material
    const chromeSteelMat = new THREE.MeshStandardMaterial({
      color: 0xdedede,
      metalness: 0.94,
      roughness: 0.22,
    });

    // Dark Carbon Cast Iron Plate Material
    const carbonIronMat = new THREE.MeshStandardMaterial({
      color: 0x141822,
      metalness: 0.65,
      roughness: 0.42,
    });

    // Competition Neon Red Bumper Plate Material
    const neonRedPlateMat = new THREE.MeshStandardMaterial({
      color: 0xd61f38,
      metalness: 0.4,
      roughness: 0.35,
    });

    // Electric Orange Accent Material
    const electricOrangeMat = new THREE.MeshStandardMaterial({
      color: 0xff5500,
      emissive: 0xff3300,
      emissiveIntensity: 0.35,
      metalness: 0.8,
      roughness: 0.2,
    });

    // Central Steel Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.12, 0.12, 9.2, 32);
    const shaftMesh = new THREE.Mesh(shaftGeo, chromeSteelMat);
    shaftMesh.rotation.z = Math.PI / 2;
    shaftMesh.castShadow = true;
    barbellGroup.add(shaftMesh);

    // Left & Right Olympic Sleeve Collars
    [-3.3, 3.3].forEach((pos) => {
      const collarGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.22, 32);
      const collarMesh = new THREE.Mesh(collarGeo, electricOrangeMat);
      collarMesh.rotation.z = Math.PI / 2;
      collarMesh.position.x = pos;
      collarMesh.castShadow = true;
      barbellGroup.add(collarMesh);
    });

    // Bumper Plate Sets on Left & Right Sleeves
    const plateOffsets = [
      { x: 3.6, r: 1.85, w: 0.32, mat: neonRedPlateMat },
      { x: 3.98, r: 1.85, w: 0.32, mat: neonRedPlateMat },
      { x: 4.34, r: 1.65, w: 0.28, mat: carbonIronMat },
      { x: 4.66, r: 1.45, w: 0.24, mat: electricOrangeMat },

      { x: -3.6, r: 1.85, w: 0.32, mat: neonRedPlateMat },
      { x: -3.98, r: 1.85, w: 0.32, mat: neonRedPlateMat },
      { x: -4.34, r: 1.65, w: 0.28, mat: carbonIronMat },
      { x: -4.66, r: 1.45, w: 0.24, mat: electricOrangeMat },
    ];

    plateOffsets.forEach((p) => {
      const plateGeo = new THREE.CylinderGeometry(p.r, p.r, p.w, 36);
      const plateMesh = new THREE.Mesh(plateGeo, p.mat);
      plateMesh.rotation.z = Math.PI / 2;
      plateMesh.position.x = p.x;
      plateMesh.castShadow = true;
      plateMesh.receiveShadow = true;
      barbellGroup.add(plateMesh);

      // Inner Hub Ring for depth
      const hubGeo = new THREE.CylinderGeometry(p.r * 0.45, p.r * 0.45, p.w + 0.02, 32);
      const hubMesh = new THREE.Mesh(hubGeo, chromeSteelMat);
      hubMesh.rotation.z = Math.PI / 2;
      hubMesh.position.x = p.x;
      barbellGroup.add(hubMesh);
    });

    barbellGroup.position.set(0, 0.4, 0);
    barbellGroup.rotation.set(0.18, -0.4, 0.12);
    scene.add(barbellGroup);

    // 4. Atmospheric 3D Floating Particle Constellation
    const particleCount = 1100;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cNeonRed = new THREE.Color(0xff1e42);
    const cElectricOrange = new THREE.Color(0xff5500);
    const cWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      positions[idx] = (Math.random() - 0.5) * 36;
      positions[idx + 1] = (Math.random() - 0.5) * 24;
      positions[idx + 2] = (Math.random() - 0.5) * 24;

      const rand = Math.random();
      const col = rand > 0.6 ? cElectricOrange : rand > 0.3 ? cNeonRed : cWhite;
      colors[idx] = col.r;
      colors[idx + 1] = col.g;
      colors[idx + 2] = col.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Reflective 3D Ground Perspective Plane
    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x06070a,
      roughness: 0.45,
      metalness: 0.8,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -3.8;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Grid Helper on floor with Electric Orange & Neon Red accents
    const grid = new THREE.GridHelper(50, 40, 0xff5500, 0x192130);
    grid.position.y = -3.79;
    scene.add(grid);

    // 7. Mouse and Scroll Interaction Physics
    let mouseX = 0;
    let mouseY = 0;
    let targetCamX = 0;
    let targetCamY = 0.5;
    let scrollY = 0;

    const onMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseX = normX;
      mouseY = normY;
      targetCamX = normX * 1.8;
      targetCamY = 0.5 + normY * 0.9;
    };

    const onScroll = () => {
      scrollY = window.scrollY || window.pageYOffset;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", onResize);

    // 8. 60FPS Cinematic Render Loop
    let animId;
    const startTime = performance.now();

    const animate = () => {
      const elapsedTime = (performance.now() - startTime) / 1000;

      // Smooth camera interpolation toward mouse position
      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Smooth barbell floating & rotation physics
      const scrollRotation = scrollY * 0.0025;
      barbellGroup.rotation.y = -0.4 + Math.sin(elapsedTime * 0.45) * 0.25 + scrollRotation;
      barbellGroup.rotation.x = 0.18 + Math.cos(elapsedTime * 0.35) * 0.12;
      barbellGroup.position.y = 0.4 + Math.sin(elapsedTime * 1.2) * 0.22;

      // Particles ambient drift
      particles.rotation.y = elapsedTime * 0.025;
      particles.rotation.x = Math.sin(elapsedTime * 0.015) * 0.08;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);

      // Clean up geometries and materials to avoid WebGL memory leak
      renderer.dispose();
      shaftGeo.dispose();
      chromeSteelMat.dispose();
      carbonIronMat.dispose();
      neonRedPlateMat.dispose();
      electricOrangeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      groundGeo.dispose();
      groundMat.dispose();

      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section className="three-hero-section" id="hero">
      {/* Three.js Real-time 3D WebGL Canvas Viewport */}
      <div ref={mountRef} className="three-hero-canvas-wrap" />

      {/* Atmospheric Vignette & Gradient Overlays */}
      <div className="three-hero-vignette" />

      {/* Foreground Hero Content & Large Animated Headline */}
      <div className="three-hero-content-container">
        <div className="three-hero-kicker">
          <span className="kicker-pulse-dot" />
          <span className="kicker-brand">IRONFIT // 3D ARENA</span>
          <span className="kicker-sep">/</span>
          <span className="kicker-location">HYDERABAD OLYMPIC FACILITY</span>
        </div>

        <h1 className="three-hero-headline">
          BUILD YOUR STRENGTH.<br />
          <span className="headline-gradient">TRANSFORM YOUR LIFE.</span>
        </h1>

        <p className="three-hero-subtext">
          Hyderabad's premier fitness club and gym. Olympic barbells, heavy dumbbells, modern cardio floor, certified personal trainers, and 3D workout guidance.
        </p>

        {/* Primary Interactive Action Buttons */}
        <div className="three-hero-cta-group">
          {user ? (
            <>
              <a href="#musclemap" className="btn-hero-primary">
                <span>LAUNCH MUSCLEMAP 3D</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
              <a href="#programs" className="btn-hero-secondary">
                <span>MY WORKOUT SPLITS</span>
              </a>
            </>
          ) : (
            <>
              <button className="btn-hero-primary" onClick={onOpenLogin}>
                <span>JOIN OUR GYM</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
              <a href="#programs-preview" className="btn-hero-secondary">
                <span>WORKOUT PROGRAMS</span>
              </a>
              <a href="#membership" className="btn-hero-tertiary">
                <span>GYM MEMBERSHIPS</span>
              </a>
            </>
          )}
        </div>

        {/* 3D Real-time Telemetry Bar */}
        <div className="three-hero-stats-dock">
          <div className="stats-dock-item">
            <span className="dock-stat-num">5,000+</span>
            <span className="dock-stat-label">SQ. FT. TURF</span>
          </div>
          <div className="dock-divider" />
          <div className="stats-dock-item">
            <span className="dock-stat-num">50M</span>
            <span className="dock-stat-label">SPRINT TRACK</span>
          </div>
          <div className="dock-divider" />
          <div className="stats-dock-item">
            <span className="dock-stat-num">12+</span>
            <span className="dock-stat-label">PRO COACHES</span>
          </div>
          <div className="dock-divider" />
          <div className="stats-dock-item">
            <span className="dock-stat-num">100%</span>
            <span className="dock-stat-label">3D BIOMECHANICS</span>
          </div>
        </div>

        {/* Mouse 3D Interactive Cue */}
        <div className="hero-scroll-cue">
          <span className="cue-mouse">✦ MOVE CURSOR TO ORBIT 3D MODEL ✦</span>
        </div>
      </div>
    </section>
  );
};

export default ThreeHero3D;
