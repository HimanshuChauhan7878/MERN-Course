const Challan = require("../models/Challan");
const Payment = require("../models/Payment");
const Violation = require("../models/Violation");
const User = require("../models/User");

// Get dashboard analytics (admin)
exports.getDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const totalChallans = await Challan.countDocuments();
    const pendingChallans = await Challan.countDocuments({ status: "pending" });
    const paidChallans = await Challan.countDocuments({ status: "paid" });
    
    const totalRevenue = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    
    const violationsByType = await Challan.aggregate([
      { $group: { _id: "$violationType", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const violationsByDate = await Challan.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);

    // Top violation locations
    const topLocations = await Challan.aggregate([
      { $match: { location: { $exists: true } } },
      {
        $group: {
          _id: { lat: "$location.lat", lng: "$location.lng" },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Repeat offenders
    const repeatOffenders = await Challan.aggregate([
      { $group: { _id: "$vehicleNumber", count: { $sum: 1 } } },
      { $match: { count: { $gte: 3 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      stats: {
        totalChallans,
        pendingChallans,
        paidChallans,
        totalRevenue: totalRevenue[0]?.total || 0,
        violationsByType,
        violationsByDate,
        topLocations,
        repeatOffenders
      }
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};

// Get violations heatmap data
exports.getHeatmapData = async (req, res) => {
  try {
    const violations = await Challan.find({
      location: { $exists: true, $ne: null }
    }).select("location violationType createdAt");

    res.json({ success: true, violations });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch heatmap data" });
  }
};
