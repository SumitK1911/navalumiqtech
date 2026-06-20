"use client";

import {
  HiSearch,
  HiBell,
  HiMenuAlt2,
} from "react-icons/hi";

type Props = {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  onMenuClick?: () => void;
};

import { brandAccentBorder } from "@/lib/theme";

export default function AdminTopbar({
  title,
  eyebrow = "Dashboard Panel",
  subtitle,
  onMenuClick,
}: Props) {

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header className={`fixed left-0 right-0 top-0 z-40 border-b ${brandAccentBorder} bg-[#070b14]/95 px-4 py-4 shadow-lg shadow-black/20 backdrop-blur-2xl sm:px-6 lg:left-72 lg:px-8`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">

        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-4">
          <button
            onClick={onMenuClick}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${brandAccentBorder} bg-white/5 text-white lg:hidden`}
            aria-label="Open admin navigation"
          >
            <HiMenuAlt2 className="text-2xl" />
          </button>

          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-sky-400">
              {eyebrow}
            </p>

            <h1 className="truncate text-2xl font-black text-white md:text-3xl">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-1 text-sm text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex shrink-0 items-center gap-3">
          <div className={`hidden w-72 items-center gap-3 rounded-xl border ${brandAccentBorder} bg-white/5 px-4 py-3 xl:flex`}>
            <HiSearch className="text-sky-300 text-xl" />

            <input
              placeholder="Search..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-sky-400"
            />
          </div>

          <button className={`flex h-11 w-11 items-center justify-center rounded-xl border ${brandAccentBorder} bg-white/5 transition hover:bg-sky-500/10`}>
            <HiBell className="text-xl text-white" />
          </button>

          <div className={`hidden rounded-xl border ${brandAccentBorder} bg-white/5 px-4 py-2.5 sm:block`}>
            <p className="text-xs text-slate-300">
              {today}
            </p>

            <h3 className="text-sm font-bold text-white">
              Admin
            </h3>
          </div>
        </div>

      </div>
    </header>
  );
}
