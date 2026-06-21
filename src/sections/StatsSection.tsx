"use client";

import CountUp from "react-countup";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

type Stat = {
  id?: string;
  number: number;
  suffix: string;
  title: string;
};

type SectionItem = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
};

const defaultStats: Stat[] = [
  {
    number: 50,
    suffix: "+",
    title: "Projects Delivered",
  },
  {
    number: 20,
    suffix: "+",
    title: "Global Clients",
  },
  {
    number: 10,
    suffix: "+",
    title: "Core Technologies",
  },
  {
    number: 99,
    suffix: "%",
    title: "Client Satisfaction",
  },
];

export default function StatsSection() {
  const [stats, setStats] = useState<Stat[]>(defaultStats);

  useEffect(() => {
    let active = true;

    async function loadStats() {
      try {
        const response = await fetch("/api/section-items?section=stats");
        const data = await response.json();

        if (active && Array.isArray(data) && data.length > 0) {
          setStats(
            data.map((item: SectionItem) => ({
              id: item.id,
              number: Number(item.title) || 0,
              suffix: item.subtitle || "",
              title: item.description || "",
            }))
          );
        }
      } catch {
        setStats(defaultStats);
      }
    }

    void loadStats();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="relative py-28 px-6 overflow-hidden bg-transparent">

      {/* ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.08),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.06),transparent_60%)]" />
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeading
          badge="Performance"
          title="Measurable Impact"
          description="Real engineering outcomes delivered across scalable systems and enterprise platforms."
        />

        {/* GRID */}
        <div
          data-gsap="fade-up"
          data-gsap-stagger="0.1"
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >

          {stats.map((stat, index) => (
            <motion.div
              key={stat.id || stat.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >

              {/* glow */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.12),transparent_70%)]" />

              {/* card */}
              <div className="p-10 rounded-3xl text-center glass-card glass-card-hover relative overflow-hidden">
                {/* top accent line */}
                <div className="absolute top-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r from-cyan-400 to-emerald-400" />

                {/* number */}
                <h3 className="text-5xl md:text-6xl font-black text-cyan-400 tracking-tight">
                  <CountUp end={stat.number} duration={2.5} />
                  {stat.suffix}
                </h3>

                {/* label */}
                <p className="mt-4 text-gray-300 font-medium tracking-wide">
                  {stat.title}
                </p>

                {/* floating highlight dot */}
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-cyan-400 opacity-60 group-hover:opacity-100 transition" />

              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}
