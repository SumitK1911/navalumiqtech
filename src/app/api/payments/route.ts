import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { v4 as uuidv4 } from "uuid";
import { EsewaPaymentService, KhaltiPaymentService } from "@/backend/services/payment.service";

// Initialize payment services with credentials
const esewaService = new EsewaPaymentService(
  process.env.ESEWA_MERCHANT_CODE || "",
  process.env.ESEWA_API_KEY || ""
);

const khaltiService = new KhaltiPaymentService(
  process.env.KHALTI_PUBLIC_KEY || "",
  process.env.KHALTI_SECRET_KEY || ""
);

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { method, planId, amount } = await req.json();

    if (!method || !planId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["esewa", "khalti"].includes(method)) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    // Create payment record in database
    const transactionId = uuidv4();
    const payment = await prisma.payment.create({
      data: {
        transactionId,
        userEmail: session.user.email,
        planId,
        amount,
        method,
        status: "pending",
        metadata: {},
      },
    });

    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/verify?transactionId=${transactionId}`;

    if (method === "esewa") {
      const paymentUrl = esewaService.generatePaymentUrl(
        transactionId,
        amount,
        `Subscription Plan: ${planId}`,
        "DIGITAL_SERVICE",
        returnUrl,
        `${process.env.NEXT_PUBLIC_APP_URL}/client-portal?paymentFailed=true`
      );

      return NextResponse.json({
        success: true,
        paymentUrl,
        transactionId,
        method: "esewa",
      });
    }

    if (method === "khalti") {
      const { pidx, paymentUrl } = await khaltiService.initiatePayment(
        amount,
        `Subscription Plan: ${planId}`,
        transactionId,
        returnUrl
      );

      // Store Khalti pidx for verification
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          metadata: { pidx },
        },
      });

      return NextResponse.json({
        success: true,
        paymentUrl,
        transactionId,
        pidx,
        method: "khalti",
      });
    }
  } catch (error) {
    console.error("Payment initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate payment" },
      { status: 500 }
    );
  }
}
