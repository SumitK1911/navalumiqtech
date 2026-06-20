import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/utils/slugify";

type ProjectRouteContext = {
  params: Promise<{ id: string }>;
};

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin";
}

export async function GET(
  req: Request,
  context: ProjectRouteContext
) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const project = await prisma.project.findUnique({
      where: {
        id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: ProjectRouteContext
) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
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

    const existing = await prisma.project.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const project = await prisma.project.update({
      where: {
        id,
      },
      data: {
        title,
        slug: title === existing.title ? existing.slug : uniqueSlug(title),
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
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: ProjectRouteContext
) {
  try {
    const { id } = await context.params;

    const existing = await prisma.project.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    await prisma.project.delete({
      where: {
        id,
      },
    });

    revalidatePath("/");

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
