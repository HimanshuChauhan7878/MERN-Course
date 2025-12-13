const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  getUserChallans,
  getAllChallans,
  getChallanById,
  getChallanByVehicle,
  updateChallanStatus
} = require("../controllers/challanController");

// Get user's own challans (citizen)
router.get("/my-challans", auth, getUserChallans);

// Get all challans (admin/officer)
router.get("/", auth, getAllChallans);

// Get challan by ID
router.get("/:id", auth, getChallanById);

// Public search by vehicle number
router.get("/vehicle/:vehicleNumber", getChallanByVehicle);

// Update challan status (admin)
router.patch("/:id/status", auth, updateChallanStatus);

module.exports = router;
