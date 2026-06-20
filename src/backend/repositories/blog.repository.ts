import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const blogRepository = {

  async getAllBlogs(where?: Prisma.BlogPostWhereInput) {

    return prisma.blogPost.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async createBlog(data: Prisma.BlogPostCreateInput) {

    return prisma.blogPost.create({
      data,
    });
  },

  async updateBlog(id: string, data: Prisma.BlogPostUpdateInput) {

    return prisma.blogPost.update({
      where: {
        id,
      },
      data,
    });
  },

};
