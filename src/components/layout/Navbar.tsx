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
  { label: "Home",        href: "/#home" },
  { label: "About",       href: "/#about" },
  { label: "Services",    href: "/#services" },
  { label: "Case Studies",href: "/#case-studies" },
  { label: "Blog",        href: "/#blog" },
  { label: "Contact",     href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const sections = navItems.map((item) => item.href.split("#")[1]);
      for (const section of sections) {
        const el = document.getElementById(section);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) setActiveSection(section);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-slate-950/75 shadow-[0_1px_0_rgba(255,255,255,0.06),0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          : ""
      }`}
    >
      {/* ── Main bar ────────────────────────────────────────────── */}
      <div
        className={`mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 md:px-8 transition-all duration-500 ${
          scrolled ? "h-[80px]" : "h-[96px]"
        }`}
      >
        {/* Logo */}
        <Link
          href="/#home"
          className="group relative flex shrink-0 items-center ml-2 mr-6 lg:mr-8"
        >
          <div className="absolute -inset-2 rounded-full bg-linear-to-r from-cyan-400/0 via-white/5 to-violet-400/10 opacity-0 blur-lg transition duration-500 group-hover:opacity-100" />
          <BrandLogo
            width={140}
            height={42}
            className="relative transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.split("#")[1];
            return (
              <Link
                key={item.label}
                href={item.href}
                className="group relative px-3 py-1.5 text-sm font-semibold text-slate-300 transition duration-300 hover:text-white xl:px-4"
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 rounded-full border border-cyan-200/20 bg-linear-to-r from-cyan-300/10 to-violet-300/10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
                <span className="absolute inset-x-3 bottom-0.5 h-px origin-left scale-x-0 bg-linear-to-r from-cyan-300 to-transparent transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            );
          })}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="/client-portal"
            className={`group hidden items-center gap-2 rounded-full border ${brandAccentBorder} ${brandGradient} px-4 py-1.5 text-sm font-bold text-slate-950 shadow-[0_4px_24px_rgba(34,211,238,0.2)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(34,211,238,0.3)] lg:inline-flex`}
          >
            Client Login
            <HiArrowRight className="transition duration-300 group-hover:translate-x-1" />
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/8 text-white transition duration-300 hover:border-cyan-300/30 hover:bg-white/12 lg:hidden"
          >
            {mobileOpen ? <HiX className="text-lg" /> : <HiMenuAlt3 className="text-lg" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ─────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="mx-4 mt-1 lg:hidden"
          >
            <div className="overflow-hidden rounded-2xl border border-white/12 bg-slate-950/85 p-3 shadow-[0_16px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl border border-transparent px-4 py-3 text-sm font-semibold text-slate-300 transition duration-200 hover:border-white/10 hover:bg-white/6 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/client-portal"
                  onClick={() => setMobileOpen(false)}
                  className={`mt-1 flex items-center justify-center gap-2 rounded-xl ${brandGradient} px-4 py-3 text-sm font-bold text-black`}
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
