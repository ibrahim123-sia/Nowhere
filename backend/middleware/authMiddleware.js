const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  
  // 1. Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "No token provided" 
    });
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token payload:", decoded); // Debug log

    // 3. Get user from database
    req.user = await User.findById(decoded.userId); // Changed from decoded.user.id
    
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: "User not found" 
      });
    }

    next();
  } catch (error) {
    console.error("JWT Verification Error:", {
      name: error.name,
      message: error.message,
      expiredAt: error.expiredAt
    });
    
    return res.status(401).json({ 
      success: false,
      message: "Invalid token",
      error: error.message 
    });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ 
      success: false,
      message: "Not authorized as admin" 
    });
  }
};

module.exports = { protect, admin };