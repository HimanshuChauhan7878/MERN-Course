// controllers/paymentController.js

const Razorpay = require("razorpay");
const crypto = require("crypto");
const Bill = require("../models/Bill");
const Payment = require("../models/Payment");

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ======================================
// CREATE ORDER FOR FRONTEND PAYMENT PAGE
// ======================================
exports.createOrder = async (req, res) => {
  try {
    const { billId } = req.params;

    const bill = await Bill.findById(billId);
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    // Razorpay requires amount in paise
    const options = {
      amount: bill.amount * 100,
      currency: "INR",
      receipt: `bill_${bill._id}`
    };

    const order = await razorpay.orders.create(options);

    // Save to Payment collection
    await Payment.create({
      billId: bill._id,
      razorpayOrderId: order.id,
      amount: bill.amount,
      status: "created"
    });

    bill.razorpayOrderId = order.id;
    await bill.save();

    res.json({
      message: "Order created",
      orderId: order.id,
      amount: bill.amount,
      currency: "INR"
    });

  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================================
// VERIFY PAYMENT SIGNATURE (After Checkout)
// ======================================
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      billId
    } = req.body;

    // Generate HMAC SHA256 to verify signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Signature verification failed" });
    }

    // Update Bill status
    const bill = await Bill.findById(billId);
    if (!bill) return res.status(404).json({ message: "Bill not found" });

    bill.status = "paid";
    bill.transactionId = razorpay_payment_id;
    await bill.save();

    // Update Payment record
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "paid"
      }
    );

    res.json({
      message: "Payment verified successfully",
      paid: true
    });

  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================================
// RAZORPAY WEBHOOK HANDLER (Backup Verification)
// ======================================
exports.razorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "defaultsecret";

    // Validate webhook signature
    const body =
      req.body instanceof Buffer
        ? req.body.toString("utf8")
        : JSON.stringify(req.body);
    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const parsedBody =
      req.body instanceof Buffer ? JSON.parse(req.body.toString("utf8")) : req.body;
    const event = parsedBody.event;

    // Payment Captured event
    if (event === "payment.captured") {
      const payment = parsedBody.payload.payment.entity;

      await Payment.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        {
          razorpayPaymentId: payment.id,
          status: "paid"
        }
      );

      await Bill.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        {
          status: "paid",
          transactionId: payment.id
        }
      );
    }

    res.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ message: "Webhook server error" });
  }
};
