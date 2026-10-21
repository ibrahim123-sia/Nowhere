const express = require("express");
const User = require("../models/User");
const { protect, admin } = require("../middleware/authMiddleware");
const { validateObjectId } = require("../middleware/errorMiddleware");
const { normalizeEmail, isValidEmail } = require("../utils/text");

const router = express.Router();

const ROLES = ["customer", "admin"];

//@route GET /api/admin/users
//@desc GET all users (admin only)
//@access private/admin
router.get("/", protect, admin, async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

//@route POST /api/admin/users
//@desc add a new user (admin only)
//@access private/admin
router.post("/", protect, admin, async (req, res, next) => {
  const { name, password, role } = req.body;
  const email = normalizeEmail(req.body.email);

  try {
    if (!name || !isValidEmail(email) || !password || String(password).length < 6) {
      return res.status(400).json({ message: "Name, a valid email and a 6+ character password are required" });
    }
    if (await User.exists({ email })) {
      return res.status(409).json({ message: "User Already Exist" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: ROLES.includes(role) ? role : "customer",
      // Accounts created by an admin don't need email verification.
      isVerified: true,
    });
    const { password: _pw, ...safeUser } = user.toObject();
    res.status(201).json({ message: "User created successfully", user: safeUser });
  } catch (error) {
    next(error);
  }
});

//@route PUT /api/admin/users/:id
//@desc update user info (admin only) name,email,role
//@access private/admin
router.put("/:id", protect, admin, validateObjectId(), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isSelf = user._id.equals(req.user._id);
    if (isSelf && req.body.role && req.body.role !== "admin") {
      return res.status(400).json({ message: "You can't remove your own admin access" });
    }

    if (req.body.email) {
      const email = normalizeEmail(req.body.email);
      if (!isValidEmail(email)) return res.status(400).json({ message: "Invalid email" });
      if (email !== user.email && (await User.exists({ email }))) {
        return res.status(409).json({ message: "Email is already in use" });
      }
      user.email = email;
    }
    if (req.body.name) user.name = req.body.name;
    if (ROLES.includes(req.body.role)) user.role = req.body.role;

    const updatedUser = await user.save();
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    next(error);
  }
});

//@route DELETE /api/admin/users/:id
//@desc delete a user
//@access private/admin
router.delete("/:id", protect, admin, validateObjectId(), async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't delete your own account" });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
