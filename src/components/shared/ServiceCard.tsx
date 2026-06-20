"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { HiCode } from "react-icons/hi";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
}

export default function ServiceCard({ title, description, icon, color }: ServiceCardProps) {
  return (
    <motion.article
      whileHover={{ y: -10, rotateY: 8, rotateX: -5 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group relative"
      style={{ perspective: 1200 }}
    >
      <div className={`rounded-[2.5rem] bg-linear-to-br ${color} p-[1.5px] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_30px_120px_rgba(56,189,248,0.18)]`}>
        <div className="relative overflow-hidden rounded-[2.4rem] bg-slate-950/95 p-10 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
          <div className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-linear-to-br ${color} opacity-20 blur-3xl`} />
          <div className="relative z-10 flex flex-col gap-8">
            <div className="relative z-10 mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-slate-950 shadow-[0_25px_80px_rgba(59,130,246,0.28)] transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-6">
              <div className={`absolute inset-0 rounded-[1.75rem] bg-linear-to-br ${color} opacity-20 blur-2xl`} />
              <div className="relative z-10 text-4xl text-white">{icon}</div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white transition-colors duration-500 group-hover:text-cyan-300">
                {title}
              </h3>
              <p className="text-gray-400 leading-relaxed text-base">{description}</p>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <span className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300 opacity-90">Premium</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-cyan-300 opacity-80 transition-all duration-300 group-hover:opacity-100">
                Learn more <HiCode className="text-lg transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
