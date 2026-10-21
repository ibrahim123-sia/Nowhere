const express = require("express");
const rateLimit = require("express-rate-limit");
const { sendContactMessage } = require("../utils/mailer");
const { normalizeEmail, isValidEmail } = require("../utils/text");

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { message: "Too many messages, please try again later" },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

//@route POST /api/contact
//@desc send a contact-form message to the store inbox
//@access public
router.post("/", contactLimiter, async (req, res) => {
  const name = String(req.body.name || "").trim().slice(0, 100);
  const email = normalizeEmail(req.body.email);
  const subject = String(req.body.subject || "").trim().slice(0, 150);
  const message = String(req.body.message || "").trim().slice(0, 3000);

  if (!name || !isValidEmail(email) || message.length < 10) {
    return res.status(400).json({ message: "Please add your name, a valid email and a message of at least 10 characters" });
  }

  try {
    await sendContactMessage({ name, email, subject, message });
    res.json({ message: "Thanks! We'll reply within one working day." });
  } catch (error) {
    console.error("Contact email failed:", error.message);
    res.status(500).json({ message: "We couldn't send your message. Please email us directly." });
  }
});

module.exports = router;
