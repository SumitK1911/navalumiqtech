import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/api-auth";
import { uniqueSlug } from "@/utils/slugify";

type SubscriptionPlanRouteContext = {
  params: Promise<{ id: string }>;
};

function parseFeatures(value: unknown) {
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
  context: SubscriptionPlanRouteContext
) {
  try {
    const { id } = await context.params;

    const plan = await prisma.subscriptionPlan.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        active: true,
      },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Subscription plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(plan);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch subscription plan" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: SubscriptionPlanRouteContext
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
    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();
    const price = Number(body.price || 0);
    const durationDays = Number(body.durationDays || 30);
    const features = parseFeatures(body.features);
    const popular = Boolean(body.popular);
    const active = body.active === undefined ? true : Boolean(body.active);

    if (!name || !description || price <= 0 || features.length === 0) {
      return NextResponse.json(
        { error: "Name, description, price, and features are required." },
        { status: 400 }
      );
    }

    const existing = await prisma.subscriptionPlan.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Subscription plan not found" },
        { status: 404 }
      );
    }

    const plan = await prisma.subscriptionPlan.update({
      where: {
        id: existing.id,
      },
      data: {
        name,
        slug: name === existing.name ? existing.slug : uniqueSlug(name),
        description,
        price,
        durationDays,
        features,
        popular,
        active,
      },
    });

    revalidatePath("/");
    revalidatePath("/client-portal/register");

    return NextResponse.json(plan);
  } catch {
    return NextResponse.json(
      { error: "Failed to update subscription plan" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: SubscriptionPlanRouteContext
) {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    await prisma.subscriptionPlan.update({
      where: {
        id,
      },
      data: {
        active: false,
      },
    });

    revalidatePath("/");
    revalidatePath("/client-portal/register");

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to remove subscription plan" },
      { status: 500 }
    );
  }
}
