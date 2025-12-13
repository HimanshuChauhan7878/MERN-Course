const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const { createViolation } = require("../controllers/violationController");

// Officer issues violation
router.post("/", auth, createViolation);

module.exports = router;