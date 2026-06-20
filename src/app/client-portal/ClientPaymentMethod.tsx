"use client";

import { useState } from "react";
import { triggerNotification } from "./ClientPortalActions";

type Props = {
  clientEmail: string;
  planId: string;
  amount: number;
};

export default function ClientPaymentMethod({ clientEmail, planId, amount }: Props) {
  const [updating, setUpdating] = useState(false);
  const [primaryMethod, setPrimaryMethod] = useState<"esewa" | "khalti">("esewa");

  const handlePayment = async (method: "esewa" | "khalti") => {
    setUpdating(true);
    const methodName = method === "esewa" ? "Esewa" : "Khalti";
    
    try {
      triggerNotification(`Processing ${methodName} payment...`, "info");

      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method,
          planId,
          amount,
        }),
      });

      if (!response.ok) throw new Error("Payment initiation failed");

      const data = await response.json();
      
      if (data.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = data.paymentUrl;
      }
    } catch (error: any) {
      triggerNotification(`Payment failed: ${error.message}`, "error");
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Esewa Payment Method */}
      <div className="rounded-xl border border-white/[0.07] bg-white/2 p-4 flex items-center justify-between hover:bg-white/4 transition">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300 font-bold text-xs">
            E
          </span>
          <div>
            <p className="text-xs font-bold text-white">Esewa Wallet</p>
            <p className="text-[10px] text-gray-500">Digital Payment Account</p>
          </div>
        </div>
        {primaryMethod === "esewa" && (
          <span className="rounded-full bg-emerald-400/10 border border-emerald-400/25 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
            Primary
          </span>
        )}
      </div>

      {/* Khalti Payment Method */}
      <div className="rounded-xl border border-white/[0.07] bg-white/2 p-4 flex items-center justify-between hover:bg-white/4 transition">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-400/10 text-purple-300 font-bold text-xs">
            K
          </span>
          <div>
            <p className="text-xs font-bold text-white">Khalti Wallet</p>
            <p className="text-[10px] text-gray-500">Digital Payment Account</p>
          </div>
        </div>
        {primaryMethod === "khalti" && (
          <span className="rounded-full bg-emerald-400/10 border border-emerald-400/25 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
            Primary
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2">
        <button 
          disabled={updating}
          onClick={() => {
            setPrimaryMethod("esewa");
            handlePayment("esewa");
          }}
          className="rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 disabled:opacity-50 px-4 py-2.5 text-xs font-bold text-emerald-300 transition"
        >
          {updating ? "Processing..." : "Pay with Esewa"}
        </button>
        <button 
          disabled={updating}
          onClick={() => {
            setPrimaryMethod("khalti");
            handlePayment("khalti");
          }}
          className="rounded-xl bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-50 px-4 py-2.5 text-xs font-bold text-purple-300 transition"
        >
          {updating ? "Processing..." : "Pay with Khalti"}
        </button>
      </div>
    </div>
  );
}
