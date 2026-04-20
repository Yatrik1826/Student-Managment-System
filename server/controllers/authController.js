const mongoose = require("mongoose");
const User = require("../models/User");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { signToken } = require("../utils/jwt");
const { validateStudentPayload } = require("../utils/studentValidation");

const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await User.findAnyByEmail(email.toLowerCase().trim());

  if (!user) {
    throw new ApiError(401, "Unable to sign in with the provided credentials.");
  }

  const isPasswordValid = await user.matchPassword(password);

  if (!isPasswordValid || (role && user.role !== role)) {
    throw new ApiError(401, "Unable to sign in with the provided credentials.");
  }

  if (user.role === "student") {
    await user.populate("assignedFaculty", "name email");
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    message: "Login successful.",
    token: signToken(user._id.toString()),
    user: user.toSafeObject()
  });
});

const register = asyncHandler(async (req, res) => {
  const rawRole = String(req.body.role || "student").toLowerCase();

  if (!["student", "faculty"].includes(rawRole)) {
    throw new ApiError(400, "Role must be either student or faculty.");
  }

  const email = typeof req.body.email === "string" ? req.body.email.toLowerCase().trim() : "";
  const password = typeof req.body.password === "string" ? req.body.password.trim() : "";
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";

  if (!name) {
    throw new ApiError(400, "Name is required.");
  }

  if (!email) {
    throw new ApiError(400, "Email is required.");
  }

  if (!password) {
    throw new ApiError(400, "Password is required.");
  }

  const conflictQuery = [{ email }];
  if (req.body.rollNumber) {
    conflictQuery.push({ rollNumber: req.body.rollNumber });
  }

  const existingUser = await User.findAnyOne({ $or: conflictQuery });
  if (existingUser) {
    if (existingUser.email === email) {
      throw new ApiError(409, "A user with that email already exists.");
    }
    throw new ApiError(409, "A student with that roll number already exists.");
  }

  let user;

  if (rawRole === "faculty") {
    user = await User.Faculty.create({
      name,
      email,
      password,
      role: "faculty"
    });
  } else {
    const studentData = validateStudentPayload(req.body);

    const facultyId = req.body.assignedFaculty;
    if (!facultyId) {
      throw new ApiError(400, "Please select a faculty.");
    }

    if (!mongoose.Types.ObjectId.isValid(facultyId)) {
      throw new ApiError(400, "Selected faculty is invalid.");
    }

    const faculty = await User.Faculty.findOne({ _id: facultyId, role: "faculty" });
    if (!faculty) {
      throw new ApiError(404, "Selected faculty was not found.");
    }

    user = await User.Student.create({
      ...studentData,
      role: "student",
      assignedFaculty: faculty._id
    });

    await user.populate("assignedFaculty", "name email");
  }

  res.status(201).json({
    message: "Registration successful.",
    token: signToken(user._id.toString()),
    user: user.toSafeObject()
  });
});

const listFaculties = asyncHandler(async (req, res) => {
  const faculties = await User.Faculty.find().select("name email").sort({ name: 1 });

  res.status(200).json({ faculties });
});

const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "Logout successful."
  });
});

module.exports = {
  login,
  logout,
  register,
  listFaculties
};
