import { NextResponse } from "next/server";
import { inquiryService } from "@/backend/services/inquiry.service";
import { isAdminRequest } from "@/lib/api-auth";

type InquiryRouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(
  _req: Request,
  context: InquiryRouteContext
) {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    await inquiryService.deleteInquiry(id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
