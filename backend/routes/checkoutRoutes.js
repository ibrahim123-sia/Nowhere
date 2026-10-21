const express = require("express");
const rateLimit = require("express-rate-limit");
const { optionalAuth } = require("../middleware/authMiddleware");
const cartService = require("../services/cartService");
const orderService = require("../services/orderService");
const { sendOrderConfirmation } = require("../utils/mailer");

const router = express.Router();

const placeOrderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  message: { message: "Too many orders from this device, please try again shortly" },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

//@route POST /api/checkout/quote
//@desc price the current cart (subtotal, shipping, promo code, total)
//@access public (guest or logged in)
router.post("/quote", optionalAuth, async (req, res, next) => {
  try {
    const owner = cartService.resolveOwner(req.user, req.body.guestId);
    const cart = await cartService.getCart(owner);
    const totals = await orderService.quote(cart, {
      couponCode: req.body.couponCode,
      email: req.user ? req.user.email : req.body.email,
    });
    res.json({ cart: cartService.summarize(cart), ...totals });
  } catch (error) {
    next(error);
  }
});

//@route POST /api/checkout
//@desc place a cash-on-delivery order from the current cart
//@access public (guest checkout supported)
router.post("/", placeOrderLimiter, optionalAuth, async (req, res, next) => {
  try {
    const { guestId, email, shippingAddress, paymentMethod, couponCode } = req.body;
    const owner = cartService.resolveOwner(req.user, guestId);

    const order = await orderService.placeOrder({
      owner,
      user: req.user,
      email,
      shippingAddress,
      paymentMethod,
      couponCode,
      source: "web",
    });

    sendOrderConfirmation(order).catch((err) =>
      console.error("Order email failed:", err.message)
    );
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
