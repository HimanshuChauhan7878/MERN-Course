const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =======================
//   REGISTER
// =======================
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check missing fields
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.json({ msg: "User registered successfully" });

  } catch (err) {
    console.error("REGISTER ERROR:", err);   // 🔥 Shows real error in terminal
    res.status(500).send("Server Error");
  }
});


// =======================
//   LOGIN
// =======================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check missing fields
    if (!email || !password) {
      return res.status(400).json({ msg: "Email & password required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.json({ msg: "Login successful", token });

  } catch (err) {
    console.error("LOGIN ERROR:", err);   // 🔥 Shows real error in terminal
    res.status(500).send("Server Error");
  }
});

module.exports = router;
