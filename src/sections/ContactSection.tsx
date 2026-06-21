"use client";

import { useState } from "react";
import {
  HiCheckCircle,
  HiLocationMarker,
  HiMail,
  HiPaperAirplane,
  HiPhone,
} from "react-icons/hi";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setSent(false);

      await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      setName("");
      setEmail("");
      setMessage("");
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-transparent px-6 py-28"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.08),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_38%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-size-[60px_60px] opacity-50" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] opacity-[0.03]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeading
          badge="Contact"
          title="Start With a Sharp Brief"
          description="Share your idea, product, or business challenge. We will shape it into a clear roadmap, premium interface, and scalable system."
        />

        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl p-7 glass-card glass-card-hover">
              <p className="text-xs font-black uppercase tracking-normal text-cyan-200">
                Engagement Flow
              </p>
              <div className="mt-6 space-y-4">
                {["Discovery", "Architecture", "Prototype", "Launch"].map(
                  (step, index) => (
                    <div key={step} className="flex items-center gap-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-200/20 bg-cyan-200/8 text-xs font-black text-cyan-100">
                        {index + 1}
                      </span>
                      <span className="text-sm font-semibold text-slate-200">
                        {step}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {[
              {
                icon: <HiMail />,
                label: "Email",
                value: "navalumiqtech@gmail.com",
              },
              {
                icon: <HiPhone />,
                label: "Phone",
                value: "+977 9716330375",
              },
              {
                icon: <HiLocationMarker />,
                label: "Location",
                value: "Bhaktapur Byasi, Nepal",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="group flex items-center gap-5 rounded-2xl p-5 glass-card glass-card-hover"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-cyan-300 transition group-hover:scale-105">
                  {item.icon}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-normal text-gray-500">
                    {item.label}
                  </p>
                  <p className="font-semibold text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl p-8 md:p-10 glass-card">
            {sent && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm font-semibold text-emerald-100">
                <HiCheckCircle className="text-xl" />
                Inquiry sent. We will respond within 24 hours.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs uppercase tracking-normal text-gray-400">
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="mt-2 w-full rounded-xl border border-cyan-500/20 bg-[#020b24]/40 px-4 py-3 text-white outline-none transition focus:border-cyan-400/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  required
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-normal text-gray-400">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="mt-2 w-full rounded-xl border border-cyan-500/20 bg-[#020b24]/40 px-4 py-3 text-white outline-none transition focus:border-cyan-400/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  required
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-normal text-gray-400">
                  Project Details
                </label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your idea..."
                  className="mt-2 w-full rounded-xl border border-cyan-500/20 bg-[#020b24]/40 px-4 py-3 text-white outline-none transition focus:border-cyan-400/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-4 font-black text-slate-950 transition duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Message"}
                <HiPaperAirplane className="rotate-90" />
              </button>

              <p className="text-center text-xs text-gray-500">
                Premium builds start with a focused conversation.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
