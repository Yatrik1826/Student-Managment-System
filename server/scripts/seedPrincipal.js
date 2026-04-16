const mongoose = require("mongoose");
const seedUser = require("./seedUser");

const run = async () => {
  try {
    await seedUser({
      fullName: process.env.SEED_PRINCIPAL_NAME || "Principal Admin",
      email: process.env.SEED_PRINCIPAL_EMAIL || "principal@example.com",
      password: process.env.SEED_PRINCIPAL_PASSWORD || "principal0101!",
      role: "principal"
    });
  } catch (error) {
    console.error("Failed to seed principal account:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();
