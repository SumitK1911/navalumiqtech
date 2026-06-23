"use client";

import { motion } from "framer-motion";

import BrandLogo from "@/components/BrandLogo";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 bg-transparent flex flex-col items-center justify-center">

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex items-center justify-center"
      >
        <BrandLogo width={200} />
      </motion.div>

      {/* Loader */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        className="mt-10 w-16 h-16 rounded-full border-4 border-cyan-400 border-t-transparent"
      />

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-gray-400 tracking-[0.3em] uppercase text-sm"
      >
        Engineering Digital Excellence
      </motion.p>
    </div>
  );
}
