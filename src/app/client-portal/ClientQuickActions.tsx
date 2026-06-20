"use client";

import { useState } from "react";
import { triggerNotification } from "./ClientPortalActions";

export default function ClientQuickActions() {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = (name: string, description: string) => {
    setLoadingAction(name);
    triggerNotification(`Initializing self-service action: ${name}...`, "info");

    setTimeout(() => {
      setLoadingAction(null);
      triggerNotification(`${description} successfully.`, "success");
    }, 1800);
  };

  const actions = [
    { name: "Manage API Keys", desc: "API credentials rotated and updated", detail: "Access tokens & integrations" },
    { name: "Cancel Auto-Renew", desc: "Auto-renew disabled. Subscriptions will lapse at cycle end", detail: "Opt out of automatic billing" },
    { name: "Request Custom SLA", desc: "SLA negotiation inquiry sent to accounts team", detail: "Bespoke contract clauses" },
    { name: "Team Members", desc: "Workspace invites refreshed and updated", detail: "Manage seat authorizations" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {actions.map((act) => (
        <button
          key={act.name}
          disabled={loadingAction !== null}
          onClick={() => handleAction(act.name, act.desc)}
          className="rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 px-4 py-3 text-left text-xs text-gray-400 hover:text-white transition disabled:opacity-60"
        >
          <p className="font-bold text-white">
            {loadingAction === act.name ? "Running..." : act.name}
          </p>
          <p className="text-[9px] text-gray-500 mt-0.5">{act.detail}</p>
        </button>
      ))}
    </div>
  );
}
