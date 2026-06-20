import { NextResponse }
from "next/server";
import { revalidatePath }
from "next/cache";

import { blogService }
from "@/backend/services/blog.service";
import {
  buildBlogCreateData,
  toBlogAdminResponse,
}
from "@/lib/blog-payload";

export async function GET(req: Request) {

  try {

    const { searchParams } =
      new URL(req.url);

    const publishedOnly =
      searchParams.get("published") === "true";

    const blogs =
      await blogService.getBlogs(
        publishedOnly
          ? { published: true }
          : undefined
      );

    return NextResponse.json(
      blogs.map(toBlogAdminResponse)
    );

  } catch {

    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request
) {

  try {

    const body = await req.json();

    const result =
      buildBlogCreateData(body);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    const blog =
      await blogService.createBlog(result.data);

    revalidatePath("/");
    revalidatePath("/blog");

    return NextResponse.json(
      toBlogAdminResponse(blog)
    );

  } catch {

    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
