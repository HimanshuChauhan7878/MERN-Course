const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

// Define schemas inline to avoid broken model files
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "officer", "citizen"], default: "citizen" }
});

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: { type: String, unique: true, required: true },
  vehicleType: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Register models
    const User = mongoose.model("User", userSchema);
    const Vehicle = mongoose.model("Vehicle", vehicleSchema);

    // Clear collections
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    console.log("✅ Collections cleared");

    const hashedPassword = await bcrypt.hash("123456", 10);

    // Create Admin
    const admin = await User.create({
      name: "Admin User",
      email: "admin@traffic.com",
      phone: "+917777777777",
      password: hashedPassword,
      role: "admin"
    });

    const citizen = await User.create({
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone: "+919999999999",
      password: hashedPassword,
      role: "citizen"
    });

    const officer = await User.create({
      name: "Amit Verma",
      email: "officer@gmail.com",
      phone: "+918888888888",
      password: hashedPassword,
      role: "officer"
    });

    await Vehicle.create({
      vehicleNumber: "RJ14AB1234",
      vehicleType: "Bike",
      ownerId: citizen._id
    });

    await Vehicle.create({
      vehicleNumber: "DL3CAF9981",
      vehicleType: "Car",
      ownerId: citizen._id
    });

    console.log("✅ Seed data inserted successfully");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
}

seedData();