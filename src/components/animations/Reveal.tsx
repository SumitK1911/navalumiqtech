"use client";

import { motion } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  blur?: boolean;
  width?: "fit-content" | "100%";
  from?: "bottom" | "left" | "right";
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
  blur = true,
  width = "100%",
  from = "bottom",
}: RevealProps) {

  const getInitialPosition = () => {

    switch (from) {

      case "left":
        return { x: -60, y: 0 };

      case "right":
        return { x: 60, y: 0 };

      default:
        return { x: 0, y: 60 };
    }
  };

  const initialPosition =
    getInitialPosition();

  return (

    <motion.div
      initial={{
        opacity: 0,
        ...initialPosition,
        filter: blur
          ? "blur(12px)"
          : "blur(0px)",
      }}

      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        filter: "blur(0px)",
      }}

      viewport={{
        once: true,
        amount: 0.15,
      }}

      transition={{
        duration: 1,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}

      style={{
        width,
      }}

      className={className}
    >

      {children}

    </motion.div>

  );
}