import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { KhaltiPaymentService, EsewaPaymentService } from "@/backend/services/payment.service";

const khaltiService = new KhaltiPaymentService(
  process.env.KHALTI_PUBLIC_KEY || "",
  process.env.KHALTI_SECRET_KEY || ""
);

const esewaService = new EsewaPaymentService(
  process.env.ESEWA_MERCHANT_CODE || "",
  process.env.ESEWA_API_KEY || ""
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const transactionId = searchParams.get("transactionId");

    if (!transactionId) {
      return NextResponse.json(
        { error: "Missing transaction ID" },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: { transactionId },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    let verified = false;

    if (payment.method === "khalti") {
      const pidx = (payment.metadata as { pidx?: string })?.pidx;
      if (pidx) {
        const result = await khaltiService.verifyPayment(pidx);
        verified = result.verified;
      }
    } else if (payment.method === "esewa") {
      verified = await esewaService.verifyPayment(transactionId, payment.amount);
    }

    // Update payment status
    if (verified) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "completed" },
      });

      // Update user subscription
      const user = await prisma.user.findUnique({
        where: { email: payment.userEmail },
      });

      if (user) {
        const now = new Date();
        const subscriptionEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // Add 30 days

        await prisma.user.update({
          where: { id: user.id },
          data: {
            packageId: payment.planId,
            subscriptionStart: now,
            subscriptionEnd,
            defaultPaymentMethod: payment.method,
          },
        });
      }

      return NextResponse.redirect(
        new URL(`/client-portal?paymentSuccess=true`, process.env.NEXT_PUBLIC_APP_URL!)
      );
    } else {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "failed" },
      });

      return NextResponse.redirect(
        new URL(`/client-portal?paymentFailed=true`, process.env.NEXT_PUBLIC_APP_URL!)
      );
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
