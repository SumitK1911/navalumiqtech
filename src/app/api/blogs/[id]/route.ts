import { NextResponse }
from "next/server";
import { revalidatePath }
from "next/cache";

import { prisma }
from "@/lib/prisma";
import { blogService }
from "@/backend/services/blog.service";
import {
  buildBlogUpdateData,
  toBlogAdminResponse,
}
from "@/lib/blog-payload";

export async function PUT(
  req: Request,
  context: {
    params: Promise<{ id: string }>
  }
) {

  try {

    const { id } = await context.params;
    const body = await req.json();

    const result =
      buildBlogUpdateData(body);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    const blog =
      await blogService.updateBlog(id, result.data);

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${blog.slug}`);

    return NextResponse.json(
      toBlogAdminResponse(blog)
    );

  } catch {

    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: {
    params: Promise<{ id: string }>
  }
) {

  try {

    const { id } = await context.params;

    await prisma.blogPost.delete({
      where: {
        id,
      },
    });

    revalidatePath("/");
    revalidatePath("/blog");

    return NextResponse.json({
      success: true,
    });

  } catch {

    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
