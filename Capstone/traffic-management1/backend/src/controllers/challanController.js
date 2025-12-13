const Challan = require("../models/Challan");
const Payment = require("../models/Payment");
const User = require("../models/User");

// Get all challans for a user (citizen)
exports.getUserChallans = async (req, res) => {
  try {
    const challans = await Challan.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json({ success: true, challans });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch challans" });
  }
};

// Get challan by vehicle number (public search)
exports.getChallanByVehicle = async (req, res) => {
  try {
    const { vehicleNumber } = req.params;
    const challans = await Challan.find({ vehicleNumber })
      .populate("userId", "name phone email")
      .sort({ createdAt: -1 });
    res.json({ success: true, challans });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch challans" });
  }
};

// Get all challans (admin/officer)
exports.getAllChallans = async (req, res) => {
  try {
    const { status, vehicleNumber } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (vehicleNumber) filter.vehicleNumber = vehicleNumber;

    const challans = await Challan.find(filter)
      .populate("userId", "name phone email")
      .sort({ createdAt: -1 });
    res.json({ success: true, challans });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch challans" });
  }
};

// Get single challan by ID
exports.getChallanById = async (req, res) => {
  try {
    const challan = await Challan.findById(req.params.id)
      .populate("userId", "name phone email");
    if (!challan) {
      return res.status(404).json({ message: "Challan not found" });
    }
    res.json({ success: true, challan });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch challan" });
  }
};

// Update challan status (admin)
exports.updateChallanStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }
    const { status } = req.body;
    const challan = await Challan.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ success: true, challan });
  } catch (error) {
    res.status(500).json({ message: "Failed to update challan" });
  }
};
