import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Attempting prisma.subscriptionPlan.findMany...");
    const plans = await prisma.subscriptionPlan.findMany({
      where: {
        active: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    console.log("Success! Plans found:", plans);
  } catch (error) {
    console.error("Error during findMany:", error);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
