"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

import {
  SiNextdotjs,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiPrisma,
  SiSupabase,
  SiPostgresql,
  SiOpenai,
  SiFirebase,
  SiVercel,
  SiDocker,
} from "react-icons/si";

import { TbBrandAws } from "react-icons/tb";

type TechItem = {
  name: string;
  icon: string;
};

type TechStack = {
  id?: string;
  category: string;
  items: TechItem[];
};

type SectionItem = {
  id: string;
  title: string;
  metadata: unknown;
};

const defaultStacks: TechStack[] = [
  {
    category: "Frontend Engineering",
    items: [
      { name: "Next.js", icon: "next" },
      { name: "React", icon: "react" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Tailwind", icon: "tailwind" },
    ],
  },
  {
    category: "Backend Systems",
    items: [
      { name: "Prisma", icon: "prisma" },
      { name: "Supabase", icon: "supabase" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "Firebase", icon: "firebase" },
    ],
  },
  {
    category: "AI & Infrastructure",
    items: [
      { name: "OpenAI", icon: "openai" },
      { name: "Vercel", icon: "vercel" },
      { name: "Docker", icon: "docker" },
      { name: "AWS", icon: "aws" },
    ],
  },
];

const techIcons = {
  next: SiNextdotjs,
  react: SiReact,
  typescript: SiTypescript,
  tailwind: SiTailwindcss,
  prisma: SiPrisma,
  supabase: SiSupabase,
  postgresql: SiPostgresql,
  openai: SiOpenai,
  firebase: SiFirebase,
  vercel: SiVercel,
  docker: SiDocker,
  aws: TbBrandAws,
};

function getTechItems(metadata: unknown): TechItem[] {
  if (
    metadata &&
    typeof metadata === "object" &&
    "items" in metadata &&
    Array.isArray((metadata as { items: unknown }).items)
  ) {
    return (metadata as { items: unknown[] }).items
      .map((item) => {
        if (!item || typeof item !== "object") return null;

        const source = item as Record<string, unknown>;
        return {
          name: String(source.name || "").trim(),
          icon: String(source.icon || "react").trim(),
        };
      })
      .filter((item): item is TechItem => Boolean(item?.name));
  }

  return [];
}

export default function TechStackSection() {
  const [stacks, setStacks] = useState<TechStack[]>(defaultStacks);

  useEffect(() => {
    let active = true;

    async function loadStacks() {
      try {
        const response = await fetch("/api/section-items?section=tech-stack");
        const data = await response.json();

        if (active && Array.isArray(data) && data.length > 0) {
          setStacks(
            data.map((item: SectionItem) => ({
              id: item.id,
              category: item.title,
              items: getTechItems(item.metadata),
            }))
          );
        }
      } catch {
        setStacks(defaultStacks);
      }
    }

    void loadStacks();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="tech-stack"
      className="relative py-28 px-6 overflow-hidden bg-transparent"
    >
      {/* background atmosphere (Emerald/Cyan Mix) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.08),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(34,211,238,0.06),transparent_60%)]" />
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-size-[60px_60px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeading
          badge="Technologies"
          title="Built on Modern Systems"
          description="We design and engineer scalable digital systems using battle-tested technologies optimized for performance, reliability, and future growth."
        />

        <div className="relative space-y-14">
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px bg-linear-to-b from-transparent via-cyan-200/20 to-transparent lg:block" />
          {stacks.map((stack, index) => (
            <motion.div
              key={stack.id || stack.category}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className="pointer-events-none absolute left-1/2 top-16 hidden h-px w-1/2 bg-linear-to-r from-cyan-200/16 to-transparent lg:block" />
              <div className="flex items-center gap-6 mb-8">
                <h3 className="text-xl md:text-2xl font-semibold text-white">
                  {stack.category}
                </h3>

                <div className="h-px flex-1 bg-linear-to-r from-white/20 to-transparent" />
              </div>

              <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                {stack.items.map((tech, itemIndex) => {
                  const Icon =
                    techIcons[tech.icon as keyof typeof techIcons] ?? SiReact;

                  return (
                    <motion.div
                      key={tech.name}
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 5 + itemIndex * 0.2,
                        delay: itemIndex * 0.14,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      whileHover={{ scale: 1.05 }}
                      className="group relative rounded-2xl glass-card glass-card-hover px-5 py-4"
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.12),transparent_60%)]" />
                      <span className="absolute left-1/2 top-0 h-8 w-px -translate-y-full bg-linear-to-b from-transparent to-cyan-200/20" />

                      <div className="relative flex items-center gap-3">
                        <span className="text-xl text-cyan-300 drop-shadow-[0_0_14px_rgba(34,211,238,0.35)] transition-transform duration-300 group-hover:scale-110">
                          <Icon />
                        </span>

                        <span className="text-sm font-medium text-white/80 group-hover:text-white transition">
                          {tech.name}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-sm text-white/40">
            Built with production-grade architecture - Scalable by design -
            Optimized for performance
          </p>
        </div>
      </div>
    </section>
  );
}
