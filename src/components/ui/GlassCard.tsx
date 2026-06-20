"use client";

import { motion } from "framer-motion";

type GlassCardProps = {
  children: React.ReactNode;

  className?: string;

  hover?: boolean;
};

export default function GlassCard({
  children,
  className = "",
  hover = true,
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={
        hover
          ? {
              y: -8,
              scale: 1.01,
            }
          : undefined
      }
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
      className={`
        relative
        overflow-hidden
        rounded-4xl
        border
        border-white/10
        bg-white/4
        backdrop-blur-2xl
        shadow-[0_10px_40px_rgba(0,0,0,0.35)]
        ${className}
      `}
    >
      {/* top border glow */}
      <div
        className="
          absolute
          inset-x-0
          top-0
          h-px
          bg-linear-to-r
          from-transparent
          via-white/20
          to-transparent
        "
      />

      {/* hover glow */}
      <div
        className="
          absolute
          inset-0
          opacity-0
          transition-opacity
          duration-500
          hover:opacity-100
          bg-linear-to-br
          from-cyan-500/10
          to-violet-500/10
        "
      />

      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
}