"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  HiArrowRight,
  HiBriefcase,
  HiCash,
  HiLocationMarker,
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

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/vacancies")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unable to load vacancies.");
        }

        return res.json();
      })
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
    <main className="relative min-h-screen overflow-hidden bg-transparent px-6 py-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.10),transparent_55%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeading
          badge="Vacancies"
          title="Open Developer Roles"
          description="Apply for current Nava Lumiq Tech roles. Each application supports CV upload and is reviewed from the admin panel."
        />

        {loading ? (
          <div className="mt-20 rounded-4xl border border-white/10 bg-white/5 p-12 text-center text-white">
            Loading vacancies...
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
                  className="group relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-cyan-400/30"
                >
                  <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.10),transparent_60%)]" />

                  <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-3xl font-black text-white">
                        {job.title}
                      </h2>

                      <div className="mt-5 flex flex-wrap gap-5 text-sm text-gray-400">
                        <span className="flex items-center gap-2">
                          <HiLocationMarker className="text-cyan-400" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-2">
                          <HiBriefcase className="text-cyan-400" />
                          {job.type}
                        </span>
                        <span className="flex items-center gap-2">
                          <HiCash className="text-cyan-400" />
                          {job.salary}
                        </span>
                      </div>

                      <p className="mt-6 max-w-3xl text-gray-400">
                        {job.description}
                      </p>
                    </div>

                    <Link
                      href={`/vacancies/${job.slug}`}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-3 text-sm font-black text-black transition hover:bg-white"
                    >
                      Apply With CV
                      <HiArrowRight />
                    </Link>
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
