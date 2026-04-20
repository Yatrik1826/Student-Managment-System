const connectDB = require("../config/db");
const User = require("../models/User");

const seedUser = async ({ fullName, email, password, role }) => {
  await connectDB();

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findAnyOne({ email: normalizedEmail }).select("+password");

  if (existingUser) {
    existingUser.name = fullName;
    existingUser.role = role;
    existingUser.password = password;
    await existingUser.save();
    console.log(`${role} account updated for ${email}.`);
    return;
  }

  const model = role === "faculty" ? User.Faculty : role === "student" ? User.Student : User;

  await model.create({
    name: fullName,
    email: normalizedEmail,
    password,
    role
  });

  console.log(`${role} account created for ${email}.`);
};

module.exports = seedUser;
