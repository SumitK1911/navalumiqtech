import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/api-auth";

export async function GET() {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const clients = await prisma.user.findMany({
      where: {
        role: "client",
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        packageName: true,
        subscriptionStart: true,
        subscriptionEnd: true,
        createdAt: true,
      },
    });

    return NextResponse.json(clients);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}
