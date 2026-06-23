"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  HiChartBar,
  HiDocumentText,
  HiPhotograph,
  HiMail,
  HiLogout,
  HiBriefcase,
  HiUserGroup,
  HiClipboardList,
  HiSparkles,
  HiCurrencyDollar,
  HiCollection,
  HiX,
} from "react-icons/hi";

import BrandLogo from "@/components/BrandLogo";
import { brandAccentBorder } from "@/lib/theme";

import { signOut } from "next-auth/react";

const links = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: HiChartBar,
  },
  {
    name: "Blogs",
    href: "/admin/blogs",
    icon: HiDocumentText,
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: HiSparkles,
  },
  {
    name: "Content",
    href: "/admin/content",
    icon: HiCollection,
  },
  {
    name: "Subscriptions",
    href: "/admin/subscriptions",
    icon: HiCurrencyDollar,
  },
  {
    name: "Hiring",
    href: "/admin/vacancies",
    icon: HiBriefcase,
  },
  {
    name: "Applications",
    href: "/admin/applications",
    icon: HiClipboardList,
  },
  {
    name: "Clients",
    href: "/admin/clients",
    icon: HiUserGroup,
  },
  {
    name: "Projects",
    href: "/admin/projects",
    icon: HiDocumentText,
  },
  {
    name: "Media",
    href: "/admin/media",
    icon: HiPhotograph,
  },
  {
    name: "Inquiries",
    href: "/admin/inquiries",
    icon: HiMail,
  },
];

type AdminSidebarProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function AdminSidebar({
  open = false,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[86vw] flex-col overflow-hidden border-r border-white/10 bg-[#080d18]/95 shadow-2xl shadow-black/30 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >

      {/* LOGO */}
      <div className={`m-5 mb-4 flex shrink-0 items-center justify-between gap-4 rounded-3xl border ${brandAccentBorder} bg-white/5 p-4`}>

        <div className="flex items-center gap-3">
          <BrandLogo width={54} />

        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-sky-400">
            Nava Lumiq Tech
          </p>

          <h1 className="text-xl font-black text-slate-100">
            Admin
          </h1>
        </div>
        </div>

        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"
          aria-label="Close admin navigation"
        >
          <HiX className="text-xl" />
        </button>

      </div>

      {/* NAVIGATION */}
      <nav className="min-h-0 flex-1 space-y-1.5 overflow-y-auto px-5 pb-4 pr-3">

        {links.map((link) => {

          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname === link.href ||
                pathname.startsWith(link.href + "/");

        const Icon = link.icon;
  
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition-all duration-200
              ${
                active
                  ? `bg-linear-to-r from-sky-500 via-cyan-400 to-emerald-500 text-black font-black shadow-lg shadow-sky-500/20`
                  : "text-slate-300 hover:bg-white/7 hover:text-white"
              }`}
            >
              <Icon className="text-xl" />

              <span>
                {link.name}
              </span>
            </Link>
          );
        })}

      </nav>

      {/* BOTTOM SECTION */}
      <div className="shrink-0 border-t border-white/10 bg-[#080d18]/95 p-5">

        <div className={`mb-4 rounded-2xl border ${brandAccentBorder} bg-white/5 p-4`}>

          <p className="mb-1 text-xs text-gray-400">
            Logged in as
          </p>

          <h3 className="text-sm font-bold text-white">
            Admin
          </h3>

        </div>

        <button
          onClick={() =>
            signOut({
              callbackUrl: "/admin/login",
            })
          }
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200 transition hover:bg-red-500 hover:text-white"
        >
          <HiLogout className="text-xl" />
          Logout
        </button>

      </div>

    </aside>
    </>
  );
}
