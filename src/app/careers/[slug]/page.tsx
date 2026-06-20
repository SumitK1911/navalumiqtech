import ApplicationForm from "@/components/careers/ApplicationForm";
import { prisma } from "@/lib/prisma";
import { vacancies as fallbackVacancies } from "@/lib/vacancies";
import { notFound } from "next/navigation";
import { HiCheck } from "react-icons/hi";

type Vacancy = {
  id: string | number;
  slug: string;
  title: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
};

async function getJob(slug: string): Promise<Vacancy | null> {
  try {
    const vacancy = await prisma.vacancy.findFirst({
      where: {
        slug,
        active: true,
      },
    });

    return (
      vacancy ??
      fallbackVacancies.find((item) => item.slug === slug) ??
      null
    );
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;

  const job = await getJob(slug);

  if (!job) {
    notFound();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] px-6 pb-32 pt-40">

      {/* atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.08),transparent_60%)]" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* top */}
        <div className="mb-16">

          <p className="text-cyan-400 uppercase tracking-[0.3em] text-xs font-semibold mb-4">
            Careers
          </p>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter">
            {job.title}
          </h1>

          <p className="mt-6 text-lg text-gray-400 max-w-3xl">
            {job.description}
          </p>

        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-12">

          {/* LEFT */}
          <div className="space-y-10">

            {/* requirements */}
            <div className="rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

              <h2 className="text-2xl font-bold text-white mb-8">
                Requirements
              </h2>

              <div className="space-y-5">

                {job.requirements.map((item) => (

                  <div
                    key={item}
                    className="flex gap-4"
                  >

                    <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-300">

                      <HiCheck className="text-sm" />

                    </div>

                    <p className="text-gray-300">
                      {item}
                    </p>

                  </div>

                ))}

              </div>

            </div>

            {/* responsibilities */}
            <div className="rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

              <h2 className="text-2xl font-bold text-white mb-8">
                Responsibilities
              </h2>

              <div className="space-y-5">

                {job.responsibilities.map((item) => (

                  <div
                    key={item}
                    className="flex gap-4"
                  >

                    <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-violet-400/20 text-violet-300">

                      <HiCheck className="text-sm" />

                    </div>

                    <p className="text-gray-300">
                      {item}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          </div>

          {/* RIGHT APPLY FORM */}
          <div className="sticky top-28 h-fit">

            <ApplicationForm
              position={job.title}
            />

          </div>

        </div>

      </div>

    </main>
  );
}
