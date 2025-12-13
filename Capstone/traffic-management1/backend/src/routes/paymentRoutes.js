const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  createPayment,
  getPaymentHistory
} = require("../controllers/paymentController");

// Create payment
router.post("/", auth, createPayment);

// Get payment history
router.get("/history", auth, getPaymentHistory);

module.exports = router;
