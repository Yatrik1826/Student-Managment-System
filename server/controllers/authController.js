const User = require("../models/User");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { signToken } = require("../utils/jwt");

const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

  if (!user) {
    throw new ApiError(401, "Unable to sign in with the provided credentials.");
  }

  const isPasswordValid = await user.matchPassword(password);

  if (!isPasswordValid || (role && user.role !== role)) {
    throw new ApiError(401, "Unable to sign in with the provided credentials.");
  }

  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    message: "Login successful.",
    token: signToken(user._id.toString()),
    user: user.toSafeObject()
  });
});

const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "Logout successful."
  });
});

module.exports = {
  login,
  logout
};
