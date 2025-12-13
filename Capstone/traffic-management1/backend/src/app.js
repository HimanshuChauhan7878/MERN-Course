const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Delay route registration - they will be added after DB connection in server.js
function initializeRoutes() {
  app.use("/api/auth", require("./routes/authRoutes"));
  app.use("/api/violations", require("./routes/violationRoutes"));
  app.use("/api/challans", require("./routes/challanRoutes"));
  app.use("/api/analytics", require("./routes/analyticsRoutes"));
  app.use("/api/payments", require("./routes/paymentRoutes"));
  app.use("/api/admin", require("./routes/adminRoutes"));
}

app.get("/", (req, res) => {
  res.send("Smart Traffic Backend Running");
});

module.exports = { app, initializeRoutes };