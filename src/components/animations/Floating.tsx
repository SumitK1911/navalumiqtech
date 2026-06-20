"use client";

import { motion } from "framer-motion";

type FloatingProps = {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  yOffset?: number;
};

export default function Floating({
  children,
  className = "",
  duration = 8,
  yOffset = 12,
}: FloatingProps) {

  return (

    <motion.div
      animate={{
        y: [
          0,
          -yOffset,
          0,
        ],
      }}

      transition={{
        duration,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}

      className={className}
    >

      {children}

    </motion.div>

  );
}