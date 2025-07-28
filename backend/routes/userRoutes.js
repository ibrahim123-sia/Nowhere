const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const protect=require("../middleware/authMiddleware")

const router = express.Router();

//@route POST /api/users/register
//@desc register a new user
//@access public

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // registration logic
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User Already Exist" });

    user = new User({ name, email, password });
    await user.save();

    //create JWT Payload
    const payload = { user: { id: user._id, role: user.role } };

    //sign and return the token along with the user data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;

        // send the user token and respond
        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send("server error");
  }
});

//@route POST /api/users/login
//@desc authenticate user
//@access public

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    //find the user
    let user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "invalid credential" });
    const isMatch = await user.matchPassword(password);

    if (!isMatch)
      return res.status(400).json({ message: "invalid credential" });

      const payload = { user: { id: user._id, role: user.role } };

    //sign and return the token along with the user data
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;

        // send the user token and respond
        res.json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      }
    );


  } catch (error) {
    console.error(error);
    res.status(500).send("Server error")
  }
});


//@route Get /api/users/profile
//@desc get logged-in user's profile (protected route)
//@access private

router.get("/profile", protect, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
