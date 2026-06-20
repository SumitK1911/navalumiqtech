import { prisma } from "../src/lib/prisma";
import bcrypt from "bcrypt";

async function main() {
  const email = "testauth@gmail.com";
  const rawPassword = "password123";

  console.log("Cleaning up existing test user if any...");
  await prisma.user.deleteMany({
    where: { email }
  });

  console.log("Hashing password using registration logic...");
  const hashedPassword = await bcrypt.hash(rawPassword, 10);
  console.log("Hashed:", hashedPassword);

  console.log("Creating user in database...");
  const user = await prisma.user.create({
    data: {
      name: "Test Auth User",
      email: email,
      password: hashedPassword,
      role: "client"
    }
  });
  console.log("User created successfully:", user.id);

  console.log("Now testing authentication (login) logic...");
  console.log("1. Finding user by email...");
  const dbUser = await prisma.user.findUnique({
    where: { email: email }
  });

  if (!dbUser) {
    console.error("FAIL: User not found in database!");
    return;
  }
  console.log("SUCCESS: User found in database.");

  console.log("2. Comparing passwords...");
  const match = await bcrypt.compare(rawPassword, dbUser.password);
  console.log("Comparison result:", match);

  if (match) {
    console.log("SUCCESS: Password matched perfectly!");
  } else {
    console.error("FAIL: Password did not match!");
  }

  // Cleanup
  console.log("Cleaning up test user...");
  await prisma.user.delete({
    where: { id: user.id }
  });
  console.log("Cleanup completed.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
