const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");  // <-- This works

const app = express();

// Test log
console.log("SERVER FILE EXECUTING...");

// Connect to DB
connectDB();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend running...");
});

// Auth Routes
app.use("/api/auth", require("./routes/authRoutes"));

app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);
