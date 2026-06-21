"use client";

interface SectionHeadingProps {
  badge: string;
  title: string;
  description: string;
  center?: boolean;
}

export default function SectionHeading({
  badge,
  title,
  description,
  center = true,
}: SectionHeadingProps) {
  return (
    <div className={`relative z-10 mb-20 ${center ? "text-center" : ""}`}>
      {/* Badge */}
      <div
        data-gsap="fade-up"
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-2"
      >
        <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
        <span className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
          {badge}
        </span>
      </div>

      {/* Title */}
      <h2
        data-gsap="fade-up"
        data-gsap-delay="0.1"
        className="text-[40px] md:text-5xl lg:text-6xl font-black text-gradient-emerald leading-[0.9]"
      >
        {title}
      </h2>

      {/* Gradient Line */}
      <div
        data-gsap="scale-in"
        data-gsap-delay="0.2"
        className={`mt-8 h-px w-40 bg-gradient-to-r from-cyan-400 via-emerald-400 to-transparent ${
          center ? "mx-auto" : ""
        }`}
      />

      {/* Description */}
      <p
        data-gsap="fade-up"
        data-gsap-delay="0.25"
        className={`text-soft mt-8 max-w-3xl text-lg ${center ? "mx-auto" : ""}`}
      >
        {description}
      </p>
    </div>
  );
}