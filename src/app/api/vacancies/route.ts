import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/api-auth";
import { vacancies as fallbackVacancies } from "@/lib/vacancies";
import { slugify, uniqueSlug } from "@/utils/slugify";

function toStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive =
      searchParams.get("includeInactive") === "true" &&
      (await isAdminRequest());

    const vacancies = await prisma.vacancy.findMany({
      where: includeInactive ? undefined : { active: true },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!includeInactive && vacancies.length === 0) {
      return NextResponse.json(fallbackVacancies);
    }

    return NextResponse.json(vacancies);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch vacancies" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const title = String(body.title || "").trim();
    const location = String(body.location || "").trim();
    const salary = String(body.salary || "").trim();
    const type = String(body.type || "Full Time").trim();
    const description = String(body.description || "").trim();
    const requirements = toStringArray(body.requirements);
    const responsibilities = toStringArray(body.responsibilities);
    const requestedSlug = String(body.slug || "").trim();

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

    const vacancy = await prisma.vacancy.create({
      data: {
        title,
        slug: requestedSlug ? slugify(requestedSlug) : uniqueSlug(title),
        location,
        salary,
        type,
        description,
        requirements,
        responsibilities,
      },
    });

    revalidatePath("/vacancies");
    revalidatePath("/careers");

    return NextResponse.json(vacancy, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create vacancy" },
      { status: 500 }
    );
  }
}
