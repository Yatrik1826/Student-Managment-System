const express = require("express");

const { getMe, getMyMarksheet } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, getMe);
router.get("/me/marksheet", protect, authorize("student"), getMyMarksheet);

module.exports = router;
