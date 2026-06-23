"use client";

import Link from "next/link";
import Reveal from "@/components/animations/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  HiArrowRight,
  HiBadgeCheck,
  HiBriefcase,
  HiClipboardCheck,
  HiDocumentSearch,
  HiOfficeBuilding,
  HiUsers,
} from "react-icons/hi";

const applicationSteps = [
  {
    title: "Explore openings",
    description:
      "Review active vacancies and choose the role that fits your strengths.",
    icon: <HiClipboardCheck />,
  },
  {
    title: "Submit your profile",
    description:
      "Send your CV, portfolio, and a short note about the work you enjoy.",
    icon: <HiUsers />,
  },
  {
    title: "Interview and trial",
    description:
      "Meet the team, discuss expectations, and complete a practical paid trial.",
    icon: <HiDocumentSearch />,
  },
];

const roleTracks = [
  "Frontend Engineers",
  "Full-stack Developers",
  "AI Automation Builders",
  "Mobile App Developers",
  "UI/UX Designers",
  "Cloud & DevOps Talent",
];

const careersHref = "/careers";

export default function HireDevelopersSection() {
  return (
    <section
      id="careers"
      className="relative overflow-hidden bg-transparent px-6 py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.08),transparent_32%),radial-gradient(circle_at_80%_65%,rgba(52,211,153,0.08),transparent_28%)]" />
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeading
          badge="Careers"
          title="Join the Team Building Premium Digital Products"
          description="Explore current vacancies at Nava Lumiq Tech and apply for roles across engineering, design, automation, and product delivery."
        />

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <div className="p-8 md:p-10 rounded-3xl glass-card relative overflow-hidden">
            <div className="flex h-full flex-col justify-between gap-10">
              <div>
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-3xl text-cyan-300">
                  <HiOfficeBuilding />
                </div>

                <h3 className="max-w-xl text-3xl font-black leading-tight text-white md:text-5xl">
                  See open roles and apply to work with us.
                </h3>

                <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-400 md:text-lg">
                  We are looking for people who care about clean execution,
                  thoughtful design, reliable systems, and shipping useful
                  products for real businesses.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {roleTracks.map((role) => (
                  <div
                    key={role}
                    className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#020b24]/40 px-4 py-3 text-sm font-semibold text-white hover:border-cyan-500/20 transition-all duration-300"
                  >
                    <HiBadgeCheck className="shrink-0 text-cyan-300" />
                    {role}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href={careersHref}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-3 text-sm font-black text-black transition duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]"
                >
                  View Open Careers
                  <HiArrowRight />
                </Link>

                <Link
                  href="/vacancies"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-500/20 bg-[#020b24]/40 px-6 py-3 text-sm font-bold text-white transition duration-300 hover:border-cyan-400/50 hover:bg-[#020b24]/60 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                >
                  Browse Vacancies
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            {applicationSteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.12}>
                <div className="p-6 md:p-7 rounded-3xl glass-card glass-card-hover relative overflow-hidden">
                  <div className="flex gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-teal-300/20 bg-teal-300/10 text-2xl text-teal-200">
                      {step.icon}
                    </div>

                    <div>
                      <p className="mb-2 text-xs font-black uppercase tracking-[0.28em] text-gray-500">
                        Step {index + 1}
                      </p>
                      <h4 className="text-xl font-black text-white">
                        {step.title}
                      </h4>
                      <p className="mt-2 text-sm leading-relaxed text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}

            <div className="p-6 rounded-3xl glass-card relative overflow-hidden border-cyan-400/30">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300 text-xl text-black">
                  <HiBriefcase />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Applications reviewed by the team
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    Every application is tracked from the admin panel so our
                    team can review profiles, CVs, interviews, and next steps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
