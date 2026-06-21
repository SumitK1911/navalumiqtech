"use client";

import GlassCard from "@/components/ui/GlassCard";
import { motion } from "framer-motion";

import {
  HiCheckCircle,
  HiLightningBolt,
  HiSparkles,
} from "react-icons/hi";
import { HiRocketLaunch } from "react-icons/hi2";

const principles = [
  {
    title: "Precision Engineering",
    description:
      "Scalable architectures, clean systems, and performance-first development engineered for long-term growth.",
    icon: <HiLightningBolt />,
  },

  {
    title: "Human-Centered Design",
    description:
      "Beautiful interfaces crafted to feel intuitive, immersive, and emotionally engaging across every interaction.",
    icon: <HiSparkles />,
  },

  {
    title: "Reliability at Scale",
    description:
      "Enterprise-grade infrastructure built with security, stability, and future scalability at the core.",
    icon: <HiCheckCircle />,
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden py-28 px-6 bg-transparent"
    >

      {/* background atmosphere (Emerald/Cyan Mix) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_35%)]" />

      {/* noise */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')]" />

      {/* grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[80px_80px]" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* CENTERED HEADER & INTRO TEXT */}
        <div className="text-center max-w-4xl mx-auto mb-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex flex-col items-center gap-4 text-center"
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-2 text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              About Us
            </p>

            <p className="bg-gradient-to-r from-emerald-300 via-white to-cyan-300 bg-clip-text text-sm font-bold uppercase tracking-[0.25em] text-transparent">
              Innovating the Digital Future
            </p>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white leading-tight tracking-[-0.04em] mb-8"
          >
            Building
            <span className="text-gradient-emerald">
              {" "}Future-Ready
            </span>
            {" "}Digital Systems
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-5 text-lg leading-relaxed text-slate-300"
          >
            <p>
              At Nava Lumiq Tech, we are passionate about building digital
              solutions that empower businesses in the modern world. Our team
              specializes in software development, website design, mobile
              applications, cloud solutions, and digital innovation.
            </p>

            <p>
              We believe technology should be simple, scalable, and
              impactful. Whether you are a startup or an established
              business, Nava Lumiq Tech is committed to delivering reliable
              and future-ready IT services.
            </p>
          </motion.div>
        </div>

        {/* 2-COLUMN LOWER SECTION: VISUAL & PRINCIPLES */}
        <div className="grid lg:grid-cols-12 gap-16 items-center">

          {/* LEFT VISUAL */}
          <div
            data-gsap="fade-right"
            data-gsap-duration="0.9"
            className="relative lg:col-span-5"
          >

            {/* glow */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-500/10 blur-[140px] rounded-full" />

            {/* main card */}
            <div className="glass-card relative overflow-hidden rounded-[2.5rem]">
              {/* top light */}
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

              {/* content area */}
              <div className="relative aspect-square flex items-center justify-center">

                {/* rotating rings */}
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute w-[85%] h-[85%] rounded-full border border-dashed border-white/10"
                />

                <motion.div
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute w-[65%] h-[65%] rounded-full border border-white/5"
                />

                {/* center core */}
                <div className="relative z-10 flex flex-col items-center">

                  <div className="relative flex items-center justify-center w-40 h-40 rounded-4xl bg-linear-to-br from-cyan-400 to-violet-600 shadow-[0_0_80px_rgba(6,182,212,0.35)]">

                    <HiRocketLaunch size={56} className="text-white" />

                    {/* pulse */}
                    <div className="absolute inset-0 rounded-4xl border border-white/20 animate-ping" />

                  </div>

                  <div className="mt-4 text-center px-4">

                    <p className="text-xs uppercase tracking-[0.35em] text-cyan-400 font-bold mb-2">
                      Engineering The Future
                    </p>

                    <h3 className="text-2xl font-black text-white leading-tight">
                      Nava Lumiq Tech
                    </h3>

                  </div>

                </div>

                {/* floating cards */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}
                  className="absolute top-4 right-4 min-w-[90px] rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl px-4 py-3"
                >
                  <p className="text-2xl font-black text-white">
                    99%
                  </p>

                  <p className="text-[10px] uppercase tracking-[0.25em] text-cyan-400 mt-1">
                    Success Rate
                  </p>
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                  }}
                  className="absolute bottom-4 left-4 min-w-[90px] rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl px-4 py-3"
                >
                  <p className="text-2xl font-black text-white">
                    AI
                  </p>

                  <p className="text-[10px] uppercase tracking-[0.25em] text-violet-400 mt-1">
                    Powered Systems
                  </p>
                </motion.div>

              </div>

            </div>

          </div>

          {/* RIGHT CONTENT: PRINCIPLES */}
          <div
            data-gsap="fade-left"
            data-gsap-duration="0.9"
            className="lg:col-span-7"
          >

            {/* principles */}
            <div className="space-y-6">

              {principles.map((item, index) => (

                <motion.div
                  key={index}
                  whileHover={{
                    x: 8,
                  }}
                >

                  {/* hover glow */}
                  <div className="glass-card-hover rounded-2xl p-6 glass-card relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 to-emerald-400/0 transition-all duration-500 group-hover:from-cyan-400/5 group-hover:to-emerald-400/5" />
                    
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-2xl text-cyan-400 border border-cyan-400/20">
                      {item.icon}
                    </div>
                    
                    <h3 className="mb-3 text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h3>
                    
                    <p className="text-sm leading-relaxed text-slate-400">
                      {item.description}
                    </p>
                  </div>

                </motion.div>

              ))}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
