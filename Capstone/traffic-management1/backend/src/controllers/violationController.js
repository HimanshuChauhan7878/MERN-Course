const Vehicle = require("../models/Vehicle");
const Challan = require("../models/Challan");
const sendSMS = require("../utils/sendSMS");

exports.createViolation = async (req, res) => {
  try {
    // Only officer can issue violation
    if (req.user.role !== "officer") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { vehicleNumber, violationType, location } = req.body;

    if (!vehicleNumber || !violationType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find vehicle
    const vehicle = await Vehicle.findOne({ vehicleNumber }).populate("ownerId");

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Fine rules (can be moved to DB later)
    const fineRules = {
      Helmet: 500,
      Speeding: 1000,
      "Red Light": 800,
      "Wrong Parking": 300
    };

    const fineAmount = fineRules[violationType] || 500;

    // Create challan
    const challan = await Challan.create({
      userId: vehicle.ownerId._id,
      vehicleNumber,
      violationType,
      fineAmount,
      location: location || undefined
    });

    // Send SMS (NO payment link)
    await sendSMS(
      vehicle.ownerId.phone,
      `Traffic Challan Issued
Vehicle: ${vehicleNumber}
Violation: ${violationType}
Fine: ₹${fineAmount}
Challan ID: ${challan._id}`
    );

    res.status(201).json({
      success: true,
      message: "Violation recorded & challan issued",
      challan
    });

  } catch (error) {
    console.error("Violation error:", error);
    res.status(500).json({ message: "Failed to record violation" });
  }
};
