"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HiArrowLeft, HiCheck, HiUpload } from "react-icons/hi";

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

export default function VacancyDetailsPage() {
  const params = useParams<{ slug: string }>();
  const [job, setJob] = useState<Vacancy | null>(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [jobError, setJobError] = useState("");

  useEffect(() => {
    let active = true;

    fetch("/api/vacancies")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const found = Array.isArray(data)
          ? data.find((item: Vacancy) => item.slug === params.slug)
          : null;

        if (found) {
          setJob(found);
        } else {
          setJobError("Job not found.");
        }
      })
      .catch((err) => {
        if (!active) return;
        setJobError(err?.message || "Unable to load job details.");
      })
      .finally(() => {
        if (active) setLoadingJob(false);
      });

    return () => {
      active = false;
    };
  }, [params.slug]);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      let resumeUrl = "";

      if (cv) {
        const formData = new FormData();
        formData.append("file", cv);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadData.error || "CV upload failed");
        }

        resumeUrl = uploadData.url;
      }

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          phone,
          position: job.title,
          cover_letter: coverLetter,
          resume_url: resumeUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Application failed");
      }

      setFullName("");
      setEmail("");
      setPhone("");
      setCoverLetter("");
      setCv(null);
      setSuccess("Application submitted successfully.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingJob) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#050816] px-6 py-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.10),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <p className="text-white">Loading job details...</p>
        </div>
      </main>
    );
  }

  if (jobError || !job) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#050816] px-6 py-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.10),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="rounded-4xl border border-white/10 bg-white/5 p-12 text-center text-red-300">
            {jobError || "Job not found."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] px-6 py-36">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.10),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <Link
          href="/vacancies"
          className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
        >
          <HiArrowLeft />
          Back to Vacancies
        </Link>

        <div className="mb-16">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Vacancy
          </p>
          <h1 className="text-4xl font-black leading-[1.12] tracking-normal text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {job.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-gray-400">
            {job.description}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_430px]">
          <div className="space-y-8">
            {[
              ["Requirements", job.requirements],
              ["Responsibilities", job.responsibilities],
            ].map(([title, items]) => (
              <div
                key={title as string}
                className="rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
              >
                <h2 className="mb-8 text-2xl font-bold text-white">
                  {title as string}
                </h2>
                <div className="space-y-5">
                  {(items as string[]).map((item) => (
                    <div key={item} className="flex gap-4">
                      <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-300">
                        <HiCheck className="text-sm" />
                      </div>
                      <p className="text-gray-300">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl lg:sticky lg:top-28">
            <h2 className="mb-8 text-3xl font-black text-white">
              Apply Now
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none focus:border-cyan-400/40"
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none focus:border-cyan-400/40"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none focus:border-cyan-400/40"
              />
              <textarea
                rows={4}
                placeholder="Cover letter"
                required
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none focus:border-cyan-400/40"
              />

              <label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed border-white/15 bg-black/20 px-4 py-6 text-center text-gray-400 transition hover:border-cyan-400/30">
                <HiUpload className="text-xl" />
                {cv ? cv.name : "Upload CV / Resume"}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  required
                  className="hidden"
                  onChange={(e) => setCv(e.target.files?.[0] || null)}
                />
              </label>

              {success && <p className="text-sm text-emerald-300">{success}</p>}
              {error && <p className="text-sm text-red-300">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-linear-to-r from-cyan-500 to-violet-500 py-4 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
