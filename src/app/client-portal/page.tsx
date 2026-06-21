import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  HiCreditCard,
  HiClock,
  HiShieldCheck,
  HiBookOpen,
  HiSparkles,
  HiCheckCircle,
  HiChevronRight,
  HiLockClosed,
  HiExclamationCircle,
  HiCalendar,
  HiDatabase,
  HiRefresh,
} from "react-icons/hi";
import GlassCard from "@/components/ui/GlassCard";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  formatSubscriptionDate,
  getRemainingSubscriptionTime,
  getSubscriptionPackage,
} from "@/lib/subscription";
import ClientPortalLogout from "./ClientPortalLogout";
import ClientPortalMessage from "./ClientPortalMessage";
import ClientPortalUpgrade from "./ClientPortalUpgrade";
import ClientPortalActions from "./ClientPortalActions";
import ClientBillingHistory from "./ClientBillingHistory";
import ClientPaymentMethod from "./ClientPaymentMethod";
import ClientRenewalCenter from "./ClientRenewalCenter";
import ClientQuickActions from "./ClientQuickActions";

// Mock Invoice Database
const mockInvoices = [
  { id: "INV-2026-004", date: "May 02, 2026", amount: 14990, status: "Paid", method: "Esewa" },
  { id: "INV-2026-003", date: "Apr 02, 2026", amount: 14990, status: "Paid", method: "Khalti" },
  { id: "INV-2026-002", date: "Mar 02, 2026", amount: 14990, status: "Paid", method: "Esewa" },
  { id: "INV-2026-001", date: "Feb 02, 2026", amount: 14990, status: "Paid", method: "Khalti" },
];

// Mock Activity Log
const accountActivities = [
  { action: "Subscription auto-renewed successfully", time: "May 02, 2026 at 00:00 UTC", detail: "Billing cycle INV-2026-004 processed via Esewa Wallet." },
  { action: "Security Settings Updated", time: "Apr 18, 2026 at 14:32 UTC", detail: "Authorized OAuth device from Windows 11 / Chrome." },
  { action: "Support Ticket Resolved", time: "Apr 12, 2026 at 09:15 UTC", detail: "Inquiry ID #84930 regarding SEO integration answered by Account Specialist." },
  { action: "Billing Contact Updated", time: "Feb 02, 2026 at 11:02 UTC", detail: "Invoice delivery email changed to accounts@lumiq.io." },
];

// Premium Resources Download Center
const resources = [
  { title: "SEO On-Page Optimization Playbook", format: "PDF (4.2 MB)", desc: "Step-by-step framework to configure meta headers, canonicals, and site indexes." },
  { title: "Universal Conversion Analytics Kit", format: "ZIP (12.8 MB)", desc: "Complete GTM containers, analytics triggers, and custom reporting dashboards." },
  { title: "Enterprise SLA & Security Standards Guide", format: "PDF (1.1 MB)", desc: "Performance benchmarks, uptime guarantees, and server support policies." },
];

