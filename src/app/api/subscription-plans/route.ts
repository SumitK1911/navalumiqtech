import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/api-auth";
import { uniqueSlug } from "@/utils/slugify";

export async function GET() {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: {
        active: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Error in GET /api/subscription-plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription plans" },
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
    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();
    const price = Number(body.price || 0);
    const durationDays = Number(body.durationDays || 30);
    const features = String(body.features || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    const popular = Boolean(body.popular);

    if (!name || !description || price <= 0 || features.length === 0) {
      return NextResponse.json(
        { error: "Name, description, price, and features are required." },
        { status: 400 }
      );
    }

    const plan = await prisma.subscriptionPlan.create({
      data: {
        name,
        slug: uniqueSlug(name),
        description,
        price,
        durationDays,
        features,
        popular,
      },
    });

    revalidatePath("/");
    revalidatePath("/client-portal/register");

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error in POST /api/subscription-plans:", error);
    return NextResponse.json(
      { error: "Failed to create subscription plan" },
      { status: 500 }
    );
  }
}
