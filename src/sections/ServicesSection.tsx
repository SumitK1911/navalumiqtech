"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/animations/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  HiCode,
  HiChip,
  HiLightningBolt,
  HiGlobeAlt,
  HiArrowRight,
  HiColorSwatch,
  HiPencilAlt,
  HiSparkles,
  HiTrendingUp,
} from "react-icons/hi";

type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const defaultServices: Service[] = [
  {
    id: "website-development",
    title: "Website Development",
    description:
      "Modern, responsive websites built for speed, clarity, and business growth.",
    icon: "code",
  },
  {
    id: "mobile-app-development",
    title: "Mobile App Development",
    description:
      "Reliable mobile applications for Android, iOS, and cross-platform products.",
    icon: "lightning",
  },
  {
    id: "software-solutions",
    title: "Software Solutions",
    description:
      "Custom software systems, dashboards, portals, and tools tailored to your workflow.",
    icon: "chip",
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    description:
      "Clean, user-friendly interfaces designed to make digital products easy to use.",
    icon: "design",
  },
  {
    id: "cloud-integration",
    title: "Cloud Integration",
    description:
      "Scalable cloud setup, deployment, and integrations for future-ready operations.",
    icon: "globe",
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    description:
      "Digital campaigns, content strategy, and online visibility that help your brand grow.",
    icon: "brand",
  },
  {
    id: "it-consulting",
    title: "IT Consulting",
    description:
      "Practical technology guidance for smarter decisions, smoother systems, and growth.",
    icon: "sparkles",
  },
  {
    id: "maintenance-support",
    title: "Maintenance & Support",
    description:
      "Ongoing updates, monitoring, fixes, and support to keep your systems running well.",
    icon: "lightning",
  },
];

const serviceIcons = {
  code: HiCode,
  chip: HiChip,
  lightning: HiLightningBolt,
  globe: HiGlobeAlt,
  design: HiColorSwatch,
  brand: HiPencilAlt,
  sparkles: HiSparkles,
};

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>(defaultServices);

  useEffect(() => {
    let active = true;

    async function loadServices() {
      try {
        const response = await fetch("/api/services");
        const data = await response.json();

        if (active && Array.isArray(data) && data.length > 0) {
          setServices(data);
        }
      } catch {
        setServices(defaultServices);
      }
    }

    void loadServices();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-transparent px-6 py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(34,211,238,0.1),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(52,211,153,0.1),transparent_32%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-size-[56px_56px] opacity-30" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] opacity-[0.025]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeading
          badge="Services"
          title="Productized Engineering Systems"
          description="Every service is designed like a product experience: strategic, visual, measurable, and engineered for scale."
        />

        <div
          data-gsap="fade-up"
          data-gsap-stagger="0.08"
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
        >
          {services.map((service, index) => {
            const Icon =
              serviceIcons[service.icon as keyof typeof serviceIcons] ??
              HiSparkles;

            return (
              <Reveal key={service.id} delay={index * 0.1}>
                <div className="glass-card-hover rounded-3xl p-8 glass-card group flex h-full flex-col relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 to-emerald-400/0 transition-all duration-500 group-hover:from-cyan-400/5 group-hover:to-emerald-400/5" />
                  
                  {/* Icon container */}
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl text-cyan-400 border border-cyan-400/20">
                    <Icon />
                  </div>

                  <h3 className="mb-4 text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {service.title}
                  </h3>

                  <p className="mb-8 text-sm leading-relaxed text-slate-400">
                    {service.description}
                  </p>

                  <div className="mt-auto flex items-center font-semibold text-cyan-400 transition-colors group-hover:text-cyan-300">
                    <span className="text-sm">Learn more</span>
                    <HiArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-14 text-center">
          <MagneticButton>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/30 hover:bg-white/10"
            >
              Discuss a project
              <HiArrowRight />
            </a>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
