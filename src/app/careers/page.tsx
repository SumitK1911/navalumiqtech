"use client";

import { useEffect, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  HiLocationMarker,
  HiBriefcase,
  HiCash,
  HiArrowRight,
  HiClipboardCheck,
  HiShieldCheck,
  HiUserGroup,
} from "react-icons/hi";

type Vacancy = {
  id: string;
  slug: string;
  title: string;
  location: string;
  type: string;
  salary: string;
  description: string;
};

export default function CareersPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/vacancies")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        setVacancies(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.message || "Unable to load vacancies.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (

    <main className="relative min-h-screen overflow-hidden bg-[#050816] px-6 pb-32 pt-40 text-white">

      {/* atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.14),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.12),transparent_38%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-size-[64px_64px] opacity-40" />

      <div className="max-w-6xl mx-auto relative z-10">

        <SectionHeading
          badge="Careers"
          title="Build the Future With Us"
          description="A modern hiring portal for product-minded engineers, designers, and operators who want to ship premium technology for ambitious companies."
        />

        <div className="mb-16 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Culture",
              copy: "Small team, high trust, sharp standards.",
              icon: HiUserGroup,
            },
            {
              title: "Benefits",
              copy: "Flexible work, growth loops, meaningful ownership.",
              icon: HiShieldCheck,
            },
            {
              title: "Application Flow",
              copy: "Apply, portfolio review, interview, paid trial.",
              icon: HiClipboardCheck,
            },
          ].map(({ title, copy, icon: Icon }) => (
            <div
              key={title}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-2xl"
            >
              <Icon className="mb-5 text-2xl text-cyan-300" />
              <h3 className="text-xl font-black text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{copy}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="mt-20 rounded-4xl border border-white/10 bg-white/5 p-12 text-center text-white">
            Loading careers...
          </div>
        ) : error ? (
          <div className="mt-20 rounded-4xl border border-white/10 bg-white/5 p-12 text-center text-red-300">
            {error}
          </div>
        ) : (
          <div className="grid gap-8">
            {vacancies.map((job) => {
              return (
                <div
                  key={job.id}
                  className="group relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/30"
                >
                  {/* glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.10),transparent_60%)]" />

                  <div className="relative z-10">

                    <h3 className="text-3xl font-black text-white">
                      {job.title}
                    </h3>

                    <div className="mt-5 flex flex-wrap gap-5 text-sm text-gray-400">

                      <div className="flex items-center gap-2">
                        <HiLocationMarker className="text-cyan-400" />
                        {job.location}
                      </div>

                      <div className="flex items-center gap-2">
                        <HiBriefcase className="text-cyan-400" />
                        {job.type}
                      </div>

                      <div className="flex items-center gap-2">
                        <HiCash className="text-cyan-400" />
                        {job.salary}
                      </div>

                    </div>

                    <p className="mt-6 max-w-3xl text-gray-400 leading-relaxed">
                      {job.description}
                    </p>

                    <a
                      href={`/careers/${job.slug}`}
                      className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/30 hover:bg-white/10"
                    >
                      Apply Now
                      <HiArrowRight />
                    </a>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

    </main>
  );
}
