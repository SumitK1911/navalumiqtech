import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { addDays, getSubscriptionPackage } from "@/lib/subscription";

const allowedDurationDays = [30, 90, 180, 365];

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const packageId = String(body.packageId || "");
    const durationDaysRaw = Number(body.durationDays);

    // ✅ validate duration
    const durationDays = allowedDurationDays.includes(durationDaysRaw)
      ? durationDaysRaw
      : 30;

    // ✅ get package (DB first, fallback second)
    const dbPackage = await prisma.subscriptionPlan.findFirst({
      where: {
        OR: [
          { id: packageId },
          { slug: packageId },
        ],
        active: true,
      },
    });

    const fallbackPackage = getSubscriptionPackage(packageId);
    const selectedPackage = dbPackage || fallbackPackage;

    if (!name || !email || password.length < 6 || !selectedPackage) {
      return NextResponse.json(
        {
          error:
            "Please complete all fields and choose a valid package.",
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "An account already exists for this email.",
        },
        { status: 409 }
      );
    }

    // ✅ subscription dates
    const subscriptionStart = new Date();
    const subscriptionEnd = addDays(
      subscriptionStart,
      durationDays
    );

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "client",

        packageName: selectedPackage.name,

        // ✅ store correct subscription dates
        subscriptionStart,
        subscriptionEnd,

        // (optional but recommended for dashboard)
        packageId: selectedPackage.id,
        durationDays,
      },
    });

    return NextResponse.json({
      success: true,
      subscription: {
        package: selectedPackage.name,
        durationDays,
        subscriptionStart,
        subscriptionEnd,
      },
    });
  } catch (error) {
    console.error("REGISTER_ERROR:", error);

    return NextResponse.json(
      {
        error:
          "Registration failed. Please try again.",
      },
      { status: 500 }
    );
  }
}