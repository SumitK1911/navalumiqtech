"use client";

import { useEffect, useState } from "react";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminCard from "@/components/admin/ui/AdminCard";
import AdminInput from "@/components/admin/ui/AdminInput";
import AdminTable from "@/components/admin/ui/AdminTable";
import AdminTextarea from "@/components/admin/ui/AdminTextarea";

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  result: string;
  status?: string;
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("/projects/project1.jpg");
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("completed");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadProjects() {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not load projects.");
        return;
      }

      setProjects(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not connect to the projects API.");
    }
  }

  useEffect(() => {
    let active = true;

    async function loadInitialProjects() {
      const response = await fetch("/api/projects");
      const data = await response.json();

      if (active) {
        setProjects(Array.isArray(data) ? data : []);
      }
    }

    void loadInitialProjects();

    return () => {
      active = false;
    };
  }, []);

  function resetForm() {
    setTitle("");
    setDescription("");
    setImage("/projects/project1.jpg");
    setResult("");
    setStatus("completed");
    setEditingId(null);
    setError("");
  }

  function editProject(project: Project) {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setImage(project.image);
    setResult(project.result);
    setStatus(project.status || "completed");
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    const wasEditing = Boolean(editingId);

    try {
      const response = await fetch(
        editingId ? `/api/projects/${editingId}` : "/api/projects",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            image,
            result,
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not save project.");
        return;
      }

      resetForm();
      setNotice(wasEditing ? "Project updated." : "Project created.");
      await loadProjects();
    } catch {
      setError("Something went wrong while saving the project.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProject(id: string) {
    const confirmed = window.confirm(
      "Delete this project from the public site?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not delete project.");
        return;
      }

      if (editingId === id) {
        resetForm();
      }

      setNotice("Project deleted.");
      await loadProjects();
    } catch {
      setError("Something went wrong while deleting the project.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>

      <div className="grid gap-8 xl:grid-cols-[0.8fr_1.2fr]">
        <AdminCard>
          <h2 className="mb-6 text-2xl font-black text-white">
            {editingId ? "Edit Project" : "Add Project"}
          </h2>
          <form onSubmit={saveProject} className="space-y-5">
            <AdminInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project title"
            />
            <AdminInput
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Image URL or /projects/project1.jpg"
            />
            <AdminTextarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short project description"
            />
            <AdminTextarea
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="Result or impact"
            />
            
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-400">Project Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition focus:border-cyan-400/50 focus:bg-slate-900"
              >
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="draft">Draft</option>
              </select>
            </div>

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
                  ? "Update Project"
                  : "Save Project"}
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
          <AdminTable headers={["Project", "Result", "Status", "Actions"]}>
            {projects.map((project) => (
              <tr
                key={project.id}
                className="border-b border-white/5 transition hover:bg-white/3"
              >
                <td className="px-6 py-5">
                  <p className="font-semibold text-white">{project.title}</p>
                  <p className="mt-1 text-sm text-gray-400">
                    {project.description}
                  </p>
                </td>
                <td className="px-6 py-5 text-gray-300">{project.result}</td>
                <td className="px-6 py-5">
                  <AdminBadge color={project.status === "completed" ? "success" : "default"}>
                    {project.status || "completed"}
                  </AdminBadge>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <AdminButton
                      variant="secondary"
                      onClick={() => editProject(project)}
                    >
                      Edit
                    </AdminButton>

                  <AdminButton
                    variant="danger"
                    onClick={() => deleteProject(project.id)}
                    disabled={deletingId === project.id}
                  >
                    {deletingId === project.id ? "Deleting..." : "Delete"}
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
