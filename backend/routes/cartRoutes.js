const express = require("express");
const { protect, optionalAuth } = require("../middleware/authMiddleware");
const cartService = require("../services/cartService");
const orderService = require("../services/orderService");

const router = express.Router();

const ownerFrom = (req) =>
  cartService.resolveOwner(req.user, req.body?.guestId || req.query.guestId);

//@route GET /api/cart
//@desc get logged-in user's cart or guest's cart
//@access public
router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const cart = await cartService.getCart(ownerFrom(req));
    res.json(cartService.summarize(cart));
  } catch (error) {
    next(error);
  }
});

//@route POST /api/cart
//@desc add a product to the cart for the guest and logged-in user
//@access public
router.post("/", optionalAuth, async (req, res, next) => {
  try {
    const { productId, quantity, size, color } = req.body;
    const { cart } = await cartService.addItem(ownerFrom(req), { productId, quantity, size, color });
    res.status(200).json(cartService.summarize(cart));
  } catch (error) {
    next(error);
  }
});

//@route PUT /api/cart
//@desc update product quantity in the cart (0 removes the item)
//@access public
router.put("/", optionalAuth, async (req, res, next) => {
  try {
    const { productId, quantity, size, color } = req.body;
    const cart = await cartService.updateItem(ownerFrom(req), { productId, quantity, size, color });
    res.status(200).json(cartService.summarize(cart));
  } catch (error) {
    next(error);
  }
});

//@route DELETE /api/cart
//@desc remove product from cart
//@access public
router.delete("/", optionalAuth, async (req, res, next) => {
  try {
    const { productId, size, color } = req.body;
    const cart = await cartService.removeItem(ownerFrom(req), { productId, size, color });
    res.status(200).json(cartService.summarize(cart));
  } catch (error) {
    next(error);
  }
});

//@route POST /api/cart/merge
//@desc merge guest cart into user cart on login
//@access private
router.post("/merge", protect, async (req, res, next) => {
  try {
    const cart = await cartService.mergeGuestCart(req.user, req.body.guestId);
    res.status(200).json(cartService.summarize(cart));
  } catch (error) {
    next(error);
  }
});

//@route POST /api/cart/reorder
//@desc add every available item from a past order back into the cart
//@access private
router.post("/reorder", protect, async (req, res, next) => {
  try {
    const order = await orderService.getOrderForUser(req.body.orderId, req.user);
    const { cart, added, skipped } = await cartService.reorder({ user: req.user._id }, order);
    res.json({ cart: cartService.summarize(cart), added, skipped });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
