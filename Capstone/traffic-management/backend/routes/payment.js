// routes/payment.js

const express = require("express");
const router = express.Router();

const {
  createOrder,
  verifyPayment,
  razorpayWebhook
} = require("../controllers/paymentController");

// Create Razorpay order (customer is about to pay)
router.post("/create-order/:billId", createOrder);

// Verify payment after checkout success
router.post("/verify", verifyPayment);

// Razorpay webhook (server-to-server)
router.post("/webhook", razorpayWebhook);

module.exports = router;
