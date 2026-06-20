import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Testing database connection and counts...");

  const usersCount = await prisma.user.count();
  const blogPostsCount = await prisma.blogPost.count();
  const inquiriesCount = await prisma.inquiry.count();
  const contactInquiriesCount = await prisma.contactInquiry.count();
  const servicesCount = await prisma.service.count();
  const caseStudiesCount = await prisma.caseStudy.count();
  const sectionItemsCount = await prisma.sectionItem.count();
  const vacanciesCount = await prisma.vacancy.count();
  const applicationsCount = await prisma.application.count();
  const subscriptionPlansCount = await prisma.subscriptionPlan.count();

  console.log("-----------------------------------------");
  console.log(`Users:              ${usersCount}`);
  console.log(`Blog Posts:         ${blogPostsCount}`);
  console.log(`Inquiries:          ${inquiriesCount}`);
  console.log(`Contact Inquiries:  ${contactInquiriesCount}`);
  console.log(`Services:           ${servicesCount}`);
  console.log(`Case Studies:       ${caseStudiesCount}`);
  console.log(`Section Items:      ${sectionItemsCount}`);
  console.log(`Vacancies:          ${vacanciesCount}`);
  console.log(`Applications:       ${applicationsCount}`);
  console.log(`Subscription Plans: ${subscriptionPlansCount}`);
  console.log("-----------------------------------------");

  if (usersCount > 0) {
    const users = await prisma.user.findMany({
      select: { name: true, email: true, role: true },
      take: 5
    });
    console.log("Recent Users (up to 5):");
    console.log(users);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
