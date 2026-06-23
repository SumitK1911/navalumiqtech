"use client";

import { useEffect } from "react";
import PricingSection from "@/sections/PricingSection";
import HeroSection from "@/sections/HeroSection";
import AboutSection from "@/sections/AboutSection";
import ServicesSection from "@/sections/ServicesSection";
import TechStackSection from "@/sections/TechStackSection";
import CaseStudiesSection from "@/sections/CaseStudiesSection";
import PortfolioSection from "@/sections/PortfolioSection";
import TestimonialsSection from "@/sections/TestimonialsSection";
import StatsSection from "@/sections/StatsSection";
import ContactSection from "@/sections/ContactSection";
import BlogSection from "@/sections/BlogSection";
import HireDevelopersSection from "@/sections/HireDevelopersSection";

export default function Home() {

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const hash = window.location.hash.replace("#", "");
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming | undefined;
    const isReload = navigation?.type === "reload";

    requestAnimationFrame(() => {
      if (hash && !isReload) {
        document.getElementById(hash)?.scrollIntoView({
          block: "start",
        });
        return;
      }

      if (isReload && hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }

      window.scrollTo({
        top: 0,
        left: 0,
      });
    });
  }, []);

  return (
    <main className="bg-gradient-to-br from-[#020b24] via-[#051024] to-[#011c15] overflow-hidden text-white">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <TechStackSection />
      <PricingSection />
      <PortfolioSection />
      <HireDevelopersSection />
      <CaseStudiesSection />
      <BlogSection />
      <TestimonialsSection />
      <StatsSection />
      <ContactSection />
    </main>
  );
}
