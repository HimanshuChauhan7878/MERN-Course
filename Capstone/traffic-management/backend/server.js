// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// DB connection
const connectDB = require("./config/db");

// Routers
const authRoutes = require("./routes/auth");
const billRoutes = require("./routes/bill");
const paymentRoutes = require("./routes/payment");

// Middleware
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/payments", paymentRoutes);

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
