import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  HiArrowRight,
  HiBriefcase,
  HiClipboardList,
  HiDocumentText,
  HiMail,
  HiPhotograph,
  HiUserGroup,
  HiSparkles,
  HiTrendingUp,
} from "react-icons/hi";

export default async function AdminDashboardPage() {

  const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      redirect("/admin/login");
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== "admin") {
      redirect("/admin/login");
    }

  // Fetch counts in parallel (avoid loading all user rows into memory)
  let totalUsers = 0;
  let activeClients = 0;
  let expiredClients = 0;
  let servicesCount = 0;
  let vacanciesCount = 0;
  let blogsCount = 0;
  let inquiriesCount = 0;

  try {
    const now = new Date();

    [
      totalUsers,
      servicesCount,
      vacanciesCount,
      blogsCount,
      inquiriesCount,
      activeClients,
      expiredClients,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.service.count(),
      prisma.vacancy.count({ where: { active: true } }),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.contactInquiry.count(),
      prisma.user.count({
        where: {
          role: "client",
          subscriptionEnd: { not: null, gt: now },
        },
      }),
      prisma.user.count({
        where: {
          role: "client",
          subscriptionEnd: { not: null, lt: now },
        },
      }),
    ]);
  } catch (err) {
    // If DB is unreachable, log and show a lightweight error UI instead of crashing
    // This prevents repeated server errors and heavy stack traces that can exhaust memory
    // Keep the component simple so admin can still see the login/connection issue.
     
    console.error("Admin dashboard DB error:", err);

    return (
      <div className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto rounded-2xl border border-red-400/20 bg-white/5 p-8">
          <h2 className="text-2xl font-bold text-red-300">Database connection error</h2>
          <p className="mt-4 text-gray-300">
            The admin dashboard cannot reach the database. Please check your database
            connection or environment configuration (DATABASE_URL / SUPABASE settings).
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Active Services",
      value: String(servicesCount),
      detail: "Public offers",
    },
    {
      label: "Open Vacancies",
      value: String(vacanciesCount),
      detail: "Hiring pipeline",
    },
    {
      label: "Client Workspaces",
      value: String(activeClients),
      detail: "Active subscriptions",
    },
    {
      label: "Expired Accounts",
      value: String(expiredClients),
      detail: "Need renewal",
    },
  ];

  const primaryModules = [
    {
      href: "/admin/services",
      label: "Services",
      title: "Manage Services",
      description:
        "Control services shown on website.",
      icon: HiSparkles,
    },
    {
      href: "/admin/vacancies",
      label: "Hiring",
      title: "Open Vacancies",
      description:
        "Manage job listings and hiring.",
      icon: HiBriefcase,
    },
    {
      href: "/admin/applications",
      label: "CV Review",
      title: "Applications",
      description:
        "Review job applications.",
      icon: HiClipboardList,
    },
    {
      href: "/admin/clients",
      label: "Portal",
      title: "Client Workspaces",
      description:
        "Manage client subscriptions.",
      icon: HiUserGroup,
    },
  ];

  const secondaryModules = [
    {
      href: "/admin/projects",
      title: "Projects",
      icon: HiTrendingUp,
    },
    {
      href: "/admin/inquiries",
      title: "Inquiries",
      icon: HiMail,
    },
    {
      href: "/admin/blogs",
      title: "Blogs",
      icon: HiDocumentText,
    },
    {
      href: "/admin/media",
      title: "Media",
      icon: HiPhotograph,
    },
  ];

  const activity = [
    `Total users: ${totalUsers}`,
    `Active clients: ${activeClients}`,
    `Expired subscriptions: ${expiredClients}`,
    `Published blogs: ${blogsCount}`,
    `Pending inquiries: ${inquiriesCount}`,
    "Admin system connected to Prisma DB",
  ];

  const dashboardBars = [
    { label: "Leads", value: inquiriesCount, width: 72 },
    { label: "Hiring", value: vacanciesCount, width: 48 },
    { label: "Content", value: blogsCount, width: 64 },
    { label: "Clients", value: activeClients, width: 82 },
  ];

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/4.5 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-2xl md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.14),transparent_38%)]" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">

          <div>

            <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
              Control Center
            </p>

            <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">
              Enterprise operations cockpit
            </h2>

            <p className="mt-4 text-gray-400">
              Analytics, hiring, lead tracking, content, and client operations in one premium control plane.
            </p>

          </div>

          <Link
            href="/admin/services"
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-cyan-300 via-white to-violet-300 px-5 py-3 text-sm font-black text-black hover:bg-white"
          >
            Manage Services
            <HiArrowRight />
          </Link>

        </div>

      </section>

      {/* STATS */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-2xl border border-white/10 bg-white/4.5 p-5 backdrop-blur-2xl transition hover:-translate-y-1 hover:border-cyan-300/30"
          >

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
              {stat.label}
            </p>

            <div className="mt-4 flex items-end justify-between">

              <p className="text-4xl font-black text-white">
                {stat.value}
              </p>

              <p className="text-sm text-gray-400">
                {stat.detail}
              </p>

            </div>

          </div>
        ))}

      </section>

      {/* MODULES */}
      <section className="grid gap-5 xl:grid-cols-4">

        {primaryModules.map((module) => {
          const Icon = module.icon;

          return (
            <Link key={module.href} href={module.href}>
              <div className="group rounded-2xl border border-white/10 bg-white/4.5 p-5 backdrop-blur-xl hover:border-cyan-300/30 hover:bg-white/[0.07]">

                <div className="mb-5 flex items-center justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
                    <Icon />
                  </div>

                  <HiArrowRight className="text-gray-500 group-hover:text-cyan-300" />

                </div>

                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-500">
                  {module.label}
                </p>

                <h3 className="text-xl font-black text-white">
                  {module.title}
                </h3>

                <p className="mt-3 text-sm text-gray-400">
                  {module.description}
                </p>

              </div>
            </Link>
          );
        })}

      </section>

      {/* ACTIVITY */}
      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">

        <div className="rounded-2xl border border-white/10 bg-white/4.5 p-5 backdrop-blur-xl">

          <h3 className="text-2xl font-black text-white">
            Tools & Modules
          </h3>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">

            {secondaryModules.map((module) => {
              const Icon = module.icon;

              return (
                <Link
                  key={module.href}
                  href={module.href}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-4 hover:border-cyan-300/30"
                >

                  <span className="flex items-center gap-3 font-bold text-white">
                    <Icon className="text-cyan-300" />
                    {module.title}
                  </span>

                  <HiArrowRight className="text-gray-500" />

                </Link>
              );
            })}

          </div>

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/4.5 p-5 backdrop-blur-2xl">

          <h3 className="text-2xl font-black text-white">
            Notification Center
          </h3>

          <div className="mt-5 space-y-4">

            {activity.map((item) => (
              <div key={item} className="flex gap-3">

                <span className="mt-2 h-2 w-2 rounded-full bg-cyan-300" />

                <p className="text-sm text-gray-400">
                  {item}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/4.5 p-5 backdrop-blur-2xl">
          <h3 className="text-2xl font-black text-white">
            Analytics Pulse
          </h3>
          <div className="mt-6 space-y-5">
            {dashboardBars.map((bar) => (
              <div key={bar.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-300">{bar.label}</span>
                  <span className="text-cyan-200">{bar.value}</span>
                </div>
                <div className="h-2 rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-cyan-300 to-violet-300"
                    style={{ width: `${bar.width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/4.5 p-5 backdrop-blur-2xl">
          <h3 className="text-2xl font-black text-white">
            Hiring Overview
          </h3>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {[
              ["Open Roles", vacanciesCount],
              ["Applications", "Review"],
              ["Lead Queue", inquiriesCount],
              ["Blog Metrics", blogsCount],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
                  {label}
                </p>
                <p className="mt-3 text-2xl font-black text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
