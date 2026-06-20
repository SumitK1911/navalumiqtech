"use client";

import { signIn, getSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HiArrowLeft, HiEnvelope, HiLockClosed } from "react-icons/hi2";
import GlassCard from "@/components/ui/GlassCard";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    const session = await getSession();
    if (session?.user?.role === "admin") {
      setError("Access denied. Administrators must log in through the Admin Console.");
      await signOut({ redirect: false });
    } else {
      router.push("/client-portal");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent flex flex-col justify-center items-center px-6 py-12 text-white">
      {/* Background radial atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.15),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.15),transparent_40%)]" />
      <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-size-[60px_60px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.025] pointer-events-none" />

      {/* Top back button */}
      <div className="relative z-10 w-full max-w-md mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition group"
        >
          <HiArrowLeft className="transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
      </div>

      {/* Glass card container */}
      <GlassCard hover={false} className="w-full max-w-md bg-white/[0.03] border border-white/10 p-8 sm:p-10 backdrop-blur-3xl rounded-3xl">
        <div className="relative z-10">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-cyan-300 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Client Access
            </span>
            <h1 className="text-3xl font-black text-white leading-tight">
              Client Portal
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Sign in to manage your digital ecosystem, workflows, and plan.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-400 text-lg">
                  <HiEnvelope />
                </span>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-5 py-4 rounded-xl bg-black/40 border border-white/10 text-white outline-none placeholder-gray-500 focus:border-cyan-400/50 focus:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-[0.15em] text-gray-400">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-400 text-lg">
                  <HiLockClosed />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-5 py-4 rounded-xl bg-black/40 border border-white/10 text-white outline-none placeholder-gray-500 focus:border-cyan-400/50 focus:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 leading-relaxed">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-4 rounded-xl bg-linear-to-r from-cyan-400 to-violet-500 hover:from-cyan-300 hover:to-violet-400 font-extrabold text-black hover:scale-[1.01] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(34,211,238,0.25)]"
            >
              {loading ? "Verifying..." : "Sign In to Portal"}
            </button>

            {/* Registration CTA */}
            <div className="pt-4 border-t border-white/5 text-center">
              <p className="text-sm text-gray-400">
                Need a premium plan?{" "}
                <Link
                  href="/client-portal/register"
                  className="font-bold text-cyan-300 hover:text-cyan-200 transition underline underline-offset-4"
                >
                  Create workspace
                </Link>
              </p>
            </div>
          </form>
        </div>
      </GlassCard>
    </main>
  );
}
