"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const techNodes = [
  { name: "UX / UI", color: "#22d3ee", orbitSpeed: 0.1, radius: 4.5, angleOffset: 0 },
  { name: "AI / ML", color: "#c084fc", orbitSpeed: -0.15, radius: 5.0, angleOffset: Math.PI / 4 },
  { name: "API DEV", color: "#34d399", orbitSpeed: 0.12, radius: 4.8, angleOffset: Math.PI / 2 },
  { name: "DATABASE", color: "#60a5fa", orbitSpeed: -0.1, radius: 5.5, angleOffset: Math.PI * 0.75 },
  { name: "SEO OPT", color: "#f0abfc", orbitSpeed: 0.18, radius: 4.2, angleOffset: Math.PI },
  { name: "DEVOPS", color: "#facc15", orbitSpeed: -0.2, radius: 5.2, angleOffset: Math.PI * 1.25 },
  { name: "SECURITY", color: "#38bdf8", orbitSpeed: 0.14, radius: 4.7, angleOffset: Math.PI * 1.5 },
  { name: "WEB 3.0", color: "#e879f9", orbitSpeed: -0.12, radius: 5.8, angleOffset: Math.PI * 1.75 },
];

function createPanelTexture(name: string, color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, 512, 160);
    
    // Glassy background
    const bgGradient = ctx.createLinearGradient(0, 0, 512, 0);
    bgGradient.addColorStop(0, "rgba(15, 23, 42, 0.4)");
    bgGradient.addColorStop(0.5, "rgba(30, 41, 59, 0.8)");
    bgGradient.addColorStop(1, "rgba(15, 23, 42, 0.4)");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 512, 160);

    // Glowing border lines
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, 508, 156);
    
    // Tech corner accents
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 24, 6);
    ctx.fillRect(0, 0, 6, 24);
    ctx.fillRect(488, 154, 24, 6);
    ctx.fillRect(506, 136, 6, 24);

    // Text
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 52px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, 256, 75);
    ctx.shadowBlur = 0;

    // Subtext decoration
    ctx.fillStyle = color;
    ctx.font = "600 18px monospace";
    ctx.textAlign = "center";
    ctx.globalAlpha = 0.7;
    ctx.fillText("NETWORK NODE_ACTIVE", 256, 125);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function createParticleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.2, "rgba(125, 249, 255, 0.8)");
    gradient.addColorStop(0.5, "rgba(56, 189, 248, 0.2)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(canvas);
}

