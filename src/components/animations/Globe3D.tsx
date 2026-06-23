"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  HiSparkles,
  HiCloud,
  HiCode,
  HiDatabase,
  HiShieldCheck,
} from "react-icons/hi";

/* ─── Earth canvas texture ───────────────────────────────── */
function makeEarth(): HTMLCanvasElement {
  const W = 2048, H = 1024;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const g = cv.getContext("2d")!;

  // Background — pure black so AdditiveBlending makes it fully transparent
  g.fillStyle = "#000000"; 
  g.fillRect(0, 0, W, H);

  // Land helper
  const landPath = new Path2D();
  const poly = (pts: [number, number][]) => {
    landPath.moveTo(pts[0][0], pts[0][1]);
    pts.slice(1).forEach(([x, y]) => landPath.lineTo(x, y));
    landPath.closePath();
  };

  // North America
  poly([[232,178],[428,158],[520,202],[540,314],[500,438],[450,480],[374,520],[300,494],[244,404],[214,314],[224,240]]);
  poly([[360,520],[414,534],[394,620],[350,600],[330,560]]); // Mexico
  poly([[640,98],[730,88],[775,147],[740,210],[684,220],[642,177]]);  // Greenland

  // South America
  poly([[404,547],[467,527],[510,570],[530,630],[512,737],[470,815],[409,854],[367,790],[344,708],[352,628],[374,568]]);

  // Europe
  poly([[880,222],[1010,202],[1070,246],[1047,310],[987,330],[922,319],[881,276]]);
  poly([[860,302],[928,292],[938,367],[886,386],[842,346]]); // Iberia
  poly([[962,302],[996,312],[1007,386],[976,407],[952,366],[952,324]]); // Italy
  poly([[922,162],[986,142],[1030,182],[1007,246],[962,256],[922,222]]); // Scandinavia
  poly([[840,212],[886,198],[897,256],[860,272],[832,246]]); // UK

  // Africa
  poly([[881,363],[1010,343],[1070,383],[1090,508],[1067,650],[1007,770],[926,787],[862,727],[822,627],[822,507],[842,424]]);
  poly([[1062,343],[1150,323],[1187,407],[1167,467],[1082,467],[1062,407]]); // Arabia

  // Asia
  poly([[1062,202],[1210,162],[1414,142],[1620,162],[1700,202],[1734,306],[1694,387],[1608,407],[1505,427],[1407,407],[1302,387],[1202,363],[1102,343],[1062,302]]);
  poly([[1162,383],[1230,363],[1267,467],[1247,567],[1187,587],[1142,507],[1142,424]]); // India
  poly([[1502,383],[1587,363],[1650,407],[1650,487],[1587,507],[1502,467]]); // SE Asia
  poly([[1702,242],[1747,222],[1767,276],[1737,306],[1702,286]]); // Japan

  // Australia
  poly([[1542,642],[1687,623],[1767,663],[1787,767],[1727,827],[1622,847],[1542,807],[1502,727],[1512,662]]);

  // Dotted Map Generator (High Resolution)
  const DOT_SPACING = 6;
  for (let y = 0; y < H; y += DOT_SPACING) {
    for (let x = 0; x < W; x += DOT_SPACING) {
      if (g.isPointInPath(landPath, x, y)) {
        // Dense glowing land dots (Cyan)
        g.fillStyle = "rgba(34, 211, 238, 0.9)";
        g.beginPath(); g.arc(x, y, 1.2, 0, Math.PI * 2); g.fill();
      } else {
        // Faint ocean dots
        g.fillStyle = "rgba(0, 100, 255, 0.25)";
        g.beginPath(); g.arc(x, y, 0.8, 0, Math.PI * 2); g.fill();
      }
    }
  }

  // Dotted Lat/Lon Grid (The 'hologram' grid lines from the image)
  g.fillStyle = "rgba(34, 211, 238, 0.25)";
  for (let lat = -80; lat <= 80; lat += 10) {
    const y = ((90 - lat) / 180) * H;
    for (let x = 0; x < W; x += 8) {
      g.beginPath(); g.arc(x, y, 1, 0, Math.PI * 2); g.fill();
    }
  }
  for (let lon = 0; lon < 360; lon += 10) {
    const x = (lon / 360) * W;
    for (let y = 0; y < H; y += 8) {
      g.beginPath(); g.arc(x, y, 1, 0, Math.PI * 2); g.fill();
    }
  }

  // Large Glowing Network Overlay
  g.strokeStyle = "rgba(34, 211, 238, 0.6)";
  g.lineWidth = 1.5;
  const netNodes: [number, number][] = [];
  for (let i = 0; i < 45; i++) {
    netNodes.push([Math.random() * W, Math.random() * H]);
  }
  g.beginPath();
  netNodes.forEach(([x, y]) => {
    const dists = netNodes.map((n, idx) => ({ idx, d: Math.hypot(n[0]-x, n[1]-y) })).sort((a,b)=>a.d-b.d);
    g.moveTo(x, y); g.lineTo(netNodes[dists[1].idx][0], netNodes[dists[1].idx][1]);
    g.moveTo(x, y); g.lineTo(netNodes[dists[2].idx][0], netNodes[dists[2].idx][1]);
  });
  g.stroke();

  // Network Glow Nodes
  netNodes.forEach(([cx, cy]) => {
    g.fillStyle = "#ffffff"; g.beginPath(); g.arc(cx, cy, 2, 0, Math.PI * 2); g.fill();
    const grd = g.createRadialGradient(cx, cy, 0, cx, cy, 14);
    grd.addColorStop(0, "rgba(255,255,255,0.9)");
    grd.addColorStop(0.2, "rgba(34,211,238,0.7)");
    grd.addColorStop(1, "rgba(34,211,238,0)");
    g.fillStyle = grd; g.beginPath(); g.arc(cx, cy, 14, 0, Math.PI * 2); g.fill();
  });

  return cv;
}

