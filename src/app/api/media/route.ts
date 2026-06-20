import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/api-auth";
import {
  deleteCloudinaryMedia,
  listCloudinaryMedia,
  uploadCloudinaryMedia,
} from "@/lib/cloudinary";

function getMediaName(publicId: string) {
  return publicId.split("/").pop() || publicId;
}

export async function GET() {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const resources = await listCloudinaryMedia();
    const files = resources.map((file) => ({
      name: getMediaName(file.public_id),
      public_id: file.public_id,
      url: file.secure_url,
      format: file.format,
      bytes: file.bytes,
      created_at: file.created_at,
    }));

    return NextResponse.json(files);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load media files",
      },
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

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image uploads are supported." },
        { status: 400 }
      );
    }

    const uploadedFile = await uploadCloudinaryMedia(file);

    return NextResponse.json({
      name: getMediaName(uploadedFile.public_id),
      public_id: uploadedFile.public_id,
      url: uploadedFile.secure_url,
      format: uploadedFile.format,
      bytes: uploadedFile.bytes,
      created_at: uploadedFile.created_at,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload media file",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const publicId = String(body.public_id || "").trim();

    if (!publicId || publicId.includes("..") || publicId.startsWith("/")) {
      return NextResponse.json(
        { error: "Invalid media path" },
        { status: 400 }
      );
    }

    await deleteCloudinaryMedia(publicId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete media file",
      },
      { status: 500 }
    );
  }
}
