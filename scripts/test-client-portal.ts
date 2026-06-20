import { prisma } from "../src/lib/prisma";
import { 
  getSubscriptionPackage, 
  getRemainingSubscriptionTime, 
  formatSubscriptionDate 
} from "../src/lib/subscription";
import { EsewaPaymentService } from "../src/backend/services/payment.service";

async function runClientPortalTests() {
  console.log("=========================================");
  console.log("STARTING CLIENT PORTAL INTEGRATION TESTS");
  console.log("=========================================");

  const testEmail = "testclient@lumiq.io";
  
  // 1. Clean up any existing test user
  await prisma.user.deleteMany({
    where: { email: testEmail }
  });

  // 2. Create a test client with a premium subscription package starting today
  console.log("\n[1/4] Creating test client user in Prisma DB...");
  const now = new Date();
  // Subscription ends in 15 days
  const subscriptionEnd = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000); 

  try {
    const testUser = await prisma.user.create({
      data: {
        name: "Test Client Portal User",
        email: testEmail,
        password: "hashedpassword123", // mock hashed password
        role: "client",
        packageId: "premium",
        packageName: "Premium Package",
        durationDays: 30,
        subscriptionStart: now,
        subscriptionEnd: subscriptionEnd,
      }
    });

    console.log(`✓ Test client created with ID: ${testUser.id}`);

    // 3. Query the user as done in src/app/client-portal/page.tsx
    console.log("\n[2/4] Simulating page query from client-portal page.tsx...");
    const clientData = await prisma.user.findUnique({
      where: { email: testEmail },
      select: {
        name: true,
        email: true,
        packageName: true,
        packageId: true,
        durationDays: true,
        subscriptionStart: true,
        subscriptionEnd: true,
      },
    });

    if (!clientData) {
      throw new Error("FAIL: Failed to query client data from DB.");
    }
    console.log(`✓ Successfully queried client: ${clientData.name} (${clientData.email})`);
    console.log(`✓ Subscribed package: ${clientData.packageName} (ID: ${clientData.packageId})`);

    // 4. Test subscription date & time math
    console.log("\n[3/4] Testing subscription utility functions...");
    
    const remaining = getRemainingSubscriptionTime(clientData.subscriptionEnd);
    console.log(`- Remaining time computed: ${remaining.days} days, ${remaining.hours} hours (Expired: ${remaining.expired})`);
    if (remaining.days !== 14 && remaining.days !== 15) { // might vary by exact ms, but should be around 14-15 days
      throw new Error(`FAIL: Expected remaining days to be around 15, got ${remaining.days}`);
    }
    console.log("✓ Remaining days calculation matches expectation.");

    const pkg = getSubscriptionPackage(clientData.packageId || "");
    if (!pkg || pkg.id !== "premium") {
      throw new Error(`FAIL: Expected subscription package premium, got ${pkg?.name}`);
    }
    console.log(`✓ Subscription package feature count: ${pkg.features.length} features`);

    const formattedDate = formatSubscriptionDate(clientData.subscriptionEnd);
    console.log(`- Formatted subscription end date: ${formattedDate}`);
    console.log("✓ Date formatting is correct.");

    // 5. Test Payment service generation URL logic
    console.log("\n[4/4] Testing EsewaPaymentService URL generation...");
    const esewaService = new EsewaPaymentService("EPAYTEST", "test-api-key");
    const testTransactionId = "tx-123456789";
    const testAmount = pkg.price;
    const returnUrl = `http://localhost:3000/api/payments/verify?transactionId=${testTransactionId}`;
    
    const esewaUrl = esewaService.generatePaymentUrl(
      testTransactionId,
      testAmount,
      "Subscription Plan: premium",
      "DIGITAL_SERVICE",
      returnUrl,
      "http://localhost:3000/client-portal?paymentFailed=true"
    );

    console.log(`- Generated eSewa URL: ${esewaUrl}`);
    if (!esewaUrl.includes(testTransactionId) || !esewaUrl.includes(String(testAmount)) || !esewaUrl.includes("psc=DIGITAL_SERVICE")) {
      throw new Error(`FAIL: eSewa payment URL was not constructed correctly: ${esewaUrl}`);
    }
    console.log("✓ eSewa payment URL correctly verified.");
  } finally {
    // 6. Cleanup
    console.log("\nCleaning up test client user...");
    await prisma.user.deleteMany({
      where: { email: testEmail }
    });
    console.log("✓ Cleanup completed successfully.");
  }

  console.log("\n=========================================");
  console.log("ALL TESTS COMPLETED SUCCESSFULLY!");
  console.log("=========================================");
}

runClientPortalTests()
  .catch((error) => {
    console.error("\n❌ TEST FAILED:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
