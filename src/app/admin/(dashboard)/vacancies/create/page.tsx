"use client";

import { useState } from "react";

import {
  HiBriefcase,
  HiLocationMarker,
  HiCash,
  HiDocumentText,
} from "react-icons/hi";

export default function CreateVacancyPage() {

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    location: "",
    salary: "",
    type: "Full Time",
    description: "",
    requirements: "",
    responsibilities: "",
  });

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      const response = await fetch(
        "/api/vacancies",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            ...form,

            requirements:
              form.requirements
                .split("\n"),

            responsibilities:
              form.responsibilities
                .split("\n"),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "Failed to create vacancy"
        );
      }

      alert(
        result.success
          ? "Vacancy created successfully!"
          : result.warning ||
              "Vacancy created with warnings."
      );

      setForm({
        title: "",
        slug: "",
        location: "",
        salary: "",
        type: "Full Time",
        description: "",
        requirements: "",
        responsibilities: "",
      });

    } catch (error) {

      console.error(error);

      alert(
        "Something went wrong."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <main className="p-8">

      {/* top */}
      <div className="mb-12">

        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          Admin Panel
        </p>

        <h1 className="mt-3 text-4xl font-black text-white">
          Create Vacancy
        </h1>

      </div>

      {/* form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl space-y-8"
      >

        {/* basic info */}
        <div className="rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

          <div className="grid gap-6 md:grid-cols-2">

            {/* title */}
            <div>

              <label className="mb-3 block text-sm font-medium text-gray-300">
                Job Title
              </label>

              <div className="relative">

                <HiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                <input
                  type="text"
                  placeholder="Frontend Developer"
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/30 py-4 pl-12 pr-4 text-white outline-none transition focus:border-cyan-400/40"
                />

              </div>

            </div>

            {/* slug */}
            <div>

              <label className="mb-3 block text-sm font-medium text-gray-300">
                Slug
              </label>

              <input
                type="text"
                placeholder="frontend-developer"
                required
                value={form.slug}
                onChange={(e) =>
                  setForm({
                    ...form,
                    slug: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition focus:border-cyan-400/40"
              />

            </div>

            {/* location */}
            <div>

              <label className="mb-3 block text-sm font-medium text-gray-300">
                Location
              </label>

              <div className="relative">

                <HiLocationMarker className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                <input
                  type="text"
                  placeholder="Kathmandu, Nepal"
                  required
                  value={form.location}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location: e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/30 py-4 pl-12 pr-4 text-white outline-none transition focus:border-cyan-400/40"
                />

              </div>

            </div>

            {/* salary */}
            <div>

              <label className="mb-3 block text-sm font-medium text-gray-300">
                Salary
              </label>

              <div className="relative">

                <HiCash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                <input
                  type="text"
                  placeholder="Rs. 50,000 - 80,000"
                  required
                  value={form.salary}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      salary: e.target.value,
                    })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/30 py-4 pl-12 pr-4 text-white outline-none transition focus:border-cyan-400/40"
                />

              </div>

            </div>

            {/* type */}
            <div>

              <label className="mb-3 block text-sm font-medium text-gray-300">
                Job Type
              </label>

              <select
                value={form.type}
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value,
                  })
                }
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition focus:border-cyan-400/40"
              >

                <option>
                  Full Time
                </option>

                <option>
                  Part Time
                </option>

                <option>
                  Contract
                </option>

                <option>
                  Internship
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* description */}
        <div className="rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

          <label className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-300">

            <HiDocumentText />

            Job Description

          </label>

          <textarea
            rows={6}
            placeholder="Describe the role..."
            required
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition focus:border-cyan-400/40"
          />

        </div>

        {/* requirements */}
        <div className="rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

          <label className="mb-4 block text-sm font-medium text-gray-300">
            Requirements
          </label>

          <textarea
            rows={6}
            placeholder="One requirement per line..."
            required
            value={form.requirements}
            onChange={(e) =>
              setForm({
                ...form,
                requirements: e.target.value,
              })
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition focus:border-cyan-400/40"
          />

        </div>

        {/* responsibilities */}
        <div className="rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

          <label className="mb-4 block text-sm font-medium text-gray-300">
            Responsibilities
          </label>

          <textarea
            rows={6}
            placeholder="One responsibility per line..."
            required
            value={form.responsibilities}
            onChange={(e) =>
              setForm({
                ...form,
                responsibilities: e.target.value,
              })
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition focus:border-cyan-400/40"
          />

        </div>

        {/* submit */}
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-linear-to-r from-cyan-500 to-violet-500 px-8 py-4 font-semibold text-white transition hover:opacity-90"
        >

          {loading
            ? "Creating Vacancy..."
            : "Create Vacancy"}

        </button>

      </form>

    </main>
  );
}