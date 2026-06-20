"use client";

import { useEffect, useState } from "react";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminCard from "@/components/admin/ui/AdminCard";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminTable from "@/components/admin/ui/AdminTable";
import AdminTextarea from "@/components/admin/ui/AdminTextarea";

type Service = {
  id: string;
  title: string;
  icon: string;
  description: string;
};

const iconOptions = [
  "code",
  "chip",
  "lightning",
  "globe",
  "design",
  "brand",
  "sparkles",
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("sparkles");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadServices() {
    try {
      const response = await fetch("/api/services");
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not load services.");
        return;
      }

      setServices(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not connect to the services API.");
    }
  }

  useEffect(() => {
    let active = true;

    async function loadInitialServices() {
      const response = await fetch("/api/services");
      const data = await response.json();

      if (active) {
        setServices(Array.isArray(data) ? data : []);
      }
    }

    void loadInitialServices();

    return () => {
      active = false;
    };
  }, []);

  function resetForm() {
    setTitle("");
    setIcon("sparkles");
    setDescription("");
    setEditingId(null);
    setError("");
  }

  function editService(service: Service) {
    setEditingId(service.id);
    setTitle(service.title);
    setIcon(service.icon);
    setDescription(service.description);
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveService(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    const wasEditing = Boolean(editingId);

    try {
      const response = await fetch(
        editingId ? `/api/services/${editingId}` : "/api/services",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            icon,
            description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not save service.");
        return;
      }

      resetForm();
      setNotice(wasEditing ? "Service updated." : "Service created.");
      await loadServices();
    } catch {
      setError("Something went wrong while saving the service.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteService(id: string) {
    const confirmed = window.confirm(
      "Delete this service from the public site?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not delete service.");
        return;
      }

      if (editingId === id) {
        resetForm();
      }

      setNotice("Service deleted.");
      await loadServices();
    } catch {
      setError("Something went wrong while deleting the service.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>

      <div className="grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
        <AdminCard>
          <h2 className="mb-6 text-2xl font-black text-white">
            {editingId ? "Edit Service" : "Add Service"}
          </h2>
          <form onSubmit={saveService} className="space-y-5">
            <AdminInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Service title"
            />

            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
            >
              {iconOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <AdminTextarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short service description"
            />

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
                  ? "Update Service"
                  : "Save Service"}
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
          <AdminTable headers={["Service", "Icon", "Status", "Actions"]}>
            {services.map((service) => (
              <tr
                key={service.id}
                className="border-b border-white/5 transition hover:bg-white/3"
              >
                <td className="px-6 py-5">
                  <p className="font-semibold text-white">{service.title}</p>
                  <p className="mt-1 text-sm text-gray-400">
                    {service.description}
                  </p>
                </td>
                <td className="px-6 py-5 text-gray-300">{service.icon}</td>
                <td className="px-6 py-5">
                  <AdminBadge color="success">Live</AdminBadge>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <AdminButton
                      variant="secondary"
                      onClick={() => editService(service)}
                    >
                      Edit
                    </AdminButton>

                  <AdminButton
                    variant="danger"
                    onClick={() => deleteService(service.id)}
                    disabled={deletingId === service.id}
                  >
                    {deletingId === service.id ? "Deleting..." : "Delete"}
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
