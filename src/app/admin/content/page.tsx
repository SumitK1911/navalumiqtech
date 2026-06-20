"use client";

import { useEffect, useMemo, useState } from "react";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminCard from "@/components/admin/ui/AdminCard";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminTable from "@/components/admin/ui/AdminTable";
import AdminTextarea from "@/components/admin/ui/AdminTextarea";

type SectionItem = {
  id: string;
  section: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image: string | null;
  metadata: unknown;
  sortOrder: number;
  active: boolean;
};

const sectionOptions = [
  "testimonials",
  "stats",
  "tech-stack",
  "case-studies",
  "about-principles",
];

const emptyForm = {
  section: "testimonials",
  title: "",
  subtitle: "",
  description: "",
  image: "",
  metadata: "",
  sortOrder: "0",
  active: true,
};

export default function AdminContentPage() {
  const [items, setItems] = useState<SectionItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const filteredItems = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.section === filter);
  }, [filter, items]);

  async function loadItems() {
    try {
      const response = await fetch("/api/section-items?includeInactive=true");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load content.");
      }

      setItems(Array.isArray(data) ? data : []);
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load content."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadItems();
  }, []);

  function updateField(field: keyof typeof form, value: string | boolean) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  }

  function editItem(item: SectionItem) {
    setEditingId(item.id);
    setForm({
      section: item.section,
      title: item.title,
      subtitle: item.subtitle || "",
      description: item.description || "",
      image: item.image || "",
      metadata: item.metadata ? JSON.stringify(item.metadata, null, 2) : "",
      sortOrder: String(item.sortOrder),
      active: item.active,
    });
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const wasEditing = Boolean(editingId);

    try {
      const response = await fetch(
        editingId ? `/api/section-items/${editingId}` : "/api/section-items",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save content.");
      }

      resetForm();
      setNotice(wasEditing ? "Content updated." : "Content created.");
      await loadItems();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save content. Check that metadata is valid JSON."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(id: string) {
    const confirmed = window.confirm("Delete this content item?");
    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/section-items/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete content.");
      }

      if (editingId === id) {
        resetForm();
      }

      setNotice("Content deleted.");
      await loadItems();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete content."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>

      <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
        <AdminCard>
          <h2 className="mb-6 text-2xl font-black text-white">
            {editingId ? "Edit Content" : "Create Content"}
          </h2>

          <form onSubmit={saveItem} className="space-y-5">
            <select
              value={form.section}
              onChange={(e) => updateField("section", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
            >
              {sectionOptions.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
            <AdminInput
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Title or value"
            />
            <AdminInput
              value={form.subtitle}
              onChange={(e) => updateField("subtitle", e.target.value)}
              placeholder="Subtitle, role, category, or suffix"
            />
            <AdminTextarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Description, review, challenge, or supporting text"
            />
            <AdminInput
              value={form.image}
              onChange={(e) => updateField("image", e.target.value)}
              placeholder="Image URL"
            />
            <AdminTextarea
              value={form.metadata}
              onChange={(e) => updateField("metadata", e.target.value)}
              placeholder='Optional JSON, e.g. {"technologies":["Next.js"],"solution":"..."}'
            />
            <AdminInput
              value={form.sortOrder}
              onChange={(e) => updateField("sortOrder", e.target.value)}
              placeholder="Sort order"
              type="number"
            />
            <label className="flex items-center gap-3 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => updateField("active", e.target.checked)}
              />
              Active
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
              <AdminButton type="submit" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Content"
                  : "Save Content"}
              </AdminButton>
              {editingId && (
                <AdminButton
                  type="button"
                  variant="secondary"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </AdminButton>
              )}
            </div>
          </form>
        </AdminCard>

        <AdminCard>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none sm:max-w-xs"
            >
              <option value="all">all sections</option>
              {sectionOptions.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="py-10 text-center text-gray-400">
              Loading content...
            </p>
          ) : (
            <AdminTable headers={["Section", "Title", "Order", "Actions"]}>
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-white/5 transition hover:bg-white/3"
                >
                  <td className="px-6 py-5 text-gray-300">
                    {item.section}
                  </td>
                  <td className="px-6 py-5">
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-400">
                      {item.description}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-gray-400">
                    {item.sortOrder}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <AdminButton
                        variant="secondary"
                        onClick={() => editItem(item)}
                      >
                        Edit
                      </AdminButton>
                      <AdminButton
                        variant="danger"
                        onClick={() => deleteItem(item.id)}
                        disabled={deletingId === item.id}
                      >
                        {deletingId === item.id ? "Deleting..." : "Delete"}
                      </AdminButton>
                    </div>
                  </td>
                </tr>
              ))}
            </AdminTable>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
