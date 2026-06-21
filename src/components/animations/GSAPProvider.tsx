"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAPProvider
 *
 * Responsibilities:
 *  1. Boot Lenis smooth scroll and sync it with GSAP ticker
 *  2. Scan the DOM for [data-gsap] elements and apply ScrollTrigger reveals
 *  3. Clean up on unmount
 *
 * Usage in JSX — just add a data-gsap attribute:
 *   data-gsap="fade-up"      → fade + translate-y
 *   data-gsap="fade-left"    → fade + translate-x (from right)
 *   data-gsap="fade-right"   → fade + translate-x (from left)
 *   data-gsap="scale-in"     → fade + scale
 *   data-gsap="fade"         → fade only
 *
 * Optional modifiers:
 *   data-gsap-delay="0.2"    → stagger delay in seconds
 *   data-gsap-duration="0.8" → animation duration
 */
export default function GSAPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    /* ─── 1. Lenis smooth scroll ─────────────────────────────── */
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    // Sync Lenis with GSAP ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Sync ScrollTrigger with Lenis scroll position
    lenis.on("scroll", ScrollTrigger.update);

    /* ─── 2. ScrollTrigger reveal animations ─────────────────── */
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const elements = document.querySelectorAll("[data-gsap]");

      elements.forEach((el) => {
        const type     = el.getAttribute("data-gsap") ?? "fade-up";
        const delay    = parseFloat(el.getAttribute("data-gsap-delay") ?? "0");
        const duration = parseFloat(el.getAttribute("data-gsap-duration") ?? "0.75");

        // Build from-state
        const from: gsap.TweenVars = {
          opacity: 0,
          duration,
          delay,
          ease: "power3.out",
        };

        if (type === "fade-up")    { from.y = 48; }
        if (type === "fade-down")  { from.y = -48; }
        if (type === "fade-left")  { from.x = 60; }
        if (type === "fade-right") { from.x = -60; }
        if (type === "scale-in")   { from.scale = 0.88; from.y = 24; }

        gsap.from(el, {
          ...from,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });

      /* ─── Staggered children: [data-gsap-stagger] ────────── */
      const staggerParents = document.querySelectorAll("[data-gsap-stagger]");

      staggerParents.forEach((parent) => {
        const children = parent.children;
        const stagger  = parseFloat(parent.getAttribute("data-gsap-stagger") ?? "0.1");
        const type     = parent.getAttribute("data-gsap") ?? "fade-up";
        const duration = parseFloat(parent.getAttribute("data-gsap-duration") ?? "0.65");

        const from: gsap.TweenVars = { opacity: 0, duration, ease: "power3.out" };
        if (type === "fade-up")    { from.y = 40; }
        if (type === "fade-left")  { from.x = 50; }
        if (type === "fade-right") { from.x = -50; }
        if (type === "scale-in")   { from.scale = 0.9; }

        gsap.from(children, {
          ...from,
          stagger,
          scrollTrigger: {
            trigger: parent,
            start: "top 86%",
            toggleActions: "play none none none",
          },
        });
      });
    });

    /* ─── 3. Cleanup ─────────────────────────────────────────── */
    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      mm.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return <>{children}</>;
}
