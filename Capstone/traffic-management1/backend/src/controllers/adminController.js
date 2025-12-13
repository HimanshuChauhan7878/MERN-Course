const Challan = require("../models/Challan");
const Vehicle = require("../models/Vehicle");
const User = require("../models/User");
const sendSMS = require("../utils/sendSMS");

// Admin can log challan directly
exports.createChallan = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { vehicleNumber, ownerId, violationType, fineAmount, description, location } = req.body;

    if (!vehicleNumber || !ownerId || !violationType || !fineAmount) {
      return res.status(400).json({ 
        message: "Vehicle number, owner, violation type, and fine amount are required" 
      });
    }

    // Verify owner exists
    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // Check if vehicle exists, if not create it
    let vehicle = await Vehicle.findOne({ vehicleNumber: vehicleNumber.toUpperCase() });
    if (!vehicle) {
      // Create vehicle if it doesn't exist
      vehicle = await Vehicle.create({
        vehicleNumber: vehicleNumber.toUpperCase(),
        vehicleType: "Unknown", // Default, can be updated later
        ownerId: ownerId
      });
    }

    // Create challan
    const challan = await Challan.create({
      userId: ownerId,
      vehicleNumber: vehicleNumber.toUpperCase(),
      violationType: violationType,
      fineAmount: parseFloat(fineAmount),
      location: location || undefined,
      description: description || undefined
    });

    // Send SMS notification
    try {
      await sendSMS(
        owner.phone,
        `Traffic Challan Issued
Vehicle: ${vehicleNumber.toUpperCase()}
Violation: ${violationType}
Fine: ₹${fineAmount}
Challan ID: ${challan._id}
${description ? `Description: ${description}` : ""}`
      );
    } catch (smsError) {
      console.error("SMS sending failed:", smsError);
      // Don't fail the request if SMS fails
    }

    res.status(201).json({
      success: true,
      message: "Challan created successfully",
      challan
    });
  } catch (error) {
    console.error("Admin challan creation error:", error);
    res.status(500).json({ message: "Failed to create challan", error: error.message });
  }
};

// Get all users for admin to select owner
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { search } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }

    const users = await User.find(filter)
      .select("name email phone role")
      .limit(50)
      .sort({ name: 1 });

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Search vehicles
exports.searchVehicles = async (req, res) => {
  try {
    const { vehicleNumber } = req.query;
    if (!vehicleNumber) {
      return res.status(400).json({ message: "Vehicle number is required" });
    }

    const vehicle = await Vehicle.findOne({ 
      vehicleNumber: vehicleNumber.toUpperCase() 
    }).populate("ownerId", "name email phone");

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json({ success: true, vehicle });
  } catch (error) {
    res.status(500).json({ message: "Failed to search vehicle" });
  }
};
