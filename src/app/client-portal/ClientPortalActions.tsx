"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  HiCheckCircle,
  HiExclamationCircle, 
  HiX, 
  HiAdjustments 
} from "react-icons/hi";

// Extend window object
declare global {
  interface Window {
    triggerPortalToast?: (message: string, type?: "success" | "error" | "info") => void;
  }
}

// Shared toast event channel or simple state
type ToastState = {
  show: boolean;
  message: string;
  type: "success" | "error" | "info";
};

export default function ClientPortalActions() {
  const [toast, setToast] = useState<ToastState>({ show: false, message: "", type: "success" });

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  }, []);

  // Expose triggers globally for static elements to invoke
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.triggerPortalToast = showToast;
    }
  }, [showToast]);

  if (!toast.show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className={`flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl ${
        toast.type === "success" 
          ? "border-emerald-500/30 bg-emerald-950/80 text-emerald-200" 
          : toast.type === "error"
          ? "border-rose-500/30 bg-rose-950/80 text-rose-200"
          : "border-cyan-500/30 bg-cyan-950/80 text-cyan-200"
      }`}>
        {toast.type === "success" && <HiCheckCircle className="text-xl shrink-0" />}
        {toast.type === "error" && <HiExclamationCircle className="text-xl shrink-0" />}
        {toast.type === "info" && <HiAdjustments className="text-xl shrink-0" />}
        
        <div className="text-xs font-semibold pr-2">{toast.message}</div>
        
        <button 
          onClick={() => setToast(prev => ({ ...prev, show: false }))}
          className="text-white/50 hover:text-white transition shrink-0"
        >
          <HiX />
        </button>
      </div>
    </div>
  );
}

// Helper to safely trigger the toast from any interactive component
export function triggerNotification(message: string, type: "success" | "error" | "info" = "success") {
  if (typeof window !== "undefined" && window.triggerPortalToast) {
    window.triggerPortalToast(message, type);
  }
}
