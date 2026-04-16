const ApiError = require("./apiError");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+\-\s()]{7,20}$/;

const sanitizeString = (value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  return value.trim();
};

const buildValidationError = (errors) => {
  const error = new ApiError(400, "Please correct the highlighted student fields.");
  error.details = errors;
  return error;
};

const validateStudentPayload = (payload, { isUpdate = false } = {}) => {
  const updates = {};
  const errors = {};

  const name = sanitizeString(payload.name); // Changed from fullName
  const email = sanitizeString(payload.email)?.toLowerCase();
  const password = typeof payload.password === "string" ? payload.password.trim() : undefined;
  const rollNumber = sanitizeString(payload.rollNumber); // Changed from studentId
  const department = sanitizeString(payload.department);
  const rawYearOfStudy = payload.yearOfStudy; // Changed from year

  if (!isUpdate || payload.name !== undefined) {
    if (!name) {
      errors.name = "Full name is required."; // Changed from fullName
    } else {
      updates.name = name;
    }
  }

  if (!isUpdate || payload.email !== undefined) {
    if (!email) {
      errors.email = "Email is required.";
    } else if (!emailPattern.test(email)) {
      errors.email = "Enter a valid email address.";
    } else {
      updates.email = email;
    }
  }

  if (!isUpdate || payload.password !== undefined) {
    if (!isUpdate && !password) {
      errors.password = "Password is required.";
    } else if (password) {
      if (password.length < 8) {
        errors.password = "Password must be at least 8 characters long.";
      } else {
        updates.password = password;
      }
    }
  }

  if (!isUpdate || payload.rollNumber !== undefined) {
    if (!rollNumber) {
      errors.rollNumber = "Roll number is required."; // Changed from studentId
    } else if (rollNumber.length < 3) {
      errors.rollNumber = "Roll number must be at least 3 characters long."; // Changed from studentId
    } else {
      updates.rollNumber = rollNumber; // Changed from studentId
    }
  }

  if (!isUpdate || payload.department !== undefined) {
    if (!department) {
      errors.department = "Department is required.";
    } else {
      updates.department = department;
    }
  }

  if (!isUpdate || payload.yearOfStudy !== undefined) {
    const yearOfStudy = Number(rawYearOfStudy); // Changed from year

    if (!Number.isInteger(yearOfStudy) || yearOfStudy < 1 || yearOfStudy > 4) {
      errors.yearOfStudy = "Year of study must be a whole number between 1 and 4."; // Changed from year
    } else {
      updates.yearOfStudy = yearOfStudy; // Changed from year
    }
  }

  if (Object.keys(errors).length > 0) {
    throw buildValidationError(errors);
  }

  return updates;
};

module.exports = {
  validateStudentPayload
};
