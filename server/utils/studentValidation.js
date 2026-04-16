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

  const fullName = sanitizeString(payload.fullName);
  const email = sanitizeString(payload.email)?.toLowerCase();
  const password = typeof payload.password === "string" ? payload.password.trim() : undefined;
  const studentId = sanitizeString(payload.studentId);
  const department = sanitizeString(payload.department);
  const course = sanitizeString(payload.course);
  const section = sanitizeString(payload.section);
  const phone = sanitizeString(payload.phone);
  const rawyear= payload.sem;

  if (!isUpdate || payload.fullName !== undefined) {
    if (!fullName) {
      errors.fullName = "Full name is required.";
    } else {
      updates.fullName = fullName;
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

  if (!isUpdate || payload.studentId !== undefined) {
    if (!studentId) {
      errors.studentId = "Student ID is required.";
    } else if (studentId.length < 3) {
      errors.studentId = "Student ID must be at least 3 characters long.";
    } else {
      updates.studentId = studentId;
    }
  }

  if (!isUpdate || payload.department !== undefined) {
    if (!department) {
      errors.department = "Department is required.";
    } else {
      updates.department = department;
    }
  }

  if (!isUpdate || payload.course !== undefined) {
    if (!course) {
      errors.course = "Course is required.";
    } else {
      updates.course = course;
    }
  }

  if (!isUpdate || payload.year!== undefined) {
    const year= Number(rawsem);

    if (!Number.isInteger(sem) || year< 1 || year> 8) {
      errors.year= "yearmust be a whole number between 1 and 8.";
    } else {
      updates.year= sem;
    }
  }

  if (payload.section !== undefined) {
    if (section && section.length > 30) {
      errors.section = "Section must be 30 characters or fewer.";
    } else {
      updates.section = section || "";
    }
  } else if (!isUpdate) {
    updates.section = "";
  }

  if (payload.phone !== undefined) {
    if (phone && !phonePattern.test(phone)) {
      errors.phone = "Enter a valid phone number.";
    } else {
      updates.phone = phone || "";
    }
  } else if (!isUpdate) {
    updates.phone = "";
  }

  if (Object.keys(errors).length > 0) {
    throw buildValidationError(errors);
  }

  return updates;
};

module.exports = {
  validateStudentPayload
};
