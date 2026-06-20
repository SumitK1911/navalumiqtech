import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uniqueSlug } from "@/utils/slugify";

type ServiceRouteContext = {
  params: Promise<{ id: string }>;
};

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin";
}

export async function GET(
  req: Request,
  context: ServiceRouteContext
) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const service = await prisma.service.findUnique({
      where: {
        id,
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: ServiceRouteContext
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
    const icon = String(body.icon || "sparkles").trim();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required." },
        { status: 400 }
      );
    }

    const existing = await prisma.service.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    const service = await prisma.service.update({
      where: {
        id,
      },
      data: {
        title,
        slug: title === existing.title ? existing.slug : uniqueSlug(title),
        description,
        icon,
      },
    });

    revalidatePath("/");

    return NextResponse.json(service);
  } catch {
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: ServiceRouteContext
) {
  try {
    const { id } = await context.params;

    const existing = await prisma.service.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    await prisma.service.delete({
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
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
