import Link from "next/link";
import { notFound } from "next/navigation";
import { HiArrowLeft, HiCheckCircle } from "react-icons/hi";

const projects = [
  {
    slug: "ai-saas-dashboard",
    title: "AI SaaS Dashboard",
    category: "Artificial Intelligence",
    description:
      "Enterprise AI analytics platform with real-time dashboards, automation, reporting, and admin-ready product operations.",
    points: [
      "Role-based analytics dashboards",
      "AI-assisted workflows",
      "Admin reporting and content controls",
    ],
  },
  {
    slug: "luxury-real-estate-platform",
    title: "Luxury Real Estate Platform",
    category: "Web Platform",
    description:
      "Premium property marketplace with immersive browsing, advanced search, client inquiries, and managed listing operations.",
    points: [
      "Responsive property discovery",
      "Lead capture and inquiry routing",
      "Admin-managed listings",
    ],
  },
  {
    slug: "restaurant-ordering-system",
    title: "Restaurant Ordering System",
    category: "Mobile & Web",
    description:
      "Modern ordering ecosystem with live order tracking, payment-ready flows, and operations visibility.",
    points: [
      "Customer ordering experience",
      "Kitchen and admin status tracking",
      "Mobile-first checkout flow",
    ],
  },
  {
    slug: "corporate-brand-experience",
    title: "Corporate Brand Experience",
    category: "UI / UX Design",
    description:
      "Digital brand system with conversion-focused pages, reusable content sections, and scalable visual direction.",
    points: [
      "Brand and interface system",
      "Responsive marketing pages",
      "Content publishing foundation",
    ],
  },
];

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-36 text-white">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/#portfolio"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
        >
          <HiArrowLeft />
          Back to Portfolio
        </Link>

        <div className="mt-12 rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl md:p-12">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300">
            {project.category}
          </p>

          <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
            {project.title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-400">
            {project.description}
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {project.points.map((point) => (
              <div
                key={point}
                className="rounded-2xl border border-white/10 bg-black/25 p-5"
              >
                <HiCheckCircle className="mb-4 text-2xl text-cyan-300" />
                <p className="text-sm font-semibold text-white">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
