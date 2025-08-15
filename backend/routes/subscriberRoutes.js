const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");

//@route POST /api/subscribe
//@desc Handle newsletter subscription
//@access Public
router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Normalize email by trimming and converting to lowercase
    const normalizedEmail = email.trim().toLowerCase();
    
    // Check if the email is already subscribed
    const existingSubscriber = await Subscriber.findOne({ email: normalizedEmail });

    if (existingSubscriber) {
      return res.status(409).json({ 
        message: "This email is already subscribed",
        alreadySubscribed: true 
      });
    }

    // Create new subscriber
    const subscriber = new Subscriber({ email: normalizedEmail });
    await subscriber.save();
    
    res.status(201).json({ 
      message: "Thank you for subscribing!",
      alreadySubscribed: false
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;