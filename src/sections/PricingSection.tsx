"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HiArrowRight, HiCheck, HiSparkles } from "react-icons/hi";
import Reveal from "@/components/animations/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { subscriptionAddOns, subscriptionPackages } from "@/lib/subscription";

type Plan = {
  id: string;
  slug?: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  features: string[];
  popular: boolean;
};

const defaultPlans: Plan[] = subscriptionPackages.map((item) => ({
  id: item.id,
  slug: item.id,
  name: item.name,
  description: item.description,
  price: item.price,
  durationDays: item.durationDays,
  features: [...item.features],
  popular: item.popular,
}));

const durationOptions = [
  {
    label: "1 month",
    months: 1,
    days: 30,
    discount: 0,
  },
  {
    label: "3 months",
    months: 3,
    days: 90,
    discount: 0.1,
  },
  {
    label: "6 months",
    months: 6,
    days: 180,
    discount: 0,
  },
  {
    label: "1 year",
    months: 12,
    days: 365,
    discount: 0,
  },
];

function getPlanTotal(plan: Plan, months: number, discount: number) {
  const monthlyPrice = plan.price / Math.max(plan.durationDays / 30, 1);
  return Math.round(monthlyPrice * months * (1 - discount));
}

export default function PricingSection() {
  const [plans, setPlans] = useState<Plan[]>(defaultPlans);
  const [selectedDuration, setSelectedDuration] = useState(durationOptions[0]);

  useEffect(() => {
    let active = true;

    async function loadPlans() {
      try {
        const response = await fetch("/api/subscription-plans");
        const data = await response.json();

        if (active && Array.isArray(data) && data.length > 0) {
          setPlans(data);
        }
      } catch {
        setPlans(defaultPlans);
      }
    }

    void loadPlans();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-transparent px-6 py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(52,211,153,0.08),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.06),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeading
          badge="Pricing"
          title="Our Digital Marketing Services"
          description="Find the perfect digital marketing package for your brand, then choose the duration that fits your growth plan."
        />

        <div className="mx-auto mb-10 flex max-w-xl rounded-2xl border border-cyan-500/20 bg-[#020b24]/40 p-1 backdrop-blur-md">
          {durationOptions.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => setSelectedDuration(option)}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-black transition duration-300 ${
                selectedDuration.label === option.label
                  ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{option.label}</span>
              {option.discount > 0 && (
                <span className="ml-1 text-[10px] uppercase">
                  10% off
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => {
            const total = getPlanTotal(
              plan,
              selectedDuration.months,
              selectedDuration.discount
            );

            return (
              <Reveal key={plan.id} delay={index * 0.1}>
                <div
                  className={`relative flex h-full flex-col rounded-3xl p-8 glass-card glass-card-hover ${
                    plan.popular
                      ? "border-cyan-400/50 shadow-[0_0_25px_rgba(34,211,238,0.15)] bg-[#020b24]/60"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full bg-cyan-400/20 border border-cyan-400/30 px-3 py-1 text-[10px] uppercase tracking-widest text-cyan-300">
                      <HiSparkles />
                      Popular
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-xs uppercase tracking-[0.3em] text-cyan-400">
                      {plan.name}
                    </h3>
                    <p className="mt-3 text-gray-400">{plan.description}</p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-end gap-2">
                      <span className="text-xl text-gray-400">Rs.</span>
                      <h2 className="text-5xl font-black text-white">
                        {total.toLocaleString()}
                      </h2>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {selectedDuration.label} subscription
                      {selectedDuration.discount > 0
                        ? " with 10% discount"
                        : ""}
                    </p>
                  </div>

                  <div className="mb-8 flex-1 space-y-4">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex gap-3">
                        <HiCheck className="mt-1 shrink-0 text-cyan-400" />
                        <p className="text-sm text-gray-300">{feature}</p>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/client-portal/register?packageId=${encodeURIComponent(
                      plan.slug || plan.id
                    )}&durationDays=${selectedDuration.days}`}
                    className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-bold transition duration-300 ${
                      plan.popular
                        ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-black hover:opacity-90 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
                        : "border border-cyan-500/20 bg-[#020b24]/40 text-white hover:border-cyan-400/50 hover:bg-[#020b24]/60 hover:shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                    }`}
                  >
                    Subscribe
                    <HiArrowRight />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-10 rounded-3xl p-8 text-center glass-card">
          <h3 className="text-2xl font-black text-white">
            Level up your package with add-ons
          </h3>
          <div className="mx-auto mt-6 grid max-w-4xl gap-3 text-left sm:grid-cols-2">
            {subscriptionAddOns.map((addOn) => (
              <div
                key={addOn.name}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-[#020b24]/40 px-4 py-3 hover:border-cyan-500/20 transition-all duration-300"
              >
                <span className="flex items-center gap-3 text-sm text-gray-300">
                  <HiCheck className="shrink-0 text-cyan-400" />
                  {addOn.name}
                </span>
                <span className="shrink-0 text-sm font-black text-white">
                  Rs. {addOn.price.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-3xl text-gray-400">
            Book any package for 3 months and receive 10% off. Subscription
            dates, package details, and marketing deliverables are visible in
            the client portal after registration.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-[#020b24]/40 px-6 py-3 text-sm font-semibold text-cyan-300 transition duration-300 hover:border-cyan-400/50 hover:bg-[#020b24]/60 hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
            >
              Book Now
              <HiArrowRight />
            </a>
            <span className="text-sm font-semibold text-gray-400">
              Contact: 9716330375
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
