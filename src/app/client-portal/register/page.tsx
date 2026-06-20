"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HiCheckCircle,
  HiUserAdd,
} from "react-icons/hi";

import GlassCard from "@/components/ui/GlassCard";

import {
  subscriptionPackages,
  type SubscriptionPackageId,
} from "@/lib/subscription";

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

const fallbackPlans: Plan[] =
  subscriptionPackages.map((item) => ({
    id: item.id,
    slug: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    durationDays: item.durationDays,
    features: [...item.features],
    popular: item.popular,
  }));

const allowedDurationDays = [
  30, 90, 180, 365,
];

function calculatePrice(basePrice: number, durationDays: number) {
  const durationMonths: Record<number, number> = {
    30: 1,
    90: 3,
    180: 6,
    365: 12,
  };
  const months = durationMonths[durationDays] ?? durationDays / 30;

  let multiplier = months;

  if (durationDays === 90) {
    multiplier = 2.7; // 10% discount on 3-month packages
  }

  return Math.round(basePrice * multiplier);
}

function getInitialPackageId() {
  if (typeof window === "undefined") {
    return fallbackPlans[0].id;
  }

  return (
    new URLSearchParams(
      window.location.search
    ).get("packageId") ||
    fallbackPlans[0].id
  );
}

function normalizePlanKey(value: string) {
  return value.trim().toLowerCase();
}

function matchesPlan(plan: Plan, value: string) {
  const key = normalizePlanKey(value);

  return [
    plan.id,
    plan.slug,
    plan.name,
    plan.name.replace(/\s+/g, "-"),
  ]
    .filter(Boolean)
    .some((item) => normalizePlanKey(String(item)) === key);
}

export default function ClientRegisterPage() {
  const router = useRouter();

  const [plans, setPlans] =
    useState<Plan[]>(fallbackPlans);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [packageId, setPackageId] =
    useState<
      SubscriptionPackageId | string
    >(getInitialPackageId);

  // ✅ FIXED: now editable
  const [durationDays, setDurationDays] = useState(30);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const selected = Number(
      new URLSearchParams(window.location.search).get("durationDays")
    );

    if (allowedDurationDays.includes(selected)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDurationDays(selected);
    }

    setHydrated(true);
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const selectedPlan =
    plans.find((plan) => matchesPlan(plan, packageId)) ?? 
    plans[0];

  useEffect(() => {
    let active = true;

    async function loadPlans() {
      try {
        const response = await fetch(
          "/api/subscription-plans"
        );

        const data = await response.json();

        if (
          active &&
          Array.isArray(data) &&
          data.length > 0
        ) {
          setPlans(data);

          setPackageId(
            (current) => {
              const matchingPlan = data.find((p: Plan) =>
                matchesPlan(p, current)
              );

              return matchingPlan
                ? matchingPlan.slug || matchingPlan.id
                : data[0].slug || data[0].id;
            }
          );
        }
      } catch {
        setPlans(fallbackPlans);
      }
    }

    void loadPlans();

    return () => {
      active = false;
    };
  }, []);

  async function handleRegister(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const response = await fetch(
      "/api/register",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          packageId,
          durationDays, // ✅ now dynamic
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(
        data.error ||
          "Registration failed."
      );
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/login");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent px-6 pb-32 pt-40 text-white">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.12),transparent_30%)]" />

      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">

        {/* LEFT */}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300">
            Client Registration
          </p>

          <h1 className="mt-4 text-4xl font-black md:text-6xl">
            Create marketing account
          </h1>

          <p className="mt-6 text-gray-400">
            Choose your digital marketing package and duration to get instant portal access.
          </p>

          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
              Selected Duration
            </p>

            <h3 className="mt-3 text-4xl font-black">
              {hydrated ? durationDays : 30} Days
            </h3>
          </div>

          {selectedPlan && (
            <div className="mt-5 rounded-3xl border border-cyan-300/20 bg-cyan-300/5 p-6 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
                Selected Package
              </p>

              <h3 className="mt-3 text-3xl font-black text-white">
                {selectedPlan.name}
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                {selectedPlan.description}
              </p>

              <div className="mt-5 space-y-3">
                {selectedPlan.features.map((feature) => (
                  <div key={feature} className="flex gap-3 text-sm text-gray-300">
                    <HiCheckCircle className="mt-0.5 shrink-0 text-cyan-300" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <GlassCard className="relative overflow-hidden border border-white/10 bg-white/5 p-6 md:p-10 backdrop-blur-2xl">

          <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative z-10">

            <h2 className="text-3xl font-black mb-6">
              Create Account
            </h2>

            <form
              onSubmit={handleRegister}
              className="space-y-6"
            >

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Full Name"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4"
                required
              />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Email"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4"
                required
              />

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Password"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4"
                minLength={6}
              />

              {/* ✅ DURATION SELECTOR */}
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.2em] text-cyan-300">
                  Subscription Duration
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "1M", value: 30 },
                    { label: "3M", value: 90 },
                    { label: "6M", value: 180 },
                    { label: "1Y", value: 365 },
                  ].map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() =>
                        setDurationDays(d.value)
                      }
                      className={`rounded-xl border px-4 py-3 text-sm ${
                        durationDays === d.value
                          ? "border-cyan-300 bg-cyan-300/10 text-cyan-200"
                          : "border-white/10 bg-black/20"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* PLANS */}
              <div className="mb-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
                  Estimated Total Price
                </p>

                <h3 className="mt-2 text-3xl font-black text-white">
                  Rs.{" "}
                  {calculatePrice(
                    selectedPlan?.price || 0,
                    durationDays
                  ).toLocaleString()}
                </h3>

                <p className="text-xs text-gray-400">
                  Based on selected package + duration
                </p>
              </div>


              <div className="grid gap-3 md:grid-cols-3">
                {plans.map((item) => (
                  <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                      setPackageId(item.slug || item.id)
                    }
                    className={`rounded-2xl border p-4 text-left ${
                      matchesPlan(item, packageId)
                        ? "border-cyan-300 bg-cyan-300/10"
                        : "border-white/10 bg-black/20"
                    }`}
                  >
                    <div className="flex justify-between">
                      <h3>{item.name}</h3>
                      {matchesPlan(item, packageId) && (
                        <HiCheckCircle />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {error && (
                <p className="text-red-300 text-sm">
                  {error}
                </p>
              )}

              <button
                disabled={loading}
                className="w-full rounded-2xl bg-cyan-300 py-4 font-black text-black transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                <HiUserAdd className="inline mr-2" />
                {loading
                  ? "Creating..."
                  : "Register"}
              </button>

              <div className="pt-4 border-t border-white/5 text-center">
                <p className="text-sm text-gray-400">
                  Already have a workspace?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-cyan-300 hover:text-cyan-200 transition underline underline-offset-4"
                  >
                    Log in
                  </Link>
                </p>
              </div>

            </form>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
