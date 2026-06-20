import { blogRepository }
from "../repositories/blog.repository";
import type { Prisma } from "@prisma/client";

export const blogService = {

  async getBlogs(where?: Prisma.BlogPostWhereInput) {

    return blogRepository.getAllBlogs(where);
  },

  async createBlog(data: Prisma.BlogPostCreateInput) {

    return blogRepository.createBlog(data);
  },

  async updateBlog(id: string, data: Prisma.BlogPostUpdateInput) {

    return blogRepository.updateBlog(id, data);
  },

};
