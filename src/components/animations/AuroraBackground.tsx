"use client";

export default function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">

      <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-cyan-500/20 blur-[140px] rounded-full animate-pulse" />

      <div className="absolute bottom-[-10%] right-[-10%] w-125 h-125 bg-purple-500/20 blur-[140px] rounded-full animate-pulse" />

      <div className="absolute top-[40%] left-[30%] w-100 h-100 bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />

    </div>
  );
}