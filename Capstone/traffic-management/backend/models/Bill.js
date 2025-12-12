const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String,
      default: ""
    },
    dueDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "paid", "cancelled"],
      default: "pending"
    },
    paymentLink: {
      type: String
    },
    razorpayOrderId: {
      type: String
    },
    transactionId: {
      type: String
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", billSchema);
