import type { BlogPost as PrismaBlogPost } from "@prisma/client";

export type BlogPost = Omit<PrismaBlogPost, "createdAt" | "updatedAt"> & {
  createdAt: string | Date;
  updatedAt: string | Date;
};
