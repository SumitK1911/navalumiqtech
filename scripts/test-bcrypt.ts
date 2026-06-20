import bcrypt from "bcrypt";

async function test() {
  try {
    const password = "mySecurePassword123";
    console.log("Hashing password...");
    const hash = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully:", hash);

    console.log("Comparing password...");
    const match = await bcrypt.compare(password, hash);
    console.log("Comparison result:", match);

    console.log("Comparing wrong password...");
    const noMatch = await bcrypt.compare("wrongPassword", hash);
    console.log("Comparison result for wrong password:", noMatch);
  } catch (err) {
    console.error("Bcrypt test error:", err);
  }
}

test();
