import { prisma }
from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const inquiryRepository = {

  async createInquiry(data: Prisma.ContactInquiryCreateInput) {

    return prisma.contactInquiry.create({
      data,
    });
  },

  async getAllInquiries() {

    return prisma.contactInquiry.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async deleteInquiry(id: string) {

    return prisma.contactInquiry.delete({
      where: {
        id,
      },
    });
  },

};
