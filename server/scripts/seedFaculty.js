const mongoose = require("mongoose");
const seedUser = require("./seedUser");

const run = async () => {
  try {
    await seedUser({
      fullName: process.env.SEED_FACULTY_NAME || "Faculty Admin",
      email: process.env.SEED_FACULTY_EMAIL || "faculty@example.com",
      password: process.env.SEED_FACULTY_PASSWORD || "ChangeMe123!",
      role: "faculty"
    });
  } catch (error) {
    console.error("Failed to seed faculty account:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();
