"use client";

import { useEffect, useRef } from "react";

export default function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.background = `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, rgba(6,182,212,0.08) 0%, rgba(6,182,212,0.06) 50%, transparent 30%)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed inset-0 z-1"
      style={{
        background: `radial-gradient(circle at 0px 0px, rgba(6,182,212,0.08) 0%, rgba(6,182,212,0.06) 50%, transparent 30%)`,
      }}
    />
  );
}