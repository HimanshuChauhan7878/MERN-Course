const jwt = require("jsonwebtoken");

// Simple JWT auth middleware
exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || "devaccesssecret"
    );
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
