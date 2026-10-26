import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./styles/HeroBackgroundAnimation.css";

/**
 * Three.js 3D Animated Gym Equipment Background
 * High-performance WebGL background with 3D Hex Dumbbells, Kettlebells, and Olympic Plates.
 * Equipped with IntersectionObserver to only animate when visible in viewport.
 */
const HeroBackgroundAnimation = ({
  variant = "dumbbell", // "dumbbell" | "kettlebell" | "plate" | "dual-dumbbell"
  position = "right", // "right" | "left" | "center"
  accentColor = 0xff5500,
}) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 600;

    // 1. Scene, Camera, and Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070d, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 80);
    camera.position.set(0, 0, 9);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      container.appendChild(renderer.domElement);
    } catch {
      return; // Fallback gracefully if WebGL is unavailable
    }

    // 2. Cinematic Lighting
    const ambientLight = new THREE.AmbientLight(0x0c111c, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(accentColor, 5.5, 25);
    rimLight.position.set(position === "left" ? 6 : -6, -2, 4);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x38bdf8, 2.5, 25);
    fillLight.position.set(position === "left" ? -6 : 6, 3, -3);
    scene.add(fillLight);

    // 3. Materials
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.18,
    });

    const castIronMat = new THREE.MeshStandardMaterial({
      color: 0x121722,
      metalness: 0.65,
      roughness: 0.38,
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: accentColor,
      emissive: accentColor,
      emissiveIntensity: 0.45,
      metalness: 0.8,
      roughness: 0.25,
    });

    // 4. Equipment Assembly Based on Variant
    const equipmentGroup = new THREE.Group();

    // Helper: Single Hex Dumbbell
    const createHexDumbbell = (scale = 1) => {
      const dbGroup = new THREE.Group();

      // Knurled Handle
      const handleGeo = new THREE.CylinderGeometry(0.18 * scale, 0.22 * scale, 3.4 * scale, 24);
      const handleMesh = new THREE.Mesh(handleGeo, chromeMat);
      handleMesh.rotation.z = Math.PI / 2;
      dbGroup.add(handleMesh);

      // Collars
      [-1.7 * scale, 1.7 * scale].forEach((posX) => {
        const collarGeo = new THREE.CylinderGeometry(0.28 * scale, 0.28 * scale, 0.16 * scale, 24);
        const collarMesh = new THREE.Mesh(collarGeo, accentMat);
        collarMesh.rotation.z = Math.PI / 2;
        collarMesh.position.x = posX;
        dbGroup.add(collarMesh);
      });

      // Hex Heads
      const hexRadius = 1.3 * scale;
      const hexWidth = 1.1 * scale;

      [-2.35 * scale, 2.35 * scale].forEach((posX, idx) => {
        const isRight = idx === 1;
        const hexGeo = new THREE.CylinderGeometry(hexRadius, hexRadius, hexWidth, 6);
        const hexMesh = new THREE.Mesh(hexGeo, castIronMat);
        hexMesh.rotation.z = Math.PI / 2;
        hexMesh.position.x = posX;
        dbGroup.add(hexMesh);

        // Bevel Outer Cap
        const bevelGeo = new THREE.CylinderGeometry(hexRadius * 0.86, hexRadius, 0.32 * scale, 6);
        const bevelMesh = new THREE.Mesh(bevelGeo, castIronMat);
        bevelMesh.rotation.z = Math.PI / 2;
        bevelMesh.position.x = posX + (isRight ? 0.65 * scale : -0.65 * scale);
        dbGroup.add(bevelMesh);

        // Accent Stamped Face
        const faceGeo = new THREE.CylinderGeometry(0.6 * scale, 0.6 * scale, 0.06 * scale, 6);
        const faceMesh = new THREE.Mesh(faceGeo, accentMat);
        faceMesh.rotation.z = Math.PI / 2;
        faceMesh.position.x = posX + (isRight ? 0.82 * scale : -0.82 * scale);
        dbGroup.add(faceMesh);
      });

      return dbGroup;
    };

    // Helper: Cast Iron Competition Kettlebell
    const createKettlebell = () => {
      const kbGroup = new THREE.Group();

      // Spherical Bell Body
      const bodyGeo = new THREE.SphereGeometry(1.4, 24, 24);
      const bodyMesh = new THREE.Mesh(bodyGeo, castIronMat);
      bodyMesh.scale.set(1, 1.05, 1);
      kbGroup.add(bodyMesh);

      // Flat Machined Base
      const baseGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.2, 24);
      const baseMesh = new THREE.Mesh(baseGeo, castIronMat);
      baseMesh.position.y = -1.25;
      kbGroup.add(baseMesh);

      // Arched Cast Handle
      const handleGeo = new THREE.TorusGeometry(0.82, 0.17, 16, 32, Math.PI);
      const handleMesh = new THREE.Mesh(handleGeo, chromeMat);
      handleMesh.position.y = 1.25;
      kbGroup.add(handleMesh);

      // Connecting Horn Pillars
      [-0.82, 0.82].forEach((posX) => {
        const pillarGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.45, 16);
        const pillarMesh = new THREE.Mesh(pillarGeo, chromeMat);
        pillarMesh.position.set(posX, 1.15, 0);
        kbGroup.add(pillarMesh);
      });

      // Embossed Front Ring with Accent Glow
      const ringGeo = new THREE.TorusGeometry(0.65, 0.06, 12, 24);
      const ringMesh = new THREE.Mesh(ringGeo, accentMat);
      ringMesh.position.set(0, 0.1, 1.22);
      kbGroup.add(ringMesh);

      return kbGroup;
    };

    // Helper: Olympic Competition Weight Plate
    const createWeightPlate = () => {
      const plateGroup = new THREE.Group();

      // Outer Bumper Rim
      const rimGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.36, 36);
      const rimMesh = new THREE.Mesh(rimGeo, castIronMat);
      rimMesh.rotation.x = Math.PI / 2;
      plateGroup.add(rimMesh);

      // Accent Torus Ring
      const ringGeo = new THREE.TorusGeometry(1.5, 0.08, 16, 36);
      const ringMesh = new THREE.Mesh(ringGeo, accentMat);
      plateGroup.add(ringMesh);

      // Machined Center Hub
      const hubGeo = new THREE.CylinderGeometry(0.68, 0.68, 0.42, 32);
      const hubMesh = new THREE.Mesh(hubGeo, chromeMat);
      hubMesh.rotation.x = Math.PI / 2;
      plateGroup.add(hubMesh);

      return plateGroup;
    };

    // Assemble Selected Variant
    if (variant === "kettlebell") {
      equipmentGroup.add(createKettlebell());
    } else if (variant === "plate") {
      equipmentGroup.add(createWeightPlate());
    } else if (variant === "dual-dumbbell") {
      const db1 = createHexDumbbell(0.85);
      db1.position.set(-0.8, -0.4, 0);
      db1.rotation.set(0.3, 0.4, -0.4);
      equipmentGroup.add(db1);

      const db2 = createHexDumbbell(0.85);
      db2.position.set(0.8, 0.4, -0.5);
      db2.rotation.set(-0.25, -0.3, 0.45);
      equipmentGroup.add(db2);
    } else {
      // Default: single heavy hex dumbbell
      equipmentGroup.add(createHexDumbbell(1));
    }

    // Set Initial Position & Angles
    let targetPosX = 3.6;
    if (position === "left") targetPosX = -3.6;
    if (position === "center") targetPosX = 0;

    equipmentGroup.position.set(targetPosX, 0.2, position === "center" ? -2.2 : 0);
    equipmentGroup.rotation.set(0.35, 0.45, -0.2);
    scene.add(equipmentGroup);

    // 5. Ambient 3D Golden/Amber Floating Embers
    const particleCount = 350;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    const pSpeed = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 18;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 14;
      pSpeed[i] = 0.003 + Math.random() * 0.007;
    }

    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));

    const pMat = new THREE.PointsMaterial({
      color: accentColor,
      size: 0.065,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // 6. Mouse Parallax & Intersection-Observer Driven Animation Loop
    let mouseX = 0;
    let mouseY = 0;
    let isVisible = false;
    let animationFrameId = null;
    const startTime = performance.now();

    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const animate = () => {
      if (!isVisible) return;
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = (performance.now() - startTime) / 1000;

      // Parallax camera lerp
      camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.035;
      camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.035;
      camera.lookAt(0, 0, 0);

      // Smooth equipment floating & multi-axis rotation
      equipmentGroup.rotation.y = 0.45 + Math.sin(elapsed * 0.35) * 0.3 + mouseX * 0.2;
      equipmentGroup.rotation.x = 0.35 + Math.cos(elapsed * 0.28) * 0.25 - mouseY * 0.15;
      equipmentGroup.rotation.z = -0.2 + Math.sin(elapsed * 0.42) * 0.15;
      equipmentGroup.position.y = 0.2 + Math.sin(elapsed * 0.85) * 0.16;

      // Drifting particles
      const positions = pGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += pSpeed[i];
        if (positions[i * 3 + 1] > 7) {
          positions[i * 3 + 1] = -7;
          positions[i * 3] = (Math.random() - 0.5) * 18;
        }
      }
      pGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    // IntersectionObserver: Only render when section is visible!
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            if (!animationFrameId) {
              animate();
            }
          } else {
            if (animationFrameId) {
              cancelAnimationFrame(animationFrameId);
              animationFrameId = null;
            }
          }
        });
      },
      { threshold: 0.05 }
    );

    observer.observe(container);

    // 7. Responsive Resizing
    const handleResize = () => {
      if (!container || !renderer) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 600;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);

      // Mobile adaptation: push deeper into background
      if (newWidth < 768) {
        equipmentGroup.scale.set(0.72, 0.72, 0.72);
        equipmentGroup.position.x = 0;
        equipmentGroup.position.z = -3.5;
      } else {
        equipmentGroup.scale.set(1, 1, 1);
        equipmentGroup.position.x = targetPosX;
        equipmentGroup.position.z = position === "center" ? -2.2 : 0;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    // 8. Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (container && renderer && renderer.domElement) {
        try {
          container.removeChild(renderer.domElement);
        } catch {
          // ignore if already removed
        }
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [variant, position, accentColor]);

  return (
    <div className="hero-animated-bg-container" aria-hidden="true">
      {/* Three.js 3D Moving Gym Equipment Canvas */}
      <div ref={mountRef} className="three-section-canvas-slot" />

      {/* Atmospheric Vignette Cones & Architectural Micro-Mesh */}
      <div className="ambient-spotlight spot-primary" />
      <div className="ambient-spotlight spot-secondary" />
      <div className="ambient-athletic-mesh" />
    </div>
  );
};

export default HeroBackgroundAnimation;
