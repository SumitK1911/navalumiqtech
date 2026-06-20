"use client";

import Link from "next/link";
import Reveal from "@/components/animations/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  HiArrowRight,
  HiChatAlt2,
  HiCheckCircle,
  HiClock,
  HiDocumentReport,
  HiFolderOpen,
  HiShieldCheck,
} from "react-icons/hi";

const portalFeatures = [
  {
    title: "Marketing calendar",
    description:
      "Track monthly posts, reels, festival creatives, campaign dates, and approval status in one place.",
    icon: <HiClock />,
  },
  {
    title: "Creative approvals",
    description:
      "Review graphic posts, captions, reels, brand assets, reports, and design revisions before publishing.",
    icon: <HiFolderOpen />,
  },
  {
    title: "Campaign communication",
    description:
      "Keep ad notes, SEO updates, content feedback, and delivery conversations attached to your package.",
    icon: <HiChatAlt2 />,
  },
];

const activity = [
  "Monthly content calendar approved",
  "Reel concepts assigned to creative team",
  "Meta ads campaign in optimization",
  "Insight report pending review",
];

export default function ClientPortalSection() {
  return (
    <section
      id="client-portal"
      className="relative overflow-hidden bg-transparent px-6 py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_38%),radial-gradient(circle_at_75%_30%,rgba(52,211,153,0.08),transparent_30%)]" />
      <div className="absolute inset-0 bg-mesh opacity-40" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeading
          badge="Client Portal"
          title="Manage Every Marketing Deliverable"
          description="A dedicated portal helps clients follow package progress, share brand assets, approve content, and review campaign performance."
        />

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="grid gap-5">
            {portalFeatures.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 0.12}>
                <div className="p-6 rounded-3xl glass-card glass-card-hover relative overflow-hidden">
                  <div className="flex gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 text-2xl text-emerald-200">
                      {feature.icon}
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="p-5 md:p-8 rounded-3xl glass-card relative overflow-hidden">
            <div className="rounded-3xl border border-white/5 bg-[#020b24]/40 p-5 md:p-7">
              <div className="flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
                    Client Workspace
                  </p>
                  <h3 className="mt-3 text-2xl font-black text-white md:text-4xl">
                    Premium Marketing Package
                  </h3>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-bold text-emerald-200">
                  <HiShieldCheck />
                  Secure
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  ["Package", "Rs. 29,999"],
                  ["Progress", "68%"],
                  ["Reels", "8 / 12"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/5 bg-[#020b24]/40 p-4 hover:border-cyan-500/20 transition-all duration-300"
                  >
                    <p className="text-xs uppercase tracking-[0.24em] text-gray-500">
                      {label}
                    </p>
                    <p className="mt-2 text-2xl font-black text-white">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/5 bg-[#020b24]/40 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-bold text-white">
                    Marketing activity
                  </p>
                  <HiDocumentReport className="text-cyan-300" />
                </div>

                <div className="space-y-3">
                  {activity.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-gray-300"
                    >
                      <HiCheckCircle className="shrink-0 text-emerald-300" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/client-portal"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-3 text-sm font-black text-black transition duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]"
                >
                  Open Portal Preview
                  <HiArrowRight />
                </Link>
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center rounded-full border border-cyan-500/20 bg-[#020b24]/40 px-6 py-3 text-sm font-bold text-white transition duration-300 hover:border-cyan-400/50 hover:bg-[#020b24]/60 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                >
                  Manage in Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
