"use client";

import { useState } from "react";

type Props = {
  position: string;
};

export default function ApplicationForm({
  position,
}: Props) {

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    cover_letter: "",
  });

  const [resume, setResume] = useState<File | null>(null);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {

      setLoading(true);

      let resume_url = "";

      // upload cv
      if (resume) {

        const uploadData = new FormData();

        uploadData.append("file", resume);

        const uploadResponse = await fetch(
          "/api/upload",
          {
            method: "POST",
            body: uploadData,
          }
        );

        const uploadResult =
          await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(
            uploadResult.error ||
              "Upload failed"
          );
        }

        resume_url = uploadResult.url;
      }

      // save application
      const response = await fetch(
        "/api/applications",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            ...form,
            position,
            resume_url,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Application failed"
        );
      }

      alert(
        "Application submitted successfully!"
      );

      setForm({
        full_name: "",
        email: "",
        phone: "",
        cover_letter: "",
      });

      setResume(null);

    } catch (error) {

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  }

  return (

    <form
      onSubmit={handleSubmit}
      className="mt-16 rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
    >

      <h3 className="text-3xl font-black text-white mb-8">
        Apply For This Position
      </h3>

      <div className="grid gap-6 md:grid-cols-2">

        <input
          type="text"
          placeholder="Full Name"
          required
          value={form.full_name}
          onChange={(e) =>
            setForm({
              ...form,
              full_name: e.target.value,
            })
          }
          className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none focus:border-cyan-400/40"
        />

        <input
          type="email"
          placeholder="Email Address"
          required
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
          className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none focus:border-cyan-400/40"
        />

      </div>

      <div className="mt-6">

        <input
          type="text"
          placeholder="Phone Number"
          required
          value={form.phone}
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value,
            })
          }
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none focus:border-cyan-400/40"
        />

      </div>

      <div className="mt-6">

        <textarea
          rows={6}
          placeholder="Cover Letter"
          required
          value={form.cover_letter}
          onChange={(e) =>
            setForm({
              ...form,
              cover_letter:
                e.target.value,
            })
          }
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none focus:border-cyan-400/40"
        />

      </div>

      <div className="mt-6">

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          required
          onChange={(e) =>
            setResume(
              e.target.files?.[0] || null
            )
          }
          className="w-full rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 text-gray-400"
        />

      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-8 w-full rounded-2xl bg-linear-to-r from-cyan-400 to-violet-500 px-6 py-4 font-bold text-black transition hover:opacity-90 disabled:opacity-50"
      >

        {loading
          ? "Submitting..."
          : "Submit Application"}

      </button>

    </form>
  );
}
