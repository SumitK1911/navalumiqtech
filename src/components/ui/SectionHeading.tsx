"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  badge: string;
  title: string;
  description: string;
  center?: boolean;
}

export default function SectionHeading({
  badge,
  title,
  description,
  center = true,
}: SectionHeadingProps) {
  return (
    <div
      className={`relative z-10 mb-20 ${
        center ? "text-center" : ""
      }`}
    >
      {/* Badge */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        viewport={{ once: true }}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-2"
      >
        <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />

        <span className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
          {badge}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{
          opacity: 0,
          y: 30,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          delay: 0.1,
        }}
        viewport={{ once: true }}
        className="text-[40px] md:text-5xl lg:text-6xl font-black text-gradient-emerald leading-[0.9]"
      >
        {title}
      </motion.h2>

      {/* Gradient Line */}
      <motion.div
        initial={{
          opacity: 0,
          scaleX: 0,
        }}
        whileInView={{
          opacity: 1,
          scaleX: 1,
        }}
        transition={{
          duration: 0.7,
          delay: 0.2,
        }}
        viewport={{ once: true }}
        className={`mt-8 h-px w-40 bg-gradient-to-r from-cyan-400 via-emerald-400 to-transparent ${
          center ? "mx-auto" : ""
        }`}
      />

      {/* Description */}
      <motion.p
        initial={{
          opacity: 0,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          delay: 0.3,
        }}
        viewport={{ once: true }}
        className={`text-soft mt-8 max-w-3xl text-lg ${
          center ? "mx-auto" : ""
        }`}
      >
        {description}
      </motion.p>
    </div>
  );
}