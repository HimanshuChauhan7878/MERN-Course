const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  createChallan,
  getAllUsers,
  searchVehicles
} = require("../controllers/adminController");

// Admin create challan
router.post("/challans", auth, createChallan);

// Get all users (for owner selection)
router.get("/users", auth, getAllUsers);

// Search vehicle
router.get("/vehicles/search", auth, searchVehicles);

module.exports = router;
