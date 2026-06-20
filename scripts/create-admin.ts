import { prisma } from "../src/lib/prisma";

import bcrypt from "bcrypt";

async function main() {

  const hashedPassword =
    await bcrypt.hash("admin123", 10);

  console.log(hashedPassword);

  const user =
    await prisma.user.create({

      data: {

        name: "Admin",

        email: "admin@nava.com",

        password: hashedPassword,

      },

    });

  console.log(user);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });