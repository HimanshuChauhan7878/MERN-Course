const mongoose = require("mongoose");

const challanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  vehicleNumber: {
    type: String,
    required: true
  },
  violationType: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  fineAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "paid", "cancelled"],
    default: "pending"
  },
  location: {
    lat: Number,
    lng: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  paidAt: Date
}, {
  timestamps: true
});

module.exports = mongoose.model("Challan", challanSchema);

