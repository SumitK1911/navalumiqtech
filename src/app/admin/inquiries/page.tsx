"use client";

import { useEffect, useState } from "react";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminCard from "@/components/admin/ui/AdminCard";
import EmptyState from "@/components/admin/ui/EmptyState";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  message: string;
  status?: string;
  createdAt?: string;
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadInquiries(active = true) {
    try {
      const response = await fetch("/api/inquiries");

      if (!response.ok) {
        throw new Error("Failed to load inquiries");
      }

      const data = await response.json();

      if (active) {
        setInquiries(Array.isArray(data) ? data : []);
        setError("");
      }
    } catch {
      if (active) {
        setInquiries([]);
        setError("Inquiries could not be loaded right now.");
      }
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadInquiries(active);
    return () => {
      active = false;
    };
  }, []);

  async function deleteInquiry(id: string) {
    const confirmed = window.confirm("Delete this inquiry?");
    if (!confirmed) return;

    setDeletingId(id);

    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Could not delete inquiry.");
      }

      await loadInquiries();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Could not delete inquiry.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>

      <AdminCard>
        {loading ? (
          <p className="py-10 text-center text-gray-400">
            Loading inquiries...
          </p>
        ) : error ? (
          <EmptyState title="Unable to load inquiries" description={error} />
        ) : inquiries.length === 0 ? (
          <EmptyState
            title="No inquiries yet"
            description="New contact, hiring, and client portal requests will appear here."
          />
        ) : (
          <div className="grid gap-5">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="rounded-3xl border border-white/10 bg-black/25 p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-white">
                      {inquiry.name}
                    </h2>
                    <p className="mt-1 text-cyan-400">{inquiry.email}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <AdminBadge
                      color={
                        inquiry.status === "resolved" ? "success" : "default"
                      }
                    >
                      {inquiry.status ?? "new"}
                    </AdminBadge>

                    <span className="text-sm text-gray-500">
                      {inquiry.createdAt
                        ? new Date(inquiry.createdAt).toLocaleDateString()
                        : ""}
                    </span>

                    <AdminButton
                      variant="danger"
                      onClick={() => deleteInquiry(inquiry.id)}
                      disabled={deletingId === inquiry.id}
                    >
                      {deletingId === inquiry.id ? "Deleting…" : "Delete"}
                    </AdminButton>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="leading-relaxed text-gray-300">
                    {inquiry.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
