"use client";

import { useEffect, useState } from "react";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminCard from "@/components/admin/ui/AdminCard";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminTable from "@/components/admin/ui/AdminTable";
import AdminTextarea from "@/components/admin/ui/AdminTextarea";

type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  features: string[];
  popular: boolean;
};

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [durationDays, setDurationDays] = useState("30");
  const [features, setFeatures] = useState("");
  const [popular, setPopular] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadPlans() {
    try {
      const response = await fetch("/api/subscription-plans");
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not load packages.");
        return;
      }

      setPlans(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not connect to the subscription API.");
    }
  }

  useEffect(() => {
    let active = true;

    async function loadInitialPlans() {
      const response = await fetch("/api/subscription-plans");
      const data = await response.json();

      if (active) {
        setPlans(Array.isArray(data) ? data : []);
      }
    }

    void loadInitialPlans();

    return () => {
      active = false;
    };
  }, []);

  function resetForm() {
    setName("");
    setDescription("");
    setPrice("");
    setDurationDays("30");
    setFeatures("");
    setPopular(false);
    setEditingId(null);
    setError("");
  }

  function editPlan(plan: Plan) {
    setEditingId(plan.id);
    setName(plan.name);
    setDescription(plan.description);
    setPrice(String(plan.price));
    setDurationDays(String(plan.durationDays));
    setFeatures(plan.features.join("\n"));
    setPopular(plan.popular);
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function savePlan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    const wasEditing = Boolean(editingId);

    try {
      const response = await fetch(
        editingId
          ? `/api/subscription-plans/${editingId}`
          : "/api/subscription-plans",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            price,
            durationDays,
            features,
            popular,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not save package.");
        return;
      }

      resetForm();
      setNotice(wasEditing ? "Package updated." : "Package created.");
      await loadPlans();
    } catch {
      setError("Something went wrong while saving the package.");
    } finally {
      setLoading(false);
    }
  }

  async function removePlan(id: string) {
    const confirmed = window.confirm(
      "Remove this package from the public pricing section?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/subscription-plans/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not remove package.");
        return;
      }

      if (editingId === id) {
        resetForm();
      }

      setNotice("Package removed.");
      await loadPlans();
    } catch {
      setError("Something went wrong while removing the package.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>

      <div className="grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
        <AdminCard>
          <h2 className="mb-6 text-2xl font-black text-white">
            {editingId ? "Edit Package" : "Add Package"}
          </h2>
          <form onSubmit={savePlan} className="space-y-5">
            <AdminInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Package name"
            />
            <AdminTextarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <AdminInput
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price, e.g. 7990"
              />
              <AdminInput
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                placeholder="Duration days"
              />
            </div>
            <AdminTextarea
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="One feature per line"
            />

            <label className="flex items-center gap-3 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={popular}
                onChange={(e) => setPopular(e.target.checked)}
              />
              Mark as popular
            </label>

            {error && (
              <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </p>
            )}

            {notice && (
              <p className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                {notice}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <AdminButton type="submit" disabled={loading}>
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Package"
                  : "Save Package"}
              </AdminButton>

              {editingId && (
                <AdminButton
                  type="button"
                  variant="secondary"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </AdminButton>
              )}
            </div>
          </form>
        </AdminCard>

        <AdminCard>
          <AdminTable headers={["Package", "Price", "Duration", "Actions"]}>
            {plans.map((plan) => (
              <tr
                key={plan.id}
                className="border-b border-white/5 transition hover:bg-white/3"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-white">{plan.name}</p>
                    {plan.popular && <AdminBadge color="success">Popular</AdminBadge>}
                  </div>
                  <p className="mt-1 text-sm text-gray-400">
                    {plan.description}
                  </p>
                </td>
                <td className="px-6 py-5 text-gray-300">
                  Rs. {plan.price.toLocaleString()}
                </td>
                <td className="px-6 py-5 text-gray-400">
                  {plan.durationDays} days
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <AdminButton
                      variant="secondary"
                      onClick={() => editPlan(plan)}
                    >
                      Edit
                    </AdminButton>

                    <AdminButton
                      variant="danger"
                      onClick={() => removePlan(plan.id)}
                      disabled={deletingId === plan.id}
                    >
                      {deletingId === plan.id ? "Removing..." : "Remove"}
                    </AdminButton>
                  </div>
                </td>
              </tr>
            ))}
          </AdminTable>
        </AdminCard>
      </div>
    </div>
  );
}
