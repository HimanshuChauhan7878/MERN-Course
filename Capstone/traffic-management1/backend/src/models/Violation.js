const mongoose = require("mongoose");

const violationSchema = new mongoose.Schema({
  vehicleNumber: String,
  violationType: String,
  location: {
    lat: Number,
    lng: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Violation", violationSchema);
