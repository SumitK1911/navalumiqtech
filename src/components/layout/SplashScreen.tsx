"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "@/components/BrandLogo";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let animationDone = false;
    let pageLoaded = false;

    // Minimum animation duration (2.6 seconds)
    const animTimer = setTimeout(() => {
      animationDone = true;
      checkComplete();
    }, 2600);

    // Fallback safety timeout (5.0 seconds) to ensure the site is accessible
    // even if some assets or network requests take too long
    const safetyTimer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    const handleLoad = () => {
      pageLoaded = true;
      checkComplete();
    };

    if (document.readyState === "complete") {
      pageLoaded = true;
      checkComplete();
    } else {
      window.addEventListener("load", handleLoad);
    }

    function checkComplete() {
      if (animationDone && pageLoaded) {
        setVisible(false);
      }
    }

    // Prevent body scrolling while splash screen is active
    if (visible) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      clearTimeout(animTimer);
      clearTimeout(safetyTimer);
      window.removeEventListener("load", handleLoad);
      document.body.style.overflow = "";
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = "";
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050816]"
        >
          {/* Ambient glow blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
            <div className="absolute left-1/3 top-1/3 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[100px]" />
          </div>

          {/* Outer pulse ring */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.6, 1.4, 1.4], opacity: [0, 0.3, 0] }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="absolute h-64 w-64 rounded-full border border-cyan-400/30"
          />

          {/* Inner pulse ring */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.6, 1.2, 1.2], opacity: [0, 0.5, 0] }}
            transition={{ duration: 1.8, delay: 0.15, ease: "easeOut" }}
            className="absolute h-52 w-52 rounded-full border border-violet-400/30"
          />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative flex flex-col items-center gap-5"
          >
            {/* Logo icon with glow */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-2xl" />
              <BrandLogo width={220} className="relative drop-shadow-[0_0_24px_rgba(34,211,238,0.5)]" />
            </div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col items-center gap-1 text-center"
            >
              <h1 className="text-2xl font-black tracking-tight text-white">
                Nava Lumiq{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
                  Tech
                </span>
              </h1>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">
                Engineering Digital Excellence
              </p>
            </motion.div>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-16 w-40"
          >
            <div className="h-px w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ delay: 0.7, duration: 1.5, ease: "easeInOut" }}
                className="h-full w-full bg-gradient-to-r from-cyan-400 to-violet-500"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
