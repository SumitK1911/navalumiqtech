import { prisma } from "../src/lib/prisma";

async function main() {
  const users = await prisma.user.findMany({
    select: { email: true, role: true, name: true },
  });
  console.log("All users in DB:");
  console.table(users);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
