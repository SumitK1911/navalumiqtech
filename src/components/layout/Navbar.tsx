"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { motion, AnimatePresence } from "framer-motion";

import {
  HiMenuAlt3,
  HiX,
  HiArrowRight,
} from "react-icons/hi";

import BrandLogo from "@/components/BrandLogo";
import { brandGradient, brandAccentBorder } from "@/lib/theme";

const navItems = [
  {
    label: "Home",
    href: "/#home",
  },
  {
    label: "About",
    href: "/#about",
  },
  {
    label: "Services",
    href: "/#services",
  },
  {
    label: "Case Studies",
    href: "/#case-studies",
  },
  {
    label: "Blog",
    href: "/#blog",
  },
  {
    label: "Contact",
    href: "/#contact",
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const sections = navItems.map(
        (item) => item.href.split("#")[1]
      );

      for (const section of sections) {
        const el = document.getElementById(section);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) {
          setActiveSection(section);
        }
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{
        y: -100,
      }}
      animate={{
        y: 0,
      }}
      transition={{
        duration: 0.7,
      }}
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "py-4 bg-[#020b24]/80 backdrop-blur-md border-b border-cyan-500/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6">
        
        {/* Logo (Left) */}
        <Link
          href="/#home"
          className="group flex items-center shrink-0"
        >
          <BrandLogo width={140} height={42} className="transition-transform duration-300 group-hover:scale-105" />
        </Link>

        {/* Desktop Nav Links (Center) */}
        <nav className="hidden items-center gap-1 lg:flex bg-[#020b24]/40 border border-cyan-500/20 rounded-full px-2 py-1 backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.split("#")[1];

            return (
              <Link
                key={item.label}
                href={item.href}
                className="group relative px-4 py-2 text-sm font-semibold text-slate-300 transition duration-300 hover:text-white"
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 rounded-full border border-cyan-200/25 bg-gradient-to-r from-cyan-400/10 to-emerald-400/10 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10">
                  {item.label}
                </span>
                <span className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-linear-to-r from-cyan-200 to-transparent transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            );
          })}
        </nav>

        {/* Right Action Button & Mobile Toggle */}
        <div className="flex items-center gap-4">
          {/* CTA */}
          <Link
            href="/client-portal"
            className="group hidden items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-2.5 text-sm font-black text-slate-950 transition duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:scale-105 lg:inline-flex"
          >
            Client Login
            <HiArrowRight className="transition duration-300 group-hover:translate-x-1" />
          </Link>

          {/* Mobile Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/20 bg-[#020b24]/40 text-white transition duration-300 hover:border-cyan-400/50 hover:bg-[#020b24]/60 lg:hidden"
          >
            {mobileOpen ? (
              <HiX className="text-xl" />
            ) : (
              <HiMenuAlt3 className="text-xl" />
            )}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            transition={{
              duration: 0.3,
            }}
            className="mx-auto mt-3 max-w-7xl px-6 lg:hidden"
          >
            <div className="overflow-hidden rounded-3xl border border-cyan-500/20 bg-[#020b24]/90 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-2xl border border-transparent px-5 py-4 text-sm font-semibold text-slate-200 transition duration-300 hover:border-cyan-500/20 hover:bg-white/5 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}

                {/* CTA */}
                <Link
                  href="/client-portal"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-4 text-sm font-black text-black"
                >
                  Client Login
                  <HiArrowRight />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
