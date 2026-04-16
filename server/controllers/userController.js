const fs = require("fs/promises");

const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { resolveStoredFilePath } = require("../utils/fileStorage");

const getMe = asyncHandler(async (req, res) => {
  if (req.user.role === "student") {
    await req.user.populate("assignedFaculty", "fullName email");
  }

  res.status(200).json({
    user: req.user.toSafeObject()
  });
});

const getMyMarksheet = asyncHandler(async (req, res) => {
  const marksheet = req.user.marksheet;

  if (!marksheet?.filePath) {
    throw new ApiError(404, "No marksheet uploaded yet");
  }

  const absoluteFilePath = resolveStoredFilePath(marksheet.filePath);

  try {
    await fs.access(absoluteFilePath);
  } catch (error) {
    throw new ApiError(404, "No marksheet uploaded yet");
  }

  res.setHeader("Content-Type", marksheet.mimeType);
  res.setHeader(
    "Content-Disposition",
    `inline; filename="${encodeURIComponent(marksheet.originalName)}"`
  );

  res.sendFile(absoluteFilePath);
});

module.exports = {
  getMe,
  getMyMarksheet
};
