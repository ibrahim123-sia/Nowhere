const express = require("express");
const rateLimit = require("express-rate-limit");
const { protect } = require("../middleware/authMiddleware");
const orderService = require("../services/orderService");

const router = express.Router();

const trackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  message: { message: "Too many lookups, please try again later" },
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

//@route GET /api/orders/my-orders
//@desc get logged-in user orders, newest first
//@access private
router.get("/my-orders", protect, async (req, res, next) => {
  try {
    res.json(await orderService.listUserOrders(req.user));
  } catch (error) {
    next(error);
  }
});

//@route POST /api/orders/track
//@desc look up an order by order number + email (works for guests)
//@access public
router.post("/track", trackLimiter, async (req, res, next) => {
  try {
    const order = await orderService.trackOrder(req.body.orderNumber, req.body.email);
    const { guestId, user, ...rest } = order.toObject();
    res.json(rest);
  } catch (error) {
    next(error);
  }
});

//@route GET /api/orders/:id
//@desc get order details by id (owner or admin only)
//@access private
router.get("/:id", protect, async (req, res, next) => {
  try {
    const order = await orderService.getOrderForUser(req.params.id, req.user);
    res.json(await order.populate("user", "name email"));
  } catch (error) {
    next(error);
  }
});

//@route PUT /api/orders/:id/cancel
//@desc cancel an order that hasn't shipped yet
//@access private
router.put("/:id/cancel", protect, async (req, res, next) => {
  try {
    const order = await orderService.getOrderForUser(req.params.id, req.user);
    const updated = await orderService.cancelOrder(order, {
      reason: req.body.reason ? String(req.body.reason).slice(0, 200) : "Cancelled by customer",
    });
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
