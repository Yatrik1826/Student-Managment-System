const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const fixStudentNames = async () => {
  await connectDB();

  // Find all students with undefined or null names
  const studentsWithoutNames = await User.find({
    role: "student",
    $or: [
      { name: { $exists: false } },
      { name: null },
      { name: "" }
    ]
  });

  console.log(`Found ${studentsWithoutNames.length} students without names`);

  for (const student of studentsWithoutNames) {
    // Set a default name based on email or roll number
    const defaultName = student.rollNumber
      ? `Student ${student.rollNumber}`
      : `Student ${student.email.split('@')[0]}`;

    student.name = defaultName;
    await student.save({ validateBeforeSave: false });
    console.log(`Updated student ${student._id}: ${defaultName}`);
  }

  console.log("All students fixed!");
  await mongoose.connection.close();
};

fixStudentNames();