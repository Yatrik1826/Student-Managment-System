const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const listUsers = async () => {
  await connectDB();

  const users = await User.find({}).select("-password");
  console.log("Users in database:");
  users.forEach(user => {
    console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
  });

  await mongoose.connection.close();
};

listUsers();