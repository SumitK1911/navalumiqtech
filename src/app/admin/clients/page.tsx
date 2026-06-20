"use client";

import { useEffect, useState } from "react";
import AdminBadge from "@/components/admin/ui/AdminBadge";
import AdminCard from "@/components/admin/ui/AdminCard";
import AdminTable from "@/components/admin/ui/AdminTable";

type Client = {
  id: string;
  name: string | null;
  email: string;
  packageName: string | null;
  subscriptionStart: string | null;
  subscriptionEnd: string | null;
};

function formatDate(date: string | null) {
  if (!date) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function getStatus(subscriptionEnd: string | null) {
  if (!subscriptionEnd) {
    return "No subscription";
  }

  return new Date(subscriptionEnd).getTime() > Date.now()
    ? "Active"
    : "Expired";
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    async function loadClients() {
      const response = await fetch("/api/clients");
      const data = await response.json();
      setClients(Array.isArray(data) ? data : []);
    }

    void loadClients();
  }, []);

  return (
    <div>

      <AdminCard>
        <AdminTable headers={["Client", "Package", "Subscription", "Status"]}>
          {clients.map((client) => {
            const status = getStatus(client.subscriptionEnd);

            return (
              <tr
                key={client.id}
                className="border-b border-white/5 transition hover:bg-white/3"
              >
                <td className="px-6 py-5">
                  <p className="font-semibold text-white">
                    {client.name || "Unnamed client"}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">{client.email}</p>
                </td>
                <td className="px-6 py-5 text-gray-300">
                  {client.packageName || "Not selected"}
                </td>
                <td className="px-6 py-5 text-gray-400">
                  {formatDate(client.subscriptionStart)} -{" "}
                  {formatDate(client.subscriptionEnd)}
                </td>
                <td className="px-6 py-5">
                  <AdminBadge color={status === "Active" ? "success" : "default"}>
                    {status}
                  </AdminBadge>
                </td>
              </tr>
            );
          })}
        </AdminTable>
      </AdminCard>
    </div>
  );
}
