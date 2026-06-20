"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { HiArrowRight } from "react-icons/hi";
import Reveal from "@/components/animations/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import MagneticButton from "@/components/ui/MagneticButton";

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  result: string;
};

const defaultProjects: Project[] = [
  {
    id: "commerce-platform",
    title: "Commerce Platform",
    image: "/projects/project1.jpg",
    description:
      "A fast commerce experience with admin content tools and client workflows.",
    result: "Cleaner operations and faster order management.",
  },
  {
    id: "ai-support-agent",
    title: "AI Support Agent",
    image: "/projects/project2.jpg",
    description:
      "An AI assistant connected to business knowledge and customer requests.",
    result: "Reduced repetitive support work and faster replies.",
  },
];



export default function PortfolioSection() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();

        if (active && Array.isArray(data) && data.length > 0) {
          setProjects(data.slice(0, 3));
        }
      } catch {
        setProjects(defaultProjects);
      }
    }

    void loadProjects();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="portfolio"
      className="relative overflow-hidden bg-transparent px-6 py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_34%),radial-gradient(circle_at_10%_60%,rgba(52,211,153,0.08),transparent_30%)]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.025]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeading
          badge="Projects"
          title="Completed Projects"
          description="A selection of our delivered projects, engineered for performance, scale, and clear business outcomes."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => {
            return (
            <Reveal
              key={project.id}
              delay={index * 0.1}
            >
              <div className="group overflow-hidden rounded-3xl glass-card glass-card-hover">
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#020b24] via-black/20 to-transparent" />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-black text-white">
                    {project.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-gray-400">
                    {project.description}
                  </p>
                  <p className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-200">
                    {project.result}
                  </p>
                </div>
              </div>
            </Reveal>
            );
          })}
        </div>

        <div className="mt-14 flex justify-center">
          <MagneticButton>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 rounded-full border border-cyan-500/20 bg-[#020b24]/40 px-8 py-4 text-sm font-semibold text-white transition duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:bg-[#020b24]/60"
            >
              Start your project
              <HiArrowRight />
            </a>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
