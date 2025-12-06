const path = require("path");
console.log("Running from:", __dirname);

require("dotenv").config();
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);
