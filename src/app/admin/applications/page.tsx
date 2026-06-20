"use client";

import { useEffect, useState } from "react";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminButton from "@/components/admin/ui/AdminButton";
import AdminCard from "@/components/admin/ui/AdminCard";
import AdminTable from "@/components/admin/ui/AdminTable";
import EmptyState from "@/components/admin/ui/EmptyState";

type Application = {
  id?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  position?: string;
  cover_letter?: string;
  resume_url?: string;
  status?: string;
  created_at?: string;
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadApplications(active = true) {
      try {
        const response = await fetch("/api/applications");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load applications");
        }

        if (active) {
          setApplications(Array.isArray(data) ? data : []);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Applications could not be loaded."
          );
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
    void loadApplications(active);

    return () => {
      active = false;
    };
  }, []);

  async function updateApplicationStatus(id: string, status: string) {
    setUpdatingId(id);
    setError("");

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not update application.");
      }

      await loadApplications();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update application."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteApplication(id: string) {
    const confirmed = window.confirm("Delete this application?");
    if (!confirmed) return;

    setUpdatingId(id);
    setError("");

    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not delete application.");
      }

      await loadApplications();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete application."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>

      <AdminCard>
        {loading ? (
          <p className="py-10 text-center text-gray-400">
            Loading applications...
          </p>
        ) : error ? (
          <EmptyState title="Unable to load applications" description={error} />
        ) : applications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            description="Applications submitted from the vacancy page will appear here."
          />
        ) : (
          <AdminTable
            headers={["Candidate", "Position", "Phone", "CV", "Status", "Actions"]}
          >
            {applications.map((application, index) => (
              <tr
                key={application.id || `${application.email}-${index}`}
                className="border-b border-white/5 transition hover:bg-white/3"
              >
                <td className="px-6 py-5">
                  <p className="font-semibold text-white">
                    {application.full_name || "Unnamed"}
                  </p>
                  <p className="text-sm text-cyan-400">{application.email}</p>
                </td>
                <td className="px-6 py-5 text-gray-300">
                  {application.position || "Not specified"}
                </td>
                <td className="px-6 py-5 text-gray-400">
                  {application.phone || "-"}
                </td>
                <td className="px-6 py-5">
                  {application.resume_url ? (
                    <a
                      href={application.resume_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-300 hover:text-white"
                    >
                      View CV
                    </a>
                  ) : (
                    <span className="text-gray-500">No CV</span>
                  )}
                </td>
                <td className="px-6 py-5">
                  <AdminBadge>
                    {application.status || "new"}
                  </AdminBadge>
                </td>
                <td className="px-6 py-5">
                  {application.id && (
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <AdminButton
                        variant="secondary"
                        onClick={() =>
                          updateApplicationStatus(
                            application.id as string,
                            "reviewing"
                          )
                        }
                        disabled={updatingId === application.id}
                      >
                        Review
                      </AdminButton>
                      <AdminButton
                        variant="danger"
                        onClick={() =>
                          deleteApplication(application.id as string)
                        }
                        disabled={updatingId === application.id}
                      >
                        Delete
                      </AdminButton>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>
    </div>
  );
}