/* ─── Globe3D Component ──────────────────────────────────── */
export default function Globe3D() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = canvasRef.current; if (!el) return;
    const W = el.clientWidth, H = el.clientHeight;

    // Renderer — alpha:true = transparent background
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // fully transparent
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(36, W / H, 0.1, 100);
    cam.position.z = 3.9;

    // Lighting
    scene.add(new THREE.AmbientLight(0x111b40, 4));
    const sun = new THREE.DirectionalLight(0x00f0ff, 6);
    sun.position.set(5, 3, 4); scene.add(sun);
    const rim = new THREE.DirectionalLight(0xa855f7, 5);
    rim.position.set(-5, -2, -4); scene.add(rim);
    // Soft front fill
    const fill = new THREE.DirectionalLight(0x60a5fa, 2);
    fill.position.set(0, 0, 5); scene.add(fill);

    // Inner Dark Core (gives the globe depth and blocks the back face from being too messy)
    const R = 0.92;
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(R * 0.98, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x050816 })
    );
    scene.add(core);

    // Globe sphere (Outer hologram layer)
    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(R, 64, 64),
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(makeEarth()),
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    globe.rotation.z = THREE.MathUtils.degToRad(15); // Slight tilt
    scene.add(globe);

    // Intense Atmosphere Glow (Thick blue halo like the image)
    const atmoBack = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.15, 64, 64),
      new THREE.MeshPhongMaterial({ color: 0x0066ff, transparent: true, opacity: 0.35, side: THREE.BackSide, blending: THREE.AdditiveBlending })
    );
    scene.add(atmoBack);
    
    const atmoFront = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.04, 64, 64),
      new THREE.MeshPhongMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.25, side: THREE.FrontSide, blending: THREE.AdditiveBlending })
    );
    scene.add(atmoFront);

    // Multiple intersecting orbital rings (Constellation style)
    const rings: THREE.Group[] = [];
    const addRing = (rx: number, ry: number, rz: number, radius: number) => {
      const ringGroup = new THREE.Group();
      
      const line = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.002, 16, 128),
        new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.4 })
      );
      ringGroup.add(line);
      
      // Glowing dots on ring
      for (let i = 0; i < 4; i++) {
        const a = Math.random() * Math.PI * 2;
        const dot = new THREE.Mesh(
          new THREE.SphereGeometry(0.015, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        dot.position.set(radius * Math.cos(a), 0, radius * Math.sin(a));
        
        const glow = new THREE.Mesh(
          new THREE.SphereGeometry(0.05, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending })
        );
        glow.position.copy(dot.position);
        ringGroup.add(dot); ringGroup.add(glow);
      }
      
      ringGroup.rotation.set(rx, ry, rz);
      scene.add(ringGroup);
      rings.push(ringGroup);
    };
    
    addRing(Math.PI / 2, 0, 0, R * 1.35); // Equatorial
    addRing(Math.PI / 3, Math.PI / 4, 0, R * 1.45); // Tilted 1
    addRing(-Math.PI / 3, Math.PI / 6, 0, R * 1.4); // Tilted 2

    // Resize handler
    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      cam.aspect = w / h; cam.updateProjectionMatrix(); renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // Animation loop
    let id: number;
    const timer = new THREE.Timer();

    const tick = () => {
      id = requestAnimationFrame(tick);
      timer.update();
      const angle = (timer.getElapsed() * Math.PI * 2) / 25;
      globe.rotation.y = angle;
      core.rotation.y = angle;
      rings.forEach((r, i) => { r.rotation.y += (i % 2 === 0 ? 0.002 : -0.0015); });
      renderer.render(scene, cam);
    };
    tick();

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative h-full w-full">

      {/* ── Three.js canvas (transparent bg) ── */}
      <div ref={canvasRef} className="absolute inset-0" />

      {/* ── Atmosphere edge glow ── */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          boxShadow: "inset 0 0 60px rgba(34,211,238,0.1)",
        }}
      />

      {/* ── Central UI Overlay ── */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div className="relative flex flex-col items-center justify-center h-40 w-40 sm:h-52 sm:w-52 rounded-full border border-cyan-400/40 bg-[#020617]/70 backdrop-blur-md shadow-[0_0_40px_rgba(34,211,238,0.25),inset_0_0_20px_rgba(34,211,238,0.15)]">
          <p className="text-[9px] sm:text-[11px] font-medium text-slate-300 tracking-wide">We Transform</p>
          <h1 className="text-2xl sm:text-[32px] font-black text-white mt-0.5 mb-1.5 leading-tight text-center">
            Ideas <br />
            into <span className="text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]">Impact</span>
          </h1>
          <div className="flex gap-1.5 text-[7px] sm:text-[9px] font-semibold text-slate-300 mt-1">
            <span>Technology</span> <span className="text-cyan-400">•</span> <span>People</span> <span className="text-cyan-400">•</span> <span>Process</span>
          </div>
          <p className="text-[8px] sm:text-[10px] text-slate-400 mt-1 tracking-widest">WORKING TOGETHER</p>
        </div>
      </div>

      {/* ── Service cards orbiting container ── */}
      <div className="pointer-events-none absolute inset-0 animate-[spin_30s_linear_infinite]">
        <SvcCard
          label="AI Systems"
          lines={["Intelligent Automation", "AI Agents, LLMs,", "Chatbots"]}
          Icon={HiSparkles}
          align="center"
          angle={-90}
        />
        <SvcCard
          label="Cloud Solutions"
          lines={["Scalable Cloud", "Architecture", "& DevOps"]}
          Icon={HiCloud}
          align="left"
          angle={-162}
        />
        <SvcCard
          label="Enterprise Software"
          lines={["Custom Software", "Web & Mobile", "Applications"]}
          Icon={HiCode}
          align="right"
          angle={-18}
        />
        <SvcCard
          label="Data & Analytics"
          lines={["Data Engineering,", "Analytics &", "Business Insights"]}
          Icon={HiDatabase}
          align="left"
          angle={126}
        />
        <SvcCard
          label="Cyber Security"
          lines={["Security Solutions", "Infrastructure", "Protection"]}
          Icon={HiShieldCheck}
          align="right"
          angle={54}
        />
      </div>
    </div>
  );
}

