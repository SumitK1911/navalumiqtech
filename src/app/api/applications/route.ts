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

    const applications = await prisma.application.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      applications.map((application) => ({
        id: application.id,
        full_name: application.fullName,
        email: application.email,
        phone: application.phone,
        position: application.position,
        cover_letter: application.coverLetter,
        resume_url: application.resumeUrl,
        status: application.status,
        created_at: application.createdAt,
      }))
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const fullName = String(body.full_name || body.fullName || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const position = String(body.position || "").trim();
    const coverLetter = String(
      body.cover_letter || body.coverLetter || ""
    ).trim();
    const resumeUrl = String(body.resume_url || body.resumeUrl || "").trim();

    if (!fullName || !email || !phone || !position || !coverLetter) {
      return NextResponse.json(
        { error: "Please complete all required application fields." },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        fullName,
        email,
        phone,
        position,
        coverLetter,
        resumeUrl: resumeUrl || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        application,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Application failed" },
      { status: 500 }
    );
  }
}
