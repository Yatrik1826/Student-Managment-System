const connectDB = require("../config/db");
const User = require("../models/User");

const seedUser = async ({ fullName, email, password, role }) => {
  await connectDB();

  const existingUser = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

  if (existingUser) {
    existingUser.name = fullName;
    existingUser.role = role;
    existingUser.password = password;
    await existingUser.save();
    console.log(`${role} account updated for ${email}.`);
    return;
  }

  await User.create({
    name: fullName,
    email,
    password,
    role
  });

  console.log(`${role} account created for ${email}.`);
};

module.exports = seedUser;
