import { inquiryRepository }
from "../repositories/inquiry.repository";
import type { Prisma } from "@prisma/client";

export const inquiryService = {

  async createInquiry(data: Prisma.ContactInquiryCreateInput) {

    return inquiryRepository.createInquiry(data);
  },

  async getAllInquiries() {

    return inquiryRepository.getAllInquiries();
  },

  async deleteInquiry(id: string) {

    return inquiryRepository.deleteInquiry(id);
  },

};
