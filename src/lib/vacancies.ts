export type Vacancy = {
  id: number;
  slug: string;
  title: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
};

export const vacancies: Vacancy[] = [
  {
    id: 1,
    slug: "frontend-developer",
    title: "Frontend Developer",
    location: "Kathmandu, Nepal",
    type: "Full Time",
    salary: "Rs. 45,000 - 80,000",
    description:
      "We are looking for a modern React / Next.js developer passionate about premium UI engineering.",
    requirements: [
      "Strong React & Next.js knowledge",
      "Good understanding of TailwindCSS",
      "Experience with APIs",
      "Responsive UI development",
      "Git & GitHub workflow",
    ],
    responsibilities: [
      "Build premium frontend interfaces",
      "Optimize performance",
      "Collaborate with backend team",
      "Maintain scalable codebases",
    ],
  },
  {
    id: 2,
    slug: "ui-ux-designer",
    title: "UI/UX Designer",
    location: "Remote",
    type: "Contract",
    salary: "Negotiable",
    description:
      "Design beautiful user experiences with modern product thinking and premium aesthetics.",
    requirements: [
      "Figma expertise",
      "Strong UI systems understanding",
      "Wireframing & prototyping",
      "Portfolio required",
    ],
    responsibilities: [
      "Create product interfaces",
      "Design user flows",
      "Collaborate with developers",
      "Improve UX consistency",
    ],
  },
  {
    id: 3,
    slug: "digital-marketing-specialist",
    title: "Digital Marketing Specialist",
    location: "Hybrid",
    type: "Full Time",
    salary: "Rs. 35,000+",
    description:
      "Manage campaigns, SEO, content strategy, and digital growth systems.",
    requirements: [
      "SEO knowledge",
      "Social media strategy",
      "Google Analytics",
      "Content marketing experience",
    ],
    responsibilities: [
      "Run marketing campaigns",
      "Improve search rankings",
      "Track analytics",
      "Scale digital presence",
    ],
  },
];

export function addVacancy(vacancy: Omit<Vacancy, "id">) {
  const nextId = vacancies.length
    ? Math.max(...vacancies.map((item) => item.id)) + 1
    : 1;

  const newVacancy: Vacancy = {
    id: nextId,
    ...vacancy,
  };

  vacancies.push(newVacancy);
  return newVacancy;
}
