const User = require("../models/User");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { verifyToken } = require("../utils/jwt");

const extractBearerToken = (authorizationHeader = "") => {
  if (!authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.split(" ")[1];
};

const protect = asyncHandler(async (req, res, next) => {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    throw new ApiError(401, "Authentication required.");
  }

  let payload;

  try {
    payload = verifyToken(token);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token.");
  }

  const user = await User.findAnyById(payload.sub);

  if (!user) {
    throw new ApiError(401, "Authentication required.");
  }

  req.user = user;
  next();
});

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new ApiError(403, "You do not have permission to access this resource."));
  }

  next();
};

module.exports = {
  protect,
  authorize
};
