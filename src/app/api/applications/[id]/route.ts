import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/api-auth";

type ApplicationRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  req: Request,
  context: ApplicationRouteContext
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
    const status = String(body.status || "reviewing").trim();

    const application = await prisma.application.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(application);
  } catch {
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: ApplicationRouteContext
) {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    await prisma.application.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete application" },
      { status: 500 }
    );
  }
}
