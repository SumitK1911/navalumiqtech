"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Reveal from "@/components/animations/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

type CaseStudy = {
  id?: string;
  title: string;
  category: string;
  challenge: string;
  solution: string;
  result: string;
  technologies: string[];
  image: string;
};

type SectionItem = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image: string | null;
  metadata: unknown;
};

const defaultCaseStudies: CaseStudy[] = [
  {
    title: "Enterprise SaaS Dashboard",
    category: "Web Platform",
    challenge:
      "The client needed a scalable analytics dashboard capable of handling large datasets with real-time insights.",
    solution:
      "We engineered a modern Next.js dashboard with optimized APIs, advanced data visualization, and enterprise authentication.",
    result:
      "Reduced operational workload by 45% and improved reporting efficiency dramatically.",
    technologies: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "AI Automation System",
    category: "Artificial Intelligence",
    challenge:
      "Manual workflows were slowing business operations and increasing operational costs.",
    solution:
      "We built AI-powered automation pipelines integrated with modern APIs and intelligent workflow systems.",
    result:
      "Saved hundreds of work hours monthly while increasing operational speed and consistency.",
    technologies: ["OpenAI", "Node.js", "Supabase", "Automation"],
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Mobile Commerce Platform",
    category: "Mobile Application",
    challenge:
      "The business required a high-performance mobile commerce platform with seamless UX.",
    solution:
      "We designed and developed a scalable mobile-first ecosystem with premium UI and optimized performance.",
    result:
      "Boosted user engagement and significantly improved mobile conversion rates.",
    technologies: ["React Native", "Firebase", "Stripe", "Cloud Functions"],
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1400&auto=format&fit=crop",
  },
];

const caseMetrics = ["-45%", "+80%", "+3.2x"];

function getMetadataValue(metadata: unknown, key: string) {
  if (!metadata || typeof metadata !== "object") return "";
  const value = (metadata as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "";
}

function getTechnologies(metadata: unknown) {
  if (!metadata || typeof metadata !== "object") return [];
  const value = (metadata as Record<string, unknown>).technologies;
  return Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean)
    : [];
}

export default function CaseStudiesSection() {
  const [caseStudies, setCaseStudies] =
    useState<CaseStudy[]>(defaultCaseStudies);

  useEffect(() => {
    let active = true;

    async function loadCaseStudies() {
      try {
        const response = await fetch(
          "/api/section-items?section=case-studies"
        );
        const data = await response.json();

        if (active && Array.isArray(data) && data.length > 0) {
          setCaseStudies(
            data.map((item: SectionItem) => ({
              id: item.id,
              title: item.title,
              category: item.subtitle || "Case Study",
              challenge: item.description || "",
              solution: getMetadataValue(item.metadata, "solution"),
              result: getMetadataValue(item.metadata, "result"),
              technologies: getTechnologies(item.metadata),
              image: item.image || "/projects/project1.jpg",
            }))
          );
        }
      } catch {
        setCaseStudies(defaultCaseStudies);
      }
    }

    void loadCaseStudies();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="case-studies"
      className="relative overflow-hidden bg-transparent px-6 py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_34%),radial-gradient(circle_at_10%_60%,rgba(52,211,153,0.08),transparent_30%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] opacity-[0.025]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeading
          badge="Case Studies"
          title="Enterprise Outcomes"
          description="Investor-grade snapshots of the challenge, delivery model, and commercial lift behind our work."
        />

        {/* Landscape card stack */}
        <div className="flex flex-col gap-6">
          {caseStudies.map((study, index) => (
            <Reveal key={study.id || study.title} delay={index * 0.12}>
              <div className="group overflow-hidden rounded-3xl glass-card glass-card-hover">
                <div className={`flex flex-col md:flex-row ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>

                  {/* ── Image side ── */}
                  <div className="relative h-64 w-full shrink-0 overflow-hidden md:h-auto md:w-80 lg:w-96">
                    <Image
                      src={study.image}
                      alt={study.title}
                      fill
                      sizes="(min-width: 768px) 384px, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    {/* gradient toward content side */}
                    <div className={`absolute inset-0 hidden md:block ${index % 2 !== 0 ? "bg-linear-to-l from-transparent to-[#020b24]/60" : "bg-linear-to-r from-transparent to-[#020b24]/60"}`} />
                    <div className="absolute inset-0 bg-linear-to-t from-[#020b24]/80 via-transparent to-transparent md:hidden" />

                    {/* Category badge */}
                    <span className="absolute left-4 top-4 rounded-full border border-white/12 bg-black/50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-cyan-200 backdrop-blur-xl">
                      {study.category}
                    </span>

                    {/* Metric badge */}
                    <div className="absolute bottom-4 left-4 rounded-full border border-cyan-200/20 bg-black/50 px-4 py-2 text-xs font-black uppercase tracking-normal text-cyan-100 backdrop-blur-xl">
                      Result {caseMetrics[index % caseMetrics.length]}
                    </div>
                  </div>

                  {/* ── Content side ── */}
                  <div className="flex flex-1 flex-col justify-center p-7 lg:p-9">
                    <h3 className="text-2xl font-black leading-tight text-white lg:text-3xl">
                      {study.title}
                    </h3>

                    {/* Info grid */}
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {[
                        ["Problem", study.challenge],
                        ["Solution", study.solution],
                        ["Technology", study.technologies.join(" / ") || "—"],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-2xl border border-white/5 bg-[#020b24]/40 p-4 hover:border-cyan-500/20 transition-all duration-300"
                        >
                          <p className="text-[10px] font-black uppercase tracking-normal text-slate-500">
                            {label}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-slate-200">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Result highlight */}
                    <p className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm leading-relaxed text-emerald-200">
                      {study.result}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
