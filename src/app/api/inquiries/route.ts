import { NextResponse } from "next/server";
import { inquiryService } from "@/backend/services/inquiry.service";
import { isAdminRequest } from "@/lib/api-auth";

export async function GET() {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const inquiries = await inquiryService.getAllInquiries();
    return NextResponse.json(inquiries);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request
) {

  try {

    const body = await req.json();

    const inquiry =
      await inquiryService.createInquiry({
        name: body.name,
        email: body.email,
        message: body.message,
      });

    return NextResponse.json(inquiry);

  } catch {

    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}