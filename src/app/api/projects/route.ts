import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/utils/slugify";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin";
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        status: "completed",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(projects);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const title = String(body.title || "").trim();
    const description = String(body.description || "").trim();
    const image = String(body.image || "/projects/project1.jpg").trim();
    const result = String(body.result || "").trim();
    const status = String(body.status || "completed").trim();

    if (!title || !description || !result) {
      return NextResponse.json(
        { error: "Title, description, and result are required." },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug: uniqueSlug(title),
        description,
        image,
        result,
        status,
      },
    });

    revalidatePath("/");

    return NextResponse.json(project);
  } catch {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