/* ─── Service card ───────────────────────────────────────── */
const SvcCard = ({
  label,
  lines,
  Icon,
  align,
  angle,
}: {
  label: string;
  lines: string[];
  Icon: React.ElementType;
  align: "left" | "right" | "center";
  angle: number;
}) => {
  const isR = align === "right", isC = align === "center";
  const r = 36; // Orbit radius (%)
  
  // Convert angle to position on a circle
  const rad = (angle * Math.PI) / 180;
  const top = `calc(50% + ${r * Math.sin(rad)}%)`;
  const left = `calc(50% + ${r * Math.cos(rad)}%)`;

  return (
    <div 
      className="pointer-events-none absolute transition-opacity duration-500"
      style={{ top, left, transform: "translate(-50%, -50%)" }}
    >
      {/* Counter-rotation to keep card upright */}
      <div className="animate-[spin_30s_linear_reverse_infinite]">
        <div className={`flex items-center gap-3 ${isC ? "flex-col" : isR ? "flex-row-reverse" : "flex-row"}`}>

          {/* Icon circle */}
          <div className="relative flex-shrink-0">
            {/* Pulse ring */}
            <span
              className="absolute animate-ping rounded-full border border-cyan-400/35"
              style={{ inset: -5, animationDuration: "2.8s" }}
            />
            {/* Glow halo */}
            <div
              className="absolute rounded-full"
              style={{
                inset: -3,
                border: "1px solid rgba(34,211,238,0.45)",
                boxShadow: "0 0 16px 4px rgba(34,211,238,0.38)",
              }}
            />
            {/* Body */}
            <div
              className="relative flex h-[44px] w-[44px] items-center justify-center rounded-full sm:h-[52px] sm:w-[52px]"
              style={{
                background: "radial-gradient(circle at 38% 32%, #0e2845 0%, #040f22 100%)",
                border: "1.5px solid rgba(34,211,238,0.85)",
                boxShadow: "inset 0 0 14px rgba(34,211,238,0.25), 0 0 22px rgba(34,211,238,0.55)",
              }}
            >
              <Icon
                className="text-[20px] text-cyan-300 sm:text-[24px]"
                style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.9))" }}
              />
            </div>
          </div>

          {/* Text */}
          <div className={`${isC ? "text-center mt-2" : isR ? "text-right" : "text-left"}`}>
            <p className="text-[14px] font-extrabold leading-tight text-white sm:text-[16px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{label}</p>
            {lines.map((l, i) => (
              <p key={i} className="text-[11px] font-semibold leading-[1.55] text-cyan-50/90 sm:text-[12px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">{l}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
