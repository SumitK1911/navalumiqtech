import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/api-auth";
import { vacancies as fallbackVacancies } from "@/lib/vacancies";
import { uniqueSlug } from "@/utils/slugify";

type VacancyRouteContext = {
  params: Promise<{ id: string }>;
};

function toStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function GET(
  req: Request,
  context: VacancyRouteContext
) {
  try {
    const { id } = await context.params;

    const vacancy = await prisma.vacancy.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        active: true,
      },
    });

    if (!vacancy) {
      const fallbackVacancy = fallbackVacancies.find(
        (item) => item.slug === id || String(item.id) === id
      );

      if (fallbackVacancy) {
        return NextResponse.json(fallbackVacancy);
      }

      return NextResponse.json(
        { error: "Vacancy not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(vacancy);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch vacancy" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: VacancyRouteContext
) {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const body = await req.json();
    const title = String(body.title || "").trim();
    const location = String(body.location || "").trim();
    const salary = String(body.salary || "").trim();
    const type = String(body.type || "Full Time").trim();
    const description = String(body.description || "").trim();
    const requirements = toStringArray(body.requirements);
    const responsibilities = toStringArray(body.responsibilities);
    const active = body.active === undefined ? true : Boolean(body.active);

    if (
      !title ||
      !location ||
      !salary ||
      !type ||
      !description ||
      requirements.length === 0 ||
      responsibilities.length === 0
    ) {
      return NextResponse.json(
        { error: "Please complete all required vacancy fields." },
        { status: 400 }
      );
    }

    const existing = await prisma.vacancy.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Vacancy not found" },
        { status: 404 }
      );
    }

    const vacancy = await prisma.vacancy.update({
      where: {
        id: existing.id,
      },
      data: {
        title,
        slug: title === existing.title ? existing.slug : uniqueSlug(title),
        location,
        salary,
        type,
        description,
        requirements,
        responsibilities,
        active,
      },
    });

    revalidatePath("/vacancies");
    revalidatePath(`/vacancies/${vacancy.slug}`);
    revalidatePath("/careers");
    revalidatePath(`/careers/${vacancy.slug}`);

    return NextResponse.json(vacancy);
  } catch {
    return NextResponse.json(
      { error: "Failed to update vacancy" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: VacancyRouteContext
) {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const existing = await prisma.vacancy.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Vacancy not found" },
        { status: 404 }
      );
    }

    await prisma.vacancy.update({
      where: {
        id: existing.id,
      },
      data: {
        active: false,
      },
    });

    revalidatePath("/vacancies");
    revalidatePath("/careers");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete vacancy" },
      { status: 500 }
    );
  }
}
