"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

const adminPageTitles = [
  {
    href: "/admin/blogs",
    eyebrow: "Content Management",
    title: "Blog CMS",
    subtitle: "Manage and publish blog content",
  },
  {
    href: "/admin/services",
    eyebrow: "Public Website",
    title: "Services",
    subtitle: "Manage public service content",
  },
  {
    href: "/admin/content",
    eyebrow: "Content Management",
    title: "Content CMS",
    subtitle: "Manage homepage section content",
  },
  {
    href: "/admin/subscriptions",
    eyebrow: "Revenue",
    title: "Subscriptions",
    subtitle: "Manage pricing packages",
  },
  {
    href: "/admin/vacancies",
    eyebrow: "Hiring",
    title: "Vacancies",
    subtitle: "Manage hiring and open roles",
  },
  {
    href: "/admin/applications",
    eyebrow: "Hiring Pipeline",
    title: "Applications",
    subtitle: "Review candidate submissions",
  },
  {
    href: "/admin/clients",
    eyebrow: "Client Portal",
    title: "Clients",
    subtitle: "Manage client accounts",
  },
  {
    href: "/admin/projects",
    eyebrow: "Portfolio",
    title: "Projects",
    subtitle: "Manage portfolio highlights",
  },
  {
    href: "/admin/media",
    eyebrow: "Asset Management",
    title: "Media Library",
    subtitle: "Manage uploaded assets",
  },
  {
    href: "/admin/inquiries",
    eyebrow: "Leads",
    title: "Inquiries",
    subtitle: "Review incoming leads",
  },
];

export default function AdminLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const currentPage = adminPageTitles.find(
    (page) =>
      pathname === page.href ||
      pathname.startsWith(page.href + "/")
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070b14] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.08),transparent_32%)]" />

      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="relative z-10 flex min-h-screen flex-col lg:pl-72">
        <AdminTopbar
          title={title || currentPage?.title || "Dashboard"}
          eyebrow={currentPage?.eyebrow || "Control Center"}
          subtitle={currentPage?.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="relative z-0 flex-1 px-4 pb-6 pt-32 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
