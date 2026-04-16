const express = require("express");

const {
  listStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  uploadMarksheet
} = require("../controllers/studentController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { uploadMarksheet: uploadMarksheetMiddleware } = require("../middleware/upload");

const router = express.Router();

router.use(protect, authorize("faculty"));

router.route("/").get(listStudents).post(createStudent);
router.route("/:id").get(getStudentById).put(updateStudent).delete(deleteStudent);
router.post("/:id/marksheet", uploadMarksheetMiddleware.single("marksheet"), uploadMarksheet);

module.exports = router;

