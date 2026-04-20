const path = require("path");
const mongoose = require("mongoose");

const User = require("../models/User");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const { deleteFileIfExists } = require("../utils/fileStorage");
const { validateStudentPayload } = require("../utils/studentValidation");

const studentLookup = (facultyId, studentId) => ({
  _id: studentId,
  role: "student", // Role is correct
  assignedFaculty: facultyId
});

const getOwnedStudent = async (facultyId, studentId) => {
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    throw new ApiError(404, "Student not found.");
  }

  const student = await User.Student.findOne(studentLookup(facultyId, studentId)).populate(
    "assignedFaculty",
    "name email"
  );

  if (!student) {
    throw new ApiError(404, "Student not found.");
  }

  return student;
};

const ensureUniqueStudentFields = async (updates, currentStudentId = null) => {
  const conflictQuery = [];

  if (updates.email) { // Email uniqueness check is correct
    conflictQuery.push({ email: updates.email });
  }

  if (updates.rollNumber) { // Changed from studentId
    conflictQuery.push({ rollNumber: updates.rollNumber }); // Changed from studentId
  }

  if (conflictQuery.length === 0) {
    return;
  }

  const existingUser = await User.findAnyOne({ // Find existing user for conflict check
    $or: conflictQuery,
    ...(currentStudentId ? { _id: { $ne: currentStudentId } } : {})
  });

  if (!existingUser) {
    return;
  }

  if (updates.email && existingUser.email === updates.email) {
    throw new ApiError(409, "A user with that email already exists.");
  }

  if (updates.rollNumber && existingUser.rollNumber === updates.rollNumber) { // Changed from studentId
    throw new ApiError(409, "A student with that roll number already exists."); // Changed from student ID
  }
};

const listStudents = asyncHandler(async (req, res) => {
  const students = await User.Student.find({
    assignedFaculty: req.user._id
  })
    .populate("assignedFaculty", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    students: students.map((student) => student.toSafeObject())
  });
});

const getStudentById = asyncHandler(async (req, res) => {
  const student = await getOwnedStudent(req.user._id, req.params.id);

  res.status(200).json({
    student: student.toSafeObject()
  });
});

const createStudent = asyncHandler(async (req, res) => {
  const studentData = validateStudentPayload(req.body);

  await ensureUniqueStudentFields(studentData);

  const student = await User.Student.create({
    ...studentData,
    role: "student",
    assignedFaculty: req.user._id
  });

  await student.populate("assignedFaculty", "name email");

  res.status(201).json({
    message: "Student created successfully.",
    student: student.toSafeObject()
  });
});

const updateStudent = asyncHandler(async (req, res) => {
  const student = await getOwnedStudent(req.user._id, req.params.id);
  const updates = validateStudentPayload(req.body, { isUpdate: true });

  await ensureUniqueStudentFields(updates, student._id);

  Object.assign(student, updates);
  await student.save();
  await student.populate("assignedFaculty", "name email"); // Changed from fullName

  res.status(200).json({
    message: "Student updated successfully.",
    student: student.toSafeObject()
  });
});

const deleteStudent = asyncHandler(async (req, res) => {
  const student = await getOwnedStudent(req.user._id, req.params.id);

  await deleteFileIfExists(student.marksheet?.filePath);
  await student.deleteOne();

  res.status(200).json({
    message: "Student deleted successfully."
  });
});

const uploadMarksheet = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Please choose a marksheet file to upload.");
  }

  try {
    const student = await getOwnedStudent(req.user._id, req.params.id);
    const previousMarksheetPath = student.marksheet?.filePath;

    student.marksheet = {
      originalName: req.file.originalname,
      filePath: path.join("uploads", "marksheets", req.file.filename),
      mimeType: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date()
    };

    await student.save();
    await student.populate("assignedFaculty", "name email"); // Changed from fullName
    await deleteFileIfExists(previousMarksheetPath);

    res.status(200).json({
      message: "Marksheet uploaded successfully.",
      student: student.toSafeObject()
    });
  } catch (error) {
    await deleteFileIfExists(path.join("uploads", "marksheets", req.file.filename));
    throw error;
  }
});

module.exports = {
  listStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  uploadMarksheet
};


