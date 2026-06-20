"use client";

import { signOut } from "next-auth/react";
import { HiLockClosed } from "react-icons/hi";

export default function ClientPortalLogout() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login?callbackUrl=/client-portal" })}
      className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-5 py-3 text-sm font-bold text-emerald-200"
    >
      <HiLockClosed />
      Logout
    </button>
  );
}
