"use client";

import { useState } from "react";
import { triggerNotification } from "./ClientPortalActions";

type Props = {
  expired: boolean;
};

export default function ClientRenewalCenter({ expired }: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleRenew = () => {
    setLoading("renew");
    triggerNotification("Processing instant cycle renewal request...", "info");
    
    setTimeout(() => {
      setLoading(null);
      triggerNotification("Renewal processed. Next cycle subscription extended.", "success");
    }, 2000);
  };

  const handleAnnual = () => {
    setLoading("annual");
    triggerNotification("Transitioning cycle terms to Annual Plan...", "info");
    
    setTimeout(() => {
      setLoading(null);
      triggerNotification("Switched billing cycle to Annual terms (10% discount applied next invoice).", "success");
    }, 2000);
  };

  return (
    <div className="mt-4 flex gap-2">
      <button 
        disabled={loading !== null}
        onClick={handleAnnual}
        className="flex-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] px-3 py-2.5 text-center text-xs font-bold text-white transition disabled:opacity-50"
      >
        {loading === "annual" ? "Updating terms..." : "Change to Annual"}
      </button>
      <button 
        disabled={loading !== null}
        onClick={handleRenew}
        className="flex-1 rounded-xl bg-cyan-300 hover:bg-cyan-200 px-3 py-2.5 text-center text-xs font-black text-black transition disabled:opacity-50"
      >
        {loading === "renew" ? "Processing..." : expired ? "Activate Workspace" : "Renew Now"}
      </button>
    </div>
  );
}
