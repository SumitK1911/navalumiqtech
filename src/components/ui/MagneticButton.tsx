"use client";

import { motion } from "framer-motion";
import { ReactNode, useState } from "react";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function MagneticButton({
  children,
  className = "",
  onClick,
}: MagneticButtonProps) {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  const handleMouseMove = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x =
      (e.clientX - rect.left - rect.width / 2) * 0.2;

    const y =
      (e.clientY - rect.top - rect.height / 2) * 0.2;

    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      data-cursor="false"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 12,
      }}
      className={className}
    >
      {children}
    </motion.button>
  );
}