const { app, initializeRoutes } = require("./src/app");
const connectDB = require("./src/config/db.js");

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await connectDB();
    console.log("✅ Database connected");
    
    // Initialize routes after DB connection
    initializeRoutes();
    
    app.listen(PORT, () => {
      console.log(`🚦 Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();