export default function HeroThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const width = container.clientWidth || 640;
    const height = container.clientHeight || 620;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const particleTex = createParticleTexture();

    // 1. Central Core Sphere
    const coreGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const coreSphere = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreSphere);

    // 2. Wireframe Dodecahedron
    const wireSphereGeometry = new THREE.IcosahedronGeometry(1.4, 2);
    const wireSphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
    });
    const wireSphere = new THREE.Mesh(wireSphereGeometry, wireSphereMaterial);
    scene.add(wireSphere);

    // 3. Plexus Cloud
    const plexusGroup = new THREE.Group();
    scene.add(plexusGroup);

    const plexusCount = 75;
    const plexusRadius = 2.6;
    const maxDistance = 1.25;
    
    const plexusPositions = new Float32Array(plexusCount * 3);
    const plexusVelocities: THREE.Vector3[] = [];
    for (let i = 0; i < plexusCount; i++) {
      const r = plexusRadius * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      plexusPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      plexusPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      plexusPositions[i * 3 + 2] = r * Math.cos(phi);

      plexusVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015
        )
      );
    }

    const plexusGeometry = new THREE.BufferGeometry();
    plexusGeometry.setAttribute("position", new THREE.BufferAttribute(plexusPositions, 3));
    
    const plexusMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.12,
      map: particleTex,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const plexusPoints = new THREE.Points(plexusGeometry, plexusMaterial);
    plexusGroup.add(plexusPoints);

    const maxLines = plexusCount * plexusCount;
    const linePositions = new Float32Array(maxLines * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const plexusLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    plexusGroup.add(plexusLines);

    // 4. Orbiting Tech Nodes
    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);

    const nodeMeshes: THREE.Mesh[] = [];
    const nodeTextures: THREE.CanvasTexture[] = [];
    
    const connectorGeometry = new THREE.BufferGeometry();
    const connectorPositions = new Float32Array(techNodes.length * 6);
    connectorGeometry.setAttribute("position", new THREE.BufferAttribute(connectorPositions, 3));
    const connectorMaterial = new THREE.LineBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const connectorLines = new THREE.LineSegments(connectorGeometry, connectorMaterial);
    scene.add(connectorLines);

    techNodes.forEach((node) => {
      const texture = createPanelTexture(node.name, node.color);
      nodeTextures.push(texture);

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const aspect = 512 / 160;
      const height = 0.85;
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(height * aspect, height), material);
      
      nodesGroup.add(mesh);
      nodeMeshes.push(mesh);
    });

    // 5. Outer Ambient Rings
    const ringGeometry = new THREE.TorusGeometry(6.5, 0.015, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const outerRing1 = new THREE.Mesh(ringGeometry, ringMaterial);
    outerRing1.rotation.x = Math.PI / 2.2;
    scene.add(outerRing1);

    const ringGeometry2 = new THREE.TorusGeometry(7.2, 0.015, 16, 100);
    const outerRing2 = new THREE.Mesh(ringGeometry2, ringMaterial);
    outerRing2.rotation.x = Math.PI / 1.8;
    scene.add(outerRing2);

    // 6. Background Dust/Stars
    const starCount = 800;
    const starPos = new Float32Array(starCount * 3);
    for(let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 35;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 35;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x0ea5e9,
      size: 0.12,
      map: particleTex,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Interaction & Animation
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect();
      mouseX = (event.clientX - bounds.left) / bounds.width - 0.5;
      mouseY = (event.clientY - bounds.top) / bounds.height - 0.5;
    };

    container.addEventListener("pointermove", handlePointerMove);

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const nextWidth = entry.contentRect.width || 640;
      const nextHeight = entry.contentRect.height || 620;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    });
    resizeObserver.observe(container);

    const clock = new THREE.Clock();
    let frameId = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera Parallax
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;
      
      camera.position.x += (targetX * 4 - camera.position.x) * 0.05;
      camera.position.y += (-targetY * 4 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Core animations
      coreSphere.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.05);
      wireSphere.rotation.x = elapsed * 0.15;
      wireSphere.rotation.y = elapsed * 0.22;

      // Plexus update
      let lineIndex = 0;
      for (let i = 0; i < plexusCount; i++) {
        plexusPositions[i * 3] += plexusVelocities[i].x;
        plexusPositions[i * 3 + 1] += plexusVelocities[i].y;
        plexusPositions[i * 3 + 2] += plexusVelocities[i].z;

        const dist = Math.sqrt(
          plexusPositions[i * 3] ** 2 +
          plexusPositions[i * 3 + 1] ** 2 +
          plexusPositions[i * 3 + 2] ** 2
        );

        if (dist > plexusRadius) {
          plexusVelocities[i].x *= -1;
          plexusVelocities[i].y *= -1;
          plexusVelocities[i].z *= -1;
          
          const scale = plexusRadius / dist;
          plexusPositions[i * 3] *= scale;
          plexusPositions[i * 3 + 1] *= scale;
          plexusPositions[i * 3 + 2] *= scale;
        }

        for (let j = i + 1; j < plexusCount; j++) {
          const dx = plexusPositions[i * 3] - plexusPositions[j * 3];
          const dy = plexusPositions[i * 3 + 1] - plexusPositions[j * 3 + 1];
          const dz = plexusPositions[i * 3 + 2] - plexusPositions[j * 3 + 2];
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < maxDistance * maxDistance) {
            linePositions[lineIndex++] = plexusPositions[i * 3];
            linePositions[lineIndex++] = plexusPositions[i * 3 + 1];
            linePositions[lineIndex++] = plexusPositions[i * 3 + 2];
            linePositions[lineIndex++] = plexusPositions[j * 3];
            linePositions[lineIndex++] = plexusPositions[j * 3 + 1];
            linePositions[lineIndex++] = plexusPositions[j * 3 + 2];
          }
        }
      }
      
      lineGeometry.setDrawRange(0, lineIndex / 3);
      lineGeometry.attributes.position.needsUpdate = true;
      plexusGeometry.attributes.position.needsUpdate = true;

      // Rotate plexus slowly
      plexusGroup.rotation.y = elapsed * 0.08;
      plexusGroup.rotation.z = Math.sin(elapsed * 0.05) * 0.2;

      // Outer rings
      outerRing1.rotation.z = elapsed * 0.1;
      outerRing2.rotation.z = -elapsed * 0.12;

      // Stars
      stars.rotation.y = elapsed * 0.02;

      // Nodes & Connectors
      nodeMeshes.forEach((mesh, i) => {
        const node = techNodes[i];
        const angle = node.angleOffset + elapsed * node.orbitSpeed;
        
        const x = Math.cos(angle) * node.radius;
        const z = Math.sin(angle) * node.radius;
        const y = Math.sin(elapsed * 0.6 + i) * 1.8;

        mesh.position.set(x, y, z);
        mesh.quaternion.copy(camera.quaternion);

        const offset = i * 6;
        connectorPositions[offset] = x;
        connectorPositions[offset + 1] = y;
        connectorPositions[offset + 2] = z;
        connectorPositions[offset + 3] = 0;
        connectorPositions[offset + 4] = 0;
        connectorPositions[offset + 5] = 0;
      });
      connectorGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener("pointermove", handlePointerMove);
      resizeObserver.disconnect();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      particleTex.dispose();
      nodeTextures.forEach((t) => t.dispose());
      coreGeometry.dispose();
      coreMaterial.dispose();
      wireSphereGeometry.dispose();
      wireSphereMaterial.dispose();
      plexusGeometry.dispose();
      plexusMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      connectorGeometry.dispose();
      connectorMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      ringGeometry2.dispose();
      starGeo.dispose();
      starMat.dispose();
      nodeMeshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative h-full min-h-[420px] w-full select-none lg:min-h-[660px]">
      {/* Decorative Container Styling */}
      <div className="absolute inset-0 rounded-2xl border border-white/5 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.0)_0%,rgba(2,6,23,0.4)_100%)] shadow-[inset_0_0_80px_rgba(34,211,238,0.05)] overflow-hidden">
        {/* Corner Brackets */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/30 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/30 rounded-br-xl" />
        
        {/* Header HUD */}
        <div className="absolute left-6 right-6 top-6 flex items-center gap-3 opacity-60">
          <div className="flex gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/50" />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">System Core Active</span>
          <span className="ml-auto h-px flex-1 bg-linear-to-r from-cyan-500/20 to-transparent" />
        </div>
      </div>
      
      {/* ThreeJS Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 cursor-crosshair active:cursor-grabbing"
      />
    </div>
  );
}

