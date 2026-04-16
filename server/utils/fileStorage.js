const fs = require("fs/promises");
const path = require("path");

const uploadsRoot = path.resolve(__dirname, "..", "uploads");
const marksheetsDirectory = path.join(uploadsRoot, "marksheets");

const ensureDirectory = async (directoryPath) => {
  await fs.mkdir(directoryPath, { recursive: true });
};

const ensureMarksheetDirectory = async () => {
  await ensureDirectory(marksheetsDirectory);
};

const resolveStoredFilePath = (relativePath) => path.resolve(__dirname, "..", relativePath);

const deleteFileIfExists = async (relativePath) => {
  if (!relativePath) {
    return;
  }

  try {
    await fs.unlink(resolveStoredFilePath(relativePath));
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
};

module.exports = {
  marksheetsDirectory,
  ensureMarksheetDirectory,
  resolveStoredFilePath,
  deleteFileIfExists
};