export default async function ClientPortalPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/client-portal");
  }

  const client = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      name: true,
      email: true,
      packageName: true,
      packageId: true,
      durationDays: true,
      subscriptionStart: true,
      subscriptionEnd: true,
    },
  });

  if (!client) {
    redirect("/login?callbackUrl=/client-portal");
  }

  const remaining = getRemainingSubscriptionTime(client.subscriptionEnd);
  const pkg = getSubscriptionPackage(client.packageId ?? "");

  // Calculate billing metrics
  const activePlanName = client.packageName || "Custom SLA Plan";
  const activePlanPrice = pkg?.price || 14990;
  const isPremium = client.packageId === "enterprise";
  const isGrowth = client.packageId === "growth";
  
  // Specific Usage statistics based on packages
  const usageStats = {
    requests: isPremium ? { cur: 18, max: 30, pct: 60, label: "Advanced Maintenance SLA Requests" }
            : isGrowth ? { cur: 8, max: 15, pct: 53, label: "Standard Maintenance SLA Requests" }
            : { cur: 2, max: 5, pct: 40, label: "Basic Maintenance SLA Requests" },
    seo: isPremium ? { cur: 78, max: 100, pct: 78, label: "SEO Focus Keywords Monitored" }
         : isGrowth ? { cur: 34, max: 50, pct: 68, label: "SEO Focus Keywords Monitored" }
         : { cur: 8, max: 10, pct: 80, label: "SEO Focus Keywords Monitored" },
    updates: isPremium ? { cur: 4, max: 8, pct: 50, label: "Monthly Performance Audits Used" }
           : isGrowth ? { cur: 2, max: 4, pct: 50, label: "Monthly Performance Audits Used" }
           : { cur: 1, max: 1, pct: 100, label: "Monthly Performance Audits Used" },
  };

  // Safe percentage calculation for remaining time progress
  const totalSubDays = client.durationDays || 30;
  const daysUsed = Math.max(0, totalSubDays - remaining.days);
  const subCyclePercentage = Math.min(100, Math.round((daysUsed / totalSubDays) * 100));

  return (
    <div className="relative min-h-screen bg-transparent text-white">
      {/* Dynamic Glow effects */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.08),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.06),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff01_1px,transparent_1px),linear-gradient(to_bottom,#ffffff01_1px,transparent_1px)] bg-size-[64px_64px]" />
      <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] opacity-[0.02]" />

      {/* Portal Toast System Container */}
      <ClientPortalActions />

      {/* Navbar Navigation */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-transparent/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
            </span>
            <span className="text-xs font-extrabold uppercase tracking-widest text-white sm:text-sm">
              Client <span className="text-cyan-300">Portal</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/4 px-3 py-1 text-[11px] font-semibold text-gray-400 sm:inline-flex">
              {client.name}
            </span>
            {!remaining.expired && (
              <span className="hidden items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/8 px-3 py-1 text-[11px] font-bold text-cyan-300 sm:inline-flex">
                Active Client
              </span>
            )}
            <ClientPortalLogout />
          </div>
        </div>
      </nav>

      {/* Workspace */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-28 pt-28">

        {/* Banner Alert if subscription is ending soon */}
        {remaining.days <= 7 && !remaining.expired && (
          <div className="mb-8 flex items-center gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-200">
            <HiExclamationCircle className="text-xl text-amber-400 shrink-0" />
            <div className="flex-1">
              <span className="font-bold">Subscription Action Required:</span> Your billing cycle ends in {remaining.days} days on {formatSubscriptionDate(client.subscriptionEnd)}. Ensure payment methods are updated to avoid disruption.
            </div>
          </div>
        )}

        {/* 1. Dashboard Welcome Header */}
        <section className="mb-12">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">
            Account Management & Billing
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Welcome, {client.name?.split(" ")[0] || "User"}.
              </h1>
              <p className="mt-2 text-sm text-gray-400">
                Oversee billing cycles, active service configurations, system parameters, and subscription benefits.
              </p>
            </div>
            
            {/* 18. Account Status Section */}
            <div className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/2 px-4 py-2 text-xs font-semibold text-gray-400">
              Account Security Status: 
              <span className="flex items-center gap-1 text-emerald-400">
                <HiShieldCheck className="text-sm" /> Verified
              </span>
            </div>
          </div>
        </section>

        {/* 2. Subscription Status Cards Block */}
        <section className="mb-10 grid gap-4 grid-cols-1 md:grid-cols-3">
          
          {/* 3. Current Plan Card */}
          <GlassCard hover={false} className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Active Tier</span>
              <span className="rounded-full bg-cyan-400/10 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-400/20">
                Pro
              </span>
            </div>
            <h3 className="mt-4 text-2xl font-black text-white">{activePlanName}</h3>
            <p className="mt-1 text-xs text-gray-400">Fully configured client workspace & service SLA.</p>
            
            <div className="mt-6 flex items-baseline gap-1 border-t border-white/5 pt-4">
              <span className="text-lg font-bold text-gray-400">Rs.</span>
              <span className="text-3xl font-black text-white">{activePlanPrice.toLocaleString("en-IN")}</span>
              <span className="text-xs text-gray-500">/ month</span>
            </div>
          </GlassCard>

          {/* 4. Subscription Remaining Time Card */}
          <GlassCard hover={false} className="p-6">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Subscription Timeline</span>
            
            {remaining.expired ? (
              <div className="mt-4">
                <h3 className="text-2xl font-black text-rose-400">Term Expired</h3>
                <p className="mt-1 text-xs text-gray-400">Services are currently paused. Renew below.</p>
              </div>
            ) : (
              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl font-black text-white">{remaining.days}</h3>
                  <span className="text-sm font-semibold text-gray-400">days left</span>
                </div>
                <p className="mt-1 text-xs text-gray-400">Remaining term in current active cycle.</p>
              </div>
            )}

            {/* 10. Subscription Progress Section */}
            <div className="mt-6 border-t border-white/5 pt-4">
              <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1.5">
                <span>Cycle Progress</span>
                <span>{subCyclePercentage}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/6 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-linear-to-r from-cyan-400 to-violet-400"
                  style={{ width: `${subCyclePercentage}%` }}
                />
              </div>
            </div>
          </GlassCard>

          {/* 5. Renewal Information Card */}
          <GlassCard hover={false} className="p-6">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Auto-Renewal Details</span>
            
            <div className="mt-4">
              {remaining.expired ? (
                <div className="flex items-center gap-2 text-rose-300 text-sm font-bold">
                  <HiExclamationCircle className="text-lg" />
                  Manual Action Required
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-300 text-sm font-bold">
                  <HiCheckCircle className="text-lg" />
                  Enabled — Esewa/Khalti Autopay
                </div>
              )}
              <h3 className="mt-2 text-lg font-black text-white">
                {remaining.expired ? "Suspended" : formatSubscriptionDate(client.subscriptionEnd)}
              </h3>
              <p className="mt-1 text-xs text-gray-400">Scheduled deduction date for next cycle.</p>
            </div>

            <div className="mt-5 border-t border-white/5 pt-4 flex items-center justify-between">
              <span className="text-xs text-gray-500">Billing frequency</span>
              <span className="text-xs font-semibold text-white">Monthly</span>
            </div>
          </GlassCard>
        </section>

        {/* Two Column Grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          
          {/* Left Area */}
          <div className="space-y-8">

            {/* 8. Usage Statistics Section */}
            <GlassCard hover={false} className="p-6 sm:p-8">
              <div className="mb-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Resource Monitoring</span>
                <h2 className="mt-1.5 text-xl font-black text-white">Usage Statistics</h2>
                <p className="text-xs text-gray-400">Current allocation utilization stats for the active monthly cycle.</p>
              </div>

              <div className="space-y-5">
                {[
                  { key: "req", stats: usageStats.requests },
                  { key: "seo", stats: usageStats.seo },
                  { key: "upd", stats: usageStats.updates },
                ].map(({ key, stats }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white/90">{stats.label}</span>
                      <span className="font-bold text-gray-400">{stats.cur} / {stats.max} ({stats.pct}%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/6 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${stats.pct > 80 ? 'bg-amber-400' : 'bg-cyan-300'}`} 
                        style={{ width: `${stats.pct}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* 9. Plan Benefits Section */}
            <GlassCard hover={false} className="p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Service Inclusion</span>
                  <h2 className="mt-1.5 text-xl font-black text-white">Your Subscribed Benefits</h2>
                </div>
                <HiShieldCheck className="text-xl text-cyan-400" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {(pkg?.features || ["Basic workspace access", "Dedicated Client Account support", "Analytics Reporting Dashboard"]).map((feat) => (
                  <div key={feat} className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/2 p-3 text-xs text-gray-300">
                    <HiCheckCircle className="text-emerald-400 text-base shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* 14. Premium Resources Section */}
            <GlassCard hover={false} className="p-6 sm:p-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Knowledge Base</span>
                  <h2 className="mt-1.5 text-xl font-black text-white">Premium Resources</h2>
                </div>
                <HiBookOpen className="text-xl text-cyan-400" />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {resources.map((res) => (
                  <div key={res.title} className="group flex flex-col justify-between rounded-2xl border border-white/5 bg-white/1 p-4 hover:border-cyan-300/20 transition">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="truncate text-xs font-bold text-white group-hover:text-cyan-300 transition">
                          {res.title}
                        </h4>
                        <HiChevronRight className="text-gray-600 group-hover:text-cyan-300 transition shrink-0" />
                      </div>
                      <p className="mt-1.5 text-[11px] text-gray-400 leading-relaxed">{res.desc}</p>
                    </div>
                    <p className="mt-4 text-[9px] font-bold text-gray-500 uppercase tracking-wider">{res.format}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* 13. Invoice & Billing History Section */}
            <GlassCard hover={false} className="p-6 sm:p-8">
              <div className="mb-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Receipts</span>
                <h2 className="mt-1.5 text-xl font-black text-white">Invoice & Billing History</h2>
                <p className="text-xs text-gray-400">Download PDFs of statements and payments processed.</p>
              </div>

              {mockInvoices.length === 0 ? (
                <div className="rounded-2xl border border-white/5 bg-white/1 py-8 text-center text-gray-500">
                  <HiExclamationCircle className="mx-auto mb-2 text-2xl" />
                  No statements or invoices available.
                </div>
              ) : (
                <ClientBillingHistory invoices={mockInvoices} />
              )}
            </GlassCard>

            {/* 17. Quick Actions Section */}
            <GlassCard hover={false} className="p-6 sm:p-8">
              <div className="mb-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Self-Service</span>
                <h2 className="mt-1.5 text-xl font-black text-white">Quick Actions</h2>
              </div>
              <ClientQuickActions />
            </GlassCard>

            {/* 16. Account Activity Timeline */}
            <GlassCard hover={false} className="p-6 sm:p-8">
              <div className="mb-6">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Logs</span>
                <h2 className="mt-1.5 text-xl font-black text-white">Account Activity Timeline</h2>
              </div>

              <div className="space-y-4">
                {accountActivities.map((act) => (
                  <div key={act.action} className="relative flex gap-3 pb-4 last:pb-0 border-l border-white/6 pl-4 ml-2">
                    <span className="absolute -left-1.25 top-1.5 h-2.5 w-2.5 rounded-full bg-cyan-300 ring-4 ring-[#050816]" />
                    <div>
                      <h4 className="text-xs font-bold text-white/90">{act.action}</h4>
                      <p className="mt-0.5 text-[10px] text-gray-500">{act.time}</p>
                      <p className="mt-1 text-[11px] text-gray-400">{act.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right Area */}
          <div className="space-y-6">

            {/* 6. Billing Overview & 7. Payment Method */}
            <GlassCard hover={false} className="p-6">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Billing Instrument</span>
              <h3 className="mt-1.5 text-sm font-black text-white">Payment Method</h3>
              <ClientPaymentMethod 
                clientEmail={client.email}
                planId={client.packageId || "basic"}
                amount={activePlanPrice}
              />
            </GlassCard>

            {/* 11. Upgrade Plan Section */}
            <GlassCard hover={false} className="p-6">
              <div className="mb-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">SaaS Tier Upgrades</span>
                <h3 className="mt-1.5 text-sm font-black text-white">Upgrade Subscription Plan</h3>
                <p className="text-[11px] text-gray-500">Unlock custom assets, priority SLAs, and custom support.</p>
              </div>

              <ClientPortalUpgrade 
                currentPlanId={client.packageId ?? ""} 
                clientName={client.name || "Client"}
                clientEmail={client.email}
              />
            </GlassCard>

            {/* 12. Renewal Center Section */}
            <GlassCard hover={false} className="p-6">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Renewals</span>
              <h3 className="mt-1.5 text-sm font-black text-white">Renewal Center</h3>
              <p className="mt-1 text-xs text-gray-400 leading-relaxed">
                Extend subscription terms, renew expired schedules, or alter cycle frequency settings.
              </p>
              <ClientRenewalCenter expired={remaining.expired} />
            </GlassCard>

            {/* 15. Support Center Section */}
            <ClientPortalMessage clientName={client.name ?? "Client"} clientEmail={client.email} />

            {/* Back link */}
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-xl bg-white/2 hover:bg-white/4 border border-white/6 py-3.5 text-xs font-semibold text-gray-400 hover:text-white transition"
            >
              Return to Website
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
