const Payment = require("../models/Payment");
const Challan = require("../models/Challan");

// Create payment
exports.createPayment = async (req, res) => {
  try {
    const { challanId } = req.body;
    
    const challan = await Challan.findById(challanId);
    if (!challan) {
      return res.status(404).json({ message: "Challan not found" });
    }

    if (challan.status === "paid") {
      return res.status(400).json({ message: "Challan already paid" });
    }

    // Create payment record
    const payment = await Payment.create({
      challanId,
      userId: req.user.id,
      amount: challan.fineAmount,
      status: "completed", // In production, integrate with payment gateway
      transactionId: `TXN${Date.now()}`
    });

    // Update challan status
    challan.status = "paid";
    challan.paidAt = new Date();
    await challan.save();

    res.json({
      success: true,
      message: "Payment successful",
      payment
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ message: "Payment failed" });
  }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .populate("challanId")
      .sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};
