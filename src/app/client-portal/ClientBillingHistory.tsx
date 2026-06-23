"use client";

import { useState } from "react";
import { HiDocumentDownload } from "react-icons/hi";
import { triggerNotification } from "./ClientPortalActions";

type Invoice = {
  id: string;
  date: string;
  amount: number;
  status: string;
  method: string;
};

type Props = {
  invoices: Invoice[];
};

export default function ClientBillingHistory({ invoices }: Props) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = (id: string) => {
    setDownloadingId(id);
    triggerNotification(`Generating statement ${id} for download...`, "info");
    
    setTimeout(() => {
      setDownloadingId(null);
      triggerNotification(`Invoice ${id} downloaded successfully.`, "success");
    }, 1500);
  };

  return (
    <div className="divide-y divide-white/6">
      {invoices.map((inv) => (
        <div key={inv.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
          <div className="min-w-0">
            <p className="text-xs font-bold text-white">{inv.id}</p>
            <p className="mt-0.5 text-[10px] text-gray-500">{inv.date} • {inv.method}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-right text-xs font-semibold text-white">
              Rs. {inv.amount.toLocaleString("en-IN")}
            </span>
            <button 
              disabled={downloadingId !== null}
              onClick={() => handleDownload(inv.id)}
              className="flex items-center gap-1 rounded-lg bg-white/4 hover:bg-white/8 px-2.5 py-1.5 text-[10px] font-bold text-cyan-300 transition disabled:opacity-50"
            >
              <HiDocumentDownload />
              {downloadingId === inv.id ? "Preparing..." : "PDF"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
