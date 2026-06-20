import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/api-auth";

type SectionItemRouteContext = {
  params: Promise<{ id: string }>;
};

function parseMetadata(value: unknown): Prisma.InputJsonValue | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value === "string") {
    return JSON.parse(value) as Prisma.InputJsonValue;
  }

  return value as Prisma.InputJsonValue;
}

export async function PUT(
  req: Request,
  context: SectionItemRouteContext
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
    const section = String(body.section || "").trim();
    const title = String(body.title || "").trim();
    const subtitle = String(body.subtitle || "").trim();
    const description = String(body.description || "").trim();
    const image = String(body.image || "").trim();
    const sortOrder = Number(body.sortOrder || 0);
    const active = body.active === undefined ? true : Boolean(body.active);

    if (!section || !title) {
      return NextResponse.json(
        { error: "Section and title are required." },
        { status: 400 }
      );
    }

    const item = await prisma.sectionItem.update({
      where: {
        id,
      },
      data: {
        section,
        title,
        subtitle: subtitle || null,
        description: description || null,
        image: image || null,
        metadata: parseMetadata(body.metadata),
        sortOrder,
        active,
      },
    });

    revalidatePath("/");

    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Failed to update section content" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: SectionItemRouteContext
) {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    await prisma.sectionItem.delete({
      where: {
        id,
      },
    });

    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete section content" },
      { status: 500 }
    );
  }
}
