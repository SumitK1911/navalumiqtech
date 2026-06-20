"use client";

export default function GridBackground() {

  return (

    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

      {/* Base Grid */}
      <div
        className="
          absolute inset-0
          bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]
          bg-size-[80px_80px]
          mask-[radial-gradient(ellipse_at_center,black_30%,transparent_85%)]
        "
      />

      {/* Cyan Glow */}
      <div
        className="
          absolute top-[-20%] left-[10%]
          h-125 w-125
          rounded-full
          bg-cyan-500/10
          blur-[140px]
          animate-pulse
        "
      />

      {/* Violet Glow */}
      <div
        className="
          absolute bottom-[-20%] right-[10%]
          h-125 w-125
          rounded-full
          bg-violet-500/10
          blur-[140px]
          animate-pulse
        "
      />

    </div>

  );
}