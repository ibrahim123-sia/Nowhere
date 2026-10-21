const express = require("express");
const rateLimit = require("express-rate-limit");
const Subscriber = require("../models/Subscriber");
const { normalizeEmail, isValidEmail } = require("../utils/text");

const router = express.Router();

const WELCOME_CODE = "WELCOME10";

const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: "Too many requests, please try again later" },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

//@route POST /api/subscribe
//@desc Handle newsletter subscription and hand out the welcome code
//@access Public
router.post("/subscribe", subscribeLimiter, async (req, res, next) => {
  const email = normalizeEmail(req.body.email);

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }

  try {
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(409).json({
        message: "This email is already subscribed",
        alreadySubscribed: true,
        couponCode: WELCOME_CODE,
      });
    }

    await Subscriber.create({ email });
    res.status(201).json({
      message: "Thank you for subscribing!",
      alreadySubscribed: false,
      couponCode: WELCOME_CODE,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
