"use client";

import Link from "next/link";

import {
  FaTwitter,
  FaGithub,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

import BrandLogo from "@/components/BrandLogo";
import { brandGradient, brandAccentBorder } from "@/lib/theme";

const footerLinks = {
  Solutions: [
    "Web Development",
    "Hire Developers",
    "Client Portal",
    "Admin Panel",
    "AI Solutions",
    "Mobile Apps",
  ],

  Company: [
    "About",
    "Portfolio",
    "Case Studies",
    "Blog",
    "Contact",
  ],
};

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-cyan-400/15 bg-[#040510] px-6 pt-32 pb-10">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-125 w-225 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_45%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.14),transparent_45%)] blur-[180px]" />

      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-24 text-center">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.35em] text-cyan-400">
            Nava Lumiq Tech
          </p>

          <h2 className="mx-auto max-w-4xl bg-linear-to-r from-emerald-300 via-white to-cyan-300 bg-clip-text pb-2 text-2xl font-black leading-[1.14] tracking-normal text-transparent md:text-5xl">
            Engineering intelligent digital experiences for the next generation.
          </h2>

          <div className="mx-auto mt-10 h-px w-40 bg-linear-to-r from-cyan-400/0 via-white/40 to-emerald-400/0" />
        </div>

        <div className="grid gap-16 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="mb-8 flex items-center gap-4">
              <BrandLogo width={98} />
            </Link>

            <p className="mb-8 max-w-sm text-cyan-50/80 leading-relaxed">
              Engineering premium digital products with developer hiring,
              client portals, admin-managed workflows, AI systems, and scalable
              infrastructure.
            </p>

            <div className="flex gap-4">
              {[
                {
                  icon: <FaTwitter />,
                  href: "https://twitter.com/navalumiqtech",
                },
                {
                  icon: <FaGithub />,
                  href: "https://github.com/navalumiqtech",
                },
                {
                  icon: <FaLinkedin />,
                  href: "https://linkedin.com/company/navalumiqtech",
                },
                {
                  icon: <FaInstagram />,
                  href: "https://instagram.com/navalumiqtech",
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-white/5 text-cyan-100 transition duration-300 hover:border-emerald-300/50 hover:bg-linear-to-r hover:from-cyan-400 hover:to-emerald-400 hover:text-black"
                >
                  <span className="transition duration-300 group-hover:scale-110">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, items]) => (
            <div key={title}>
              <h4 className="mb-8 text-sm font-black uppercase tracking-[0.3em] text-white">
                {title}
              </h4>

              <ul className="space-y-5">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="group inline-flex items-center gap-2 text-cyan-50/80 transition duration-300 hover:text-white"
                    >
                      <span className="h-1 w-1 rounded-full bg-emerald-300/70 transition duration-300 group-hover:bg-cyan-200" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-8 text-sm font-black uppercase tracking-[0.3em] text-white">
              Newsletter
            </h4>

            <p className="mb-6 text-cyan-50/80 leading-relaxed">
              Get insights on AI, engineering, digital systems, and innovation.
            </p>

            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-2xl border border-cyan-400/20 bg-white/5 px-6 py-4 text-white outline-none transition duration-300 placeholder:text-emerald-100/50 focus:border-emerald-300/60"
              />

              <button
                type="submit"
                className={`w-full rounded-2xl ${brandGradient} px-6 py-4 font-black text-black transition duration-300 hover:scale-[1.02]`}
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

        <div className={`mt-24 flex flex-col items-center justify-between gap-6 border-t ${brandAccentBorder} pt-8 md:flex-row`}>
          <p className="text-sm text-cyan-50/75">© 2026 Nava Lumiq Tech. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-8 text-sm text-emerald-100/70">
            <Link href="#" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="transition hover:text-white">
              Terms of Service
            </Link>
            <Link href="#" className="transition hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
