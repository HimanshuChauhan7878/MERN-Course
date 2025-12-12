const express = require("express");
const router = express.Router();

const {
  register,
  login,
  refreshToken,
  getProfile
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.get("/me", authMiddleware, getProfile);

module.exports = router;
