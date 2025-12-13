const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  getDashboardStats,
  getHeatmapData
} = require("../controllers/analyticsController");

// Get dashboard analytics (admin only)
router.get("/dashboard", auth, getDashboardStats);

// Get heatmap data
router.get("/heatmap", auth, getHeatmapData);

module.exports = router;
