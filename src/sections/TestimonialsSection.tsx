"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import {
  HiStar,
  HiArrowRight,
} from "react-icons/hi";

import Reveal from "@/components/animations/Reveal";

import SectionHeading from "@/components/ui/SectionHeading";

import MagneticButton from "@/components/ui/MagneticButton";

type Testimonial = {
  id?: string;
  name: string;
  role: string;
  image: string;
  review: string;
};

type SectionItem = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image: string | null;
};

const defaultTestimonials: Testimonial[] = [
  {
    name: "Aarav Sharma",
    role: "Founder, NovaEdge",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
    review:
      "Nava Lumiq Tech transformed our vision into a premium digital platform. Their attention to detail and engineering quality exceeded expectations.",
  },

  {
    name: "Sophia Williams",
    role: "Marketing Director, ElevateX",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    review:
      "The team delivered an exceptional experience from strategy to launch. The interface quality and performance were simply world-class.",
  },

  {
    name: "Daniel Kim",
    role: "CEO, Nexora Labs",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
    review:
      "Their ability to combine aesthetics with scalable engineering is remarkable. Nava Lumiq feels like a true technology partner.",
  },
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(defaultTestimonials);

  useEffect(() => {
    let active = true;

    async function loadTestimonials() {
      try {
        const response = await fetch(
          "/api/section-items?section=testimonials"
        );
        const data = await response.json();

        if (active && Array.isArray(data) && data.length > 0) {
          setTestimonials(
            data.map((item: SectionItem) => ({
              id: item.id,
              name: item.title,
              role: item.subtitle || "",
              image: item.image || "/avatars/client1.svg",
              review: item.description || "",
            }))
          );
        }
      } catch {
        setTestimonials(defaultTestimonials);
      }
    }

    void loadTestimonials();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden py-32 px-6 bg-transparent"
    >

      {/* atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(52,211,153,0.08),transparent_30%)]" />

      {/* noise */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')]" />

      {/* grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[70px_70px]" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* heading */}
        <SectionHeading
          badge="TESTIMONIALS"
          title="Trusted By Visionary Brands"
          description="We partner with ambitious businesses to create premium digital experiences that drive growth, innovation, and long-term impact."
        />

        {/* cards */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {testimonials.map((testimonial, index) => (

            <Reveal
              key={testimonial.id || testimonial.name}
              delay={index * 0.15}
            >

              <motion.div
                whileHover={{
                  y: -10,
                }}
                transition={{
                  duration: 0.35,
                }}
                className="group relative overflow-hidden rounded-3xl glass-card glass-card-hover p-8"
              >

                {/* glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08),transparent_60%)]" />

                {/* top light */}
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

                {/* stars */}
                <div className="relative flex items-center gap-1 mb-8 text-amber-400">

                  {[...Array(5)].map((_, i) => (

                    <HiStar
                      key={i}
                      className="text-lg"
                    />

                  ))}

                </div>

                {/* review */}
                <p className="relative text-slate-300 leading-relaxed text-lg mb-10">
                  “{testimonial.review}”
                </p>

                {/* user */}
                <div className="relative flex items-center gap-4">

                  <div className="relative h-14 w-14 overflow-hidden rounded-full border border-white/10">

                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />

                  </div>

                  <div>

                    <h4 className="text-white font-bold">
                      {testimonial.name}
                    </h4>

                    <p className="text-sm text-cyan-400">
                      {testimonial.role}
                    </p>

                  </div>

                </div>

              </motion.div>

            </Reveal>

          ))}

        </div>


        {/* cta */}
        <div className="mt-20 flex justify-center">

          <a href="#contact">

            <MagneticButton
              className="inline-flex items-center gap-3 rounded-full border border-cyan-500/20 bg-[#020b24]/40 px-8 py-4 text-sm font-semibold text-white transition duration-300 hover:border-cyan-400/50 hover:bg-[#020b24]/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)]"
            >

              Work With Nava Lumiq

              <HiArrowRight />

            </MagneticButton>

          </a>

        </div>

      </div>

    </section>
  );
}
