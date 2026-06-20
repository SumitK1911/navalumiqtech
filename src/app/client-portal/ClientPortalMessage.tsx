"use client";

import { useState } from "react";
import { HiPaperAirplane, HiCheckCircle, HiChatAlt2 } from "react-icons/hi";

type Props = {
  clientName: string;
  clientEmail: string;
};

const QUICK_TOPICS = [
  "Billing question",
  "Renewal help",
  "Feature request",
  "Technical issue",
];

export default function ClientPortalMessage({ clientName, clientEmail }: Props) {
  const [message, setMessage] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${clientName}${topic ? ` [${topic}]` : ""}`,
          email: clientEmail,
          message: message.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to send. Please try again.");
      setSuccess(true);
      setMessage("");
      setTopic("");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-300">
            <HiChatAlt2 className="text-base" />
          </span>
          <div>
            <h3 className="text-sm font-black text-white">Contact Support</h3>
            <p className="text-[11px] text-gray-500">Avg. response: under 4 hours</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/8 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Online
        </span>
      </div>

      {success ? (
        <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.06] p-5 text-center">
          <HiCheckCircle className="mx-auto mb-2.5 text-3xl text-emerald-400" />
          <p className="text-sm font-bold text-white">Message Sent</p>
          <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">
            We&apos;ve received your message and will reply to <span className="text-cyan-300">{clientEmail}</span> within 4 hours.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-3 text-xs font-bold text-cyan-300 underline hover:text-white transition"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSend} className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {QUICK_TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTopic(topic === t ? "" : t)}
                className={`rounded-full border px-3 py-1 text-[11px] font-bold transition ${
                  topic === t
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                    : "border-white/[0.08] bg-white/[0.03] text-gray-500 hover:text-gray-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your question or issue…"
            className="w-full resize-none rounded-2xl border border-white/[0.08] bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none transition focus:border-cyan-300/40 focus:shadow-[0_0_20px_rgba(6,182,212,0.08)]"
            required
          />

          {error && (
            <p className="rounded-xl border border-rose-400/25 bg-rose-400/[0.06] px-3 py-2 text-xs text-rose-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-black transition hover:bg-cyan-200 hover:scale-[1.01] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-gray-500"
          >
            <HiPaperAirplane className="rotate-45 text-sm" />
            {loading ? "Sending…" : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}
