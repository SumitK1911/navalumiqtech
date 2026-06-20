import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder_key");

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, message } = body;

     await prisma.contactInquiry.create({
      data: {
        name,
        email,
        message,
      },
    });

    const data = await resend.emails.send({
      from: "Nava Lumiq Tech <onboarding@resend.dev>",

      to: ["insoftdesign1@gmail.com"],

      subject: `New Inquiry from ${name}`,

      html: `
        <div style="font-family:sans-serif;">
          <h2>New Website Inquiry</h2>

          <p><strong>Name:</strong> ${name}</p>

          <p><strong>Email:</strong> ${email}</p>

          <p><strong>Message:</strong></p>

          <p>${message}</p>
        </div>
      `,
    });

    return Response.json(data);
  } catch {
    return Response.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
