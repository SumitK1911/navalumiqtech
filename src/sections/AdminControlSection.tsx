"use client";

import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  HiArrowRight,
  HiBriefcase,
  HiChartBar,
  HiClipboardList,
  HiDocumentText,
  HiMail,
  HiUserGroup,
} from "react-icons/hi";

const adminModules = [
  {
    title: "Hiring",
    description: "Publish vacancies, review applicants, and assign developers.",
    icon: <HiBriefcase />,
  },
  {
    title: "Clients",
    description: "Track project requests, portal access, and account status.",
    icon: <HiUserGroup />,
  },
  {
    title: "Projects",
    description: "Monitor milestones, budgets, sprint status, and delivery risk.",
    icon: <HiClipboardList />,
  },
  {
    title: "Content",
    description: "Manage blogs, case studies, media, and public site updates.",
    icon: <HiDocumentText />,
  },
  {
    title: "Inquiries",
    description: "Capture leads from contact, developer requests, and portals.",
    icon: <HiMail />,
  },
  {
    title: "Analytics",
    description: "See business health across hiring, delivery, and marketing.",
    icon: <HiChartBar />,
  },
];

export default function AdminControlSection() {
  return (
    <section
      id="admin-panel"
      className="relative overflow-hidden bg-transparent px-6 py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_35%),radial-gradient(circle_at_bottom,rgba(52,211,153,0.08),transparent_35%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeading
          badge="Admin Panel"
          title="Operate the Whole Platform From One Place"
          description="Hiring, client portal activity, project delivery, inquiries, blogs, and media are designed as admin-controlled workflows."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {adminModules.map((module) => (
            <div key={module.title} className="p-6 rounded-3xl glass-card glass-card-hover relative overflow-hidden">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-2xl text-cyan-300">
                {module.icon}
              </div>
              <h3 className="text-xl font-black text-white">
                {module.title}
              </h3>
              <p className="mt-3 min-h-16 text-sm leading-relaxed text-gray-400">
                {module.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-3xl p-6 glass-card md:flex-row">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
              Control Center
            </p>
            <h3 className="mt-2 text-2xl font-black text-white">
              Admins can manage hiring, clients, projects, content, and leads.
            </h3>
          </div>

          <Link
            href="/admin"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-3 text-sm font-black text-black transition duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]"
          >
            Open Admin Panel
            <HiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
