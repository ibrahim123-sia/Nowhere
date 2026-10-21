const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const { sendOtpEmail } = require("../utils/mailer");
const { normalizeEmail, isValidEmail } = require("../utils/text");

const router = express.Router();

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

// Limits how often an IP can trigger OTP emails (5 per 15 minutes).
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { message: "Too many OTP requests from this IP, please try again later" },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

// Limits code-guessing on verification and reset endpoints.
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  message: { message: "Too many attempts, please try again later" },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { message: "Too many login attempts, please try again later" },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const generateOtp = () => crypto.randomInt(100000, 1000000).toString();

// OTPs are stored hashed so a database leak doesn't expose live codes.
const hashOtp = (otp) => crypto.createHash("sha256").update(String(otp)).digest("hex");

const otpMatches = (stored, entered) => {
  if (!stored || !entered) return false;
  const a = Buffer.from(stored);
  const b = Buffer.from(hashOtp(String(entered).trim()));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

const signToken = (user) =>
  jwt.sign(
    { userId: user._id.toString(), email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  shippingAddress: user.shippingAddress,
});

// @route   POST /api/users/register
// @desc    Register a new user and send OTP
// @access  Public
router.post("/register", otpLimiter, async (req, res) => {
  const { name, password } = req.body;
  const email = normalizeEmail(req.body.email);

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    let user = await User.findOne({ email });

    if (user?.isVerified) {
      return res.status(400).json({
        message: "User already exists. Please login instead.",
      });
    }

    const isNewUser = !user;
    const otp = generateOtp();

    if (user) {
      user.name = name;
      user.password = password; // hashed by the pre-save hook
    } else {
      user = new User({ name, email, password });
    }
    user.otp = hashOtp(otp);
    user.otpExpires = new Date(Date.now() + OTP_TTL_MS);
    user.otpAttempts = 0;
    await user.save();

    try {
      await sendOtpEmail({ to: email, name, otp });
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
      if (isNewUser) await User.deleteOne({ _id: user._id });
      return res.status(500).json({
        message: "Failed to send OTP email. Please try again.",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please check your inbox.",
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// @route   POST /api/users/verify-otp
// @desc    Verify OTP and activate account
// @access  Public
router.post("/verify-otp", verifyLimiter, async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const otp = String(req.body.otp || "").trim();

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email }).select("+otp +otpExpires +otpAttempts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "Account already verified. Please login." });
    }
    if (!user.otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }
    if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
      return res.status(429).json({ message: "Too many wrong codes. Please request a new OTP." });
    }
    if (!otpMatches(user.otp, otp)) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpAttempts = 0;
    await user.save();

    res.json({
      success: true,
      user: publicUser(user),
      token: signToken(user),
      message: "Account verified successfully!",
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/users/resend-otp
// @desc    Resend OTP to user's email
// @access  Public
router.post("/resend-otp", otpLimiter, async (req, res) => {
  const email = normalizeEmail(req.body.email);

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "Account already verified. Please login." });
    }

    const otp = generateOtp();
    user.otp = hashOtp(otp);
    user.otpExpires = new Date(Date.now() + OTP_TTL_MS);
    user.otpAttempts = 0;
    await user.save();

    try {
      await sendOtpEmail({ to: email, name: user.name, otp });
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
      return res.status(500).json({ message: "Failed to send OTP email. Please try again." });
    }

    res.status(200).json({
      success: true,
      message: "New OTP sent to your email. Please check your inbox.",
    });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ message: "Server error while resending OTP" });
  }
});

// @route   POST /api/users/login
// @desc    Authenticate user
// @access  Public
router.post("/login", loginLimiter, async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const { password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Account not verified. Please verify your email first.",
        needsVerification: true,
      });
    }

    res.json({
      success: true,
      token: signToken(user),
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// @route   GET /api/users/profile
// @desc    Get logged-in user's profile
// @access  Private
router.get("/profile", protect, (req, res) => {
  res.json({ success: true, user: publicUser(req.user) });
});

// @route   PUT /api/users/profile
// @desc    Update name, phone, default address or password
// @access  Private
router.put("/profile", protect, async (req, res) => {
  const { name, phone, shippingAddress, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id).select("+password");

    if (name !== undefined) {
      if (!String(name).trim()) return res.status(400).json({ message: "Name can't be empty" });
      user.name = String(name).trim();
    }
    if (phone !== undefined) user.phone = String(phone).trim();
    if (shippingAddress && typeof shippingAddress === "object") {
      const fields = ["fullName", "address", "city", "postalCode", "country", "phone"];
      user.shippingAddress = Object.fromEntries(
        fields.map((f) => [f, String(shippingAddress[f] || "").trim()])
      );
    }
    if (newPassword) {
      if (!currentPassword || !(await user.matchPassword(currentPassword))) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      if (String(newPassword).length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters" });
      }
      user.password = newPassword;
    }

    await user.save();
    res.json({ success: true, user: publicUser(user), message: "Profile updated" });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
});

// @route   POST /api/users/forgot-password
// @desc    Send OTP for password reset
// @access  Public
router.post("/forgot-password", otpLimiter, async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const genericResponse = {
    success: true,
    message: "If an account exists, an OTP has been sent to your email",
  };

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    // Same response whether or not the account exists.
    if (!user) return res.json(genericResponse);

    const otp = generateOtp();
    user.resetPasswordOtp = hashOtp(otp);
    user.resetPasswordExpires = new Date(Date.now() + OTP_TTL_MS);
    user.otpAttempts = 0;
    await user.save();

    await sendOtpEmail({ to: email, name: user.name, otp, purpose: "reset" });
    res.json(genericResponse);
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// @route   POST /api/users/reset-password
// @desc    Reset password with OTP
// @access  Public
router.post("/reset-password", verifyLimiter, async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const { otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }
  if (String(newPassword).length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const user = await User.findOne({ email }).select(
      "+resetPasswordOtp +resetPasswordExpires +otpAttempts"
    );

    if (!user || !user.resetPasswordOtp || user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired or invalid. Please request a new one." });
    }
    if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
      return res.status(429).json({ message: "Too many wrong codes. Please request a new OTP." });
    }
    if (!otpMatches(user.resetPasswordOtp, otp)) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    user.otpAttempts = 0;
    // Resetting the password also proves ownership of the email.
    user.isVerified = true;
    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
