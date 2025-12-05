const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// 1. Define your MongoDB Connection String
const MONGO_URI = "mongodb://127.0.0.1:27017/Himanshu-CRUD"; // 127.0.0.1 is same as localhost

// Simple schema & model to create test doc to ceck with compass
const userSchema = new mongoose.Schema({
  name: String,
});

const User = mongoose.model("User", userSchema);

// 2. Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("Connected successfully to MongoDB");

    // test doc for checking in compass
    await User.create({ name: "Himanshu" });
    console.log("Test user created");
// ... (in server.js, before app.listen)
const Item = require('./models/itemModel'); // Import the model

// Create a new Item
app.post('/api/items', async (req, res) => {
    try {
        const newItem = new Item(req.body); // req.body contains the JSON data
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
    // Start the Express server only after the database connection is successful
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("Connection failed:", error.message);
  });

// You will add the CRUD logic and routes here later
