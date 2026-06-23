"use client";

import { useState } from "react";
import { HiCheckCircle, HiArrowUp } from "react-icons/hi";
import { subscriptionPackages } from "@/lib/subscription";

type Props = {
  currentPlanId: string;
  clientName: string;
  clientEmail: string;
};

export default function ClientPortalUpgrade({ currentPlanId, clientName, clientEmail }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const upgradePlans = subscriptionPackages.filter((p) => p.id !== currentPlanId);

  async function handleRequest() {
    if (!selected) return;
    const plan = subscriptionPackages.find((p) => p.id === selected);
    if (!plan) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${clientName} (Plan Upgrade Request)`,
          email: clientEmail,
          message: `Upgrade request submitted from "${currentPlanId}" plan to "${plan.name}" (Rs. ${plan.price.toLocaleString("en-IN")}/mo). Please process and confirm via email.`,
        }),
      });
      if (!res.ok) throw new Error("Request failed. Please try again.");
      setSuccess(true);
      setSelected(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-3xl border border-emerald-400/25 bg-emerald-400/6 p-6 text-center">
        <HiCheckCircle className="mx-auto mb-3 text-4xl text-emerald-400" />
        <h3 className="text-base font-black text-white">Upgrade Request Received</h3>
        <p className="mt-2 text-sm text-gray-400 leading-relaxed">
          Our team will review your request and send upgrade confirmation to your registered email within 24 hours.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 text-xs font-bold text-cyan-300 underline hover:text-white transition"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {upgradePlans.map((plan) => (
        <button
          key={plan.id}
          onClick={() => setSelected(selected === plan.id ? null : plan.id)}
          className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
            selected === plan.id
              ? "border-cyan-400/40 bg-cyan-400/[0.07] ring-1 ring-cyan-400/20"
              : "border-white/8 bg-white/2 hover:border-white/20 hover:bg-white/4"
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{plan.name}</span>
                {plan.popular && (
                  <span className="rounded-full border border-violet-400/30 bg-violet-400/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-violet-300">
                    Popular
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-gray-500">{plan.description}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {plan.features.map((f) => (
                  <span key={f} className="rounded-full bg-white/4 border border-white/[0.07] px-2 py-0.5 text-[10px] text-gray-400">
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-base font-black text-white">
                Rs. {plan.price.toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] text-gray-500">/month</p>
            </div>
          </div>
          {selected === plan.id && (
            <div className="mt-3 h-0.5 w-full rounded-full bg-linear-to-r from-cyan-400/40 to-violet-400/40" />
          )}
        </button>
      ))}

      {error && (
        <p className="rounded-xl border border-rose-400/25 bg-rose-400/6 px-4 py-2.5 text-xs text-rose-300">
          {error}
        </p>
      )}

      <button
        onClick={handleRequest}
        disabled={!selected || loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3.5 text-sm font-black text-black transition-all duration-200 hover:bg-cyan-200 hover:scale-[1.01] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-gray-500"
      >
        <HiArrowUp className="text-base" />
        {loading ? "Submitting…" : selected ? "Request Upgrade" : "Select a Plan"}
      </button>
      <p className="text-center text-[11px] text-gray-600">
        Our team will confirm your upgrade via email within 24 hours.
      </p>
    </div>
  );
}
