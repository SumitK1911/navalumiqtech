"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminCard from "@/components/admin/ui/AdminCard";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminTable from "@/components/admin/ui/AdminTable";
import AdminTextarea from "@/components/admin/ui/AdminTextarea";
import { HiEye } from "react-icons/hi";

type Vacancy = {
  id: string;
  slug: string;
  title: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
};

const emptyForm = {
  title: "",
  slug: "",
  location: "",
  salary: "",
  type: "Full Time",
  description: "",
  requirements: "",
  responsibilities: "",
};

export default function AdminVacanciesPage() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadVacancies() {
    try {
      const response = await fetch("/api/vacancies?includeInactive=true");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load vacancies.");
      }

      setVacancies(Array.isArray(data) ? data : []);
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load vacancies."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadVacancies();
  }, []);

  function updateField(field: keyof typeof form, value: string) {
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

  function editVacancy(vacancy: Vacancy) {
    setEditingId(vacancy.id);
    setForm({
      title: vacancy.title,
      slug: vacancy.slug,
      location: vacancy.location,
      salary: vacancy.salary,
      type: vacancy.type,
      description: vacancy.description,
      requirements: vacancy.requirements.join("\n"),
      responsibilities: vacancy.responsibilities.join("\n"),
    });
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveVacancy(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const wasEditing = Boolean(editingId);

    try {
      const response = await fetch(
        editingId ? `/api/vacancies/${editingId}` : "/api/vacancies",
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
        throw new Error(data.error || "Unable to save vacancy.");
      }

      resetForm();
      setNotice(wasEditing ? "Vacancy updated." : "Vacancy created.");
      await loadVacancies();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save vacancy."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteVacancy(id: string) {
    const confirmed = window.confirm(
      "Remove this vacancy from the public site?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/vacancies/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to remove vacancy.");
      }

      if (editingId === id) {
        resetForm();
      }

      setNotice("Vacancy removed.");
      await loadVacancies();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to remove vacancy."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="mb-10">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400">
          Hiring
        </p>
        <h1 className="mt-3 text-4xl font-black text-white">
          Vacancy Management
        </h1>
        <p className="mt-3 max-w-2xl text-gray-400">
          Create, update, and remove public job listings from the database.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr]">
        <AdminCard>
          <h2 className="mb-6 text-2xl font-black text-white">
            {editingId ? "Edit Vacancy" : "Create Vacancy"}
          </h2>

          <form onSubmit={saveVacancy} className="space-y-5">
            <AdminInput
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Job title"
            />
            <AdminInput
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              placeholder="Slug, optional for new vacancies"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <AdminInput
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Location"
              />
              <AdminInput
                value={form.salary}
                onChange={(e) => updateField("salary", e.target.value)}
                placeholder="Salary"
              />
            </div>
            <select
              value={form.type}
              onChange={(e) => updateField("type", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none"
            >
              <option>Full Time</option>
              <option>Part Time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
            <AdminTextarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Description"
            />
            <AdminTextarea
              value={form.requirements}
              onChange={(e) => updateField("requirements", e.target.value)}
              placeholder="One requirement per line"
            />
            <AdminTextarea
              value={form.responsibilities}
              onChange={(e) =>
                updateField("responsibilities", e.target.value)
              }
              placeholder="One responsibility per line"
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
              <AdminButton type="submit" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Vacancy"
                  : "Create Vacancy"}
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
          {loading ? (
            <p className="py-10 text-center text-gray-400">
              Loading vacancies...
            </p>
          ) : (
            <AdminTable
              headers={["Position", "Type", "Location", "Salary", "Actions"]}
            >
              {vacancies.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-white/5 transition hover:bg-white/3"
                >
                  <td className="px-6 py-5">
                    <p className="font-semibold text-white">{job.title}</p>
                    <p className="text-sm text-gray-500">{job.slug}</p>
                  </td>
                  <td className="px-6 py-5 text-gray-300">{job.type}</td>
                  <td className="px-6 py-5 text-gray-300">{job.location}</td>
                  <td className="px-6 py-5 text-gray-300">{job.salary}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Link
                        href={`/vacancies/${job.slug}`}
                        className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-bold text-white transition hover:bg-white/20"
                      >
                        <HiEye />
                      </Link>
                      <AdminButton
                        variant="secondary"
                        onClick={() => editVacancy(job)}
                      >
                        Edit
                      </AdminButton>
                      <AdminButton
                        variant="danger"
                        onClick={() => deleteVacancy(job.id)}
                        disabled={deletingId === job.id}
                      >
                        {deletingId === job.id ? "Removing..." : "Remove"}
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
