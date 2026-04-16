const path = require("path");
const multer = require("multer");

const { ensureMarksheetDirectory, marksheetsDirectory } = require("../utils/fileStorage");

const allowedMarksheetMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp"
]);

const extensionByMimeType = {
  "application/pdf": ".pdf",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp"
};

const storage = multer.diskStorage({
  destination: async (req, file, callback) => {
    try {
      await ensureMarksheetDirectory();
      callback(null, marksheetsDirectory);
    } catch (error) {
      callback(error);
    }
  },
  filename: (req, file, callback) => {
    const extension = extensionByMimeType[file.mimetype] || path.extname(file.originalname);
    const filename = `marksheet-${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    callback(null, filename);
  }
});

const uploadMarksheet = multer({
  storage,
  fileFilter: (req, file, callback) => {
    if (allowedMarksheetMimeTypes.has(file.mimetype)) {
      callback(null, true);
      return;
    }

    const error = new Error("Only PDF, JPG, PNG, and WEBP files are allowed.");
    error.statusCode = 400;
    callback(error);
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

module.exports = {
  uploadMarksheet
};
