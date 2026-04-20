const express = require("express");

const { login, logout, register, listFaculties } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/faculties", listFaculties);
router.post("/logout", protect, logout);

module.exports = router;
