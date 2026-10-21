const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getToken = (req) => {
  const header = req.headers.authorization;
  if (header && header.startsWith("Bearer ")) {
    return header.split(" ")[1];
  }
  return null;
};

const loadUser = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return User.findById(decoded.userId);
};

// Requires a valid JWT and attaches the user (without password) to req.user.
const protect = async (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Please log in to continue",
    });
  }

  try {
    req.user = await loadUser(token);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Your session has expired, please log in again"
          : "Invalid token",
    });
  }
};

// Attaches req.user when a valid token is present, otherwise continues as a
// guest. Used by routes that serve both guests and registered customers.
const optionalAuth = async (req, res, next) => {
  const token = getToken(req);
  if (!token) return next();

  try {
    req.user = (await loadUser(token)) || undefined;
  } catch {
    req.user = undefined;
  }
  next();
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

module.exports = { protect, optionalAuth, admin };
