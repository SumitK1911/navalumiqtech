"use client";

import dynamic from "next/dynamic";
import {
  motion,
  type Variants,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { HiArrowRight } from "react-icons/hi";
import AuroraBackground from "../components/animations/AuroraBackground";

const Globe3D = dynamic(() => import("../components/animations/Globe3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-64 w-64 animate-pulse rounded-full bg-cyan-400/10" />
    </div>
  ),
});


const revealContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.08 },
  },
};

const revealItem: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(10px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.72, ease: "easeOut" },
  },
};

function MagneticAnchor({ href, children }: { href: string; children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.35 });

  const handleMouseMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.16);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.2);
  };

  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.a
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.98 }}
      className="group relative w-full overflow-hidden rounded-xl glass-card px-6 py-4 text-center text-[15px] font-bold text-white transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] hover:bg-[#020b24]/60 sm:w-56"
    >
      <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="relative z-10 flex items-center justify-center gap-3">
        {children}
        <HiArrowRight className="text-cyan-400 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </motion.a>
  );
}

export default function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 22, mass: 0.4 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 22, mass: 0.4 });
  const glowX = useTransform(smoothX, (v) => `${v * 160}px`);
  const glowY = useTransform(smoothY, (v) => `${v * 120}px`);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      className="group relative flex min-h-svh items-center overflow-hidden pt-32 pb-20 md:pt-36 lg:pt-32"
    >
      <AuroraBackground />

      {/* Mouse-tracking glow (Emerald/Cyan Mix) */}
      <motion.div
        style={{ x: glowX, y: glowY }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-136 w-136 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 mix-blend-screen blur-[120px]"
      />

      {/* Background overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_82%_24%,rgba(139,92,246,0.22),transparent_30%),linear-gradient(to_bottom,rgba(5,8,22,0.18),rgba(5,8,22,0.96)_88%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[44px_44px] opacity-35 mask-[radial-gradient(ellipse_72%_58%_at_50%_24%,#000_58%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] opacity-[0.035]" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 lg:px-16">
        <div className="grid grid-cols-1 items-center gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(460px,0.85fr)] lg:gap-12 lg:py-16">

          {/* ── Left: text content ── */}
          <motion.div
            variants={revealContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <motion.h1
              variants={revealItem}
              className="text-balance text-4xl font-black leading-[1.12] tracking-normal text-white sm:text-5xl md:text-6xl xl:text-7xl"
            >
              Engineering{" "}
              <span className="text-gradient-emerald">
                Digital Impact
              </span>
              <br />
              At Scale.
            </motion.h1>

            <motion.p
              variants={revealItem}
              className="mt-6 max-w-xl text-sm leading-7 text-slate-300 sm:mt-7 sm:text-base sm:leading-8"
            >
              We build the product ecosystem behind ambitious companies:
              enterprise websites, mobile apps, AI systems, automation
              platforms, and dashboards engineered to feel expensive and perform
              under pressure.
            </motion.p>

            <motion.div
              variants={revealItem}
              className="mt-8 flex w-full flex-col items-center gap-4 sm:mt-9 sm:w-auto sm:flex-row"
            >
              <MagneticAnchor href="#contact">Book a Counseling</MagneticAnchor>
            </motion.div>
          </motion.div>

          {/* ── Right: Globe ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.28, ease: "easeOut" }}
            className="relative flex w-full items-center justify-center lg:justify-end"
          >
            {/* Conic background glow (Emerald/Cyan) */}
            <div className="absolute inset-0 bg-[conic-gradient(from_160deg_at_50%_50%,transparent_0deg,rgba(34,211,238,0.15)_72deg,transparent_130deg,rgba(52,211,153,0.15)_238deg,transparent_318deg)] opacity-80 blur-3xl" />

            {/* Globe container */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-square w-full max-w-[500px] min-w-[320px] sm:min-w-0 lg:max-w-[540px] xl:max-w-[580px]"
            >
              <Globe3D />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
