const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const store = require("../config/store");
const cartService = require("./cartService");
const HttpError = require("../utils/httpError");
const { normalizeEmail, isValidEmail } = require("../utils/text");

// ---------- Pricing ----------

async function resolveCoupon(code, { subtotal, email }) {
  if (!code) return { discount: 0 };
  const key = String(code).trim().toUpperCase();
  const coupon = store.coupons[key];
  if (!coupon) return { discount: 0, couponError: "That promo code is not valid" };
  if (subtotal < coupon.minSubtotal) {
    return {
      discount: 0,
      couponError: `${key} needs a subtotal of at least Rs. ${coupon.minSubtotal.toLocaleString("en-US")}`,
    };
  }
  if (key === "WELCOME10" && email) {
    const used = await Order.exists({ email, couponCode: key, status: { $ne: "Cancelled" } });
    if (used) return { discount: 0, couponError: "WELCOME10 can only be used on your first order" };
  }
  const discount =
    coupon.type === "percent" ? Math.round((subtotal * coupon.value) / 100) : Math.min(coupon.value, subtotal);
  return { discount, couponCode: key };
}

// Server-side totals for a cart. Never trust totals sent by the client.
async function quote(cart, { couponCode, email } = {}) {
  const itemsPrice = cart ? cart.products.reduce((acc, i) => acc + i.price * i.quantity, 0) : 0;
  const { freeShippingThreshold, standardFee } = store.shipping;
  const shippingPrice = itemsPrice === 0 || itemsPrice >= freeShippingThreshold ? 0 : standardFee;
  const coupon = await resolveCoupon(couponCode, { subtotal: itemsPrice, email });
  const totalPrice = Math.max(itemsPrice - coupon.discount + shippingPrice, 0);

  return {
    itemsPrice,
    shippingPrice,
    discount: coupon.discount,
    couponCode: coupon.couponCode || null,
    couponError: coupon.couponError || null,
    totalPrice,
    freeShippingRemaining: Math.max(freeShippingThreshold - itemsPrice, 0),
  };
}

// ---------- Validation ----------

function validateShippingAddress(input = {}) {
  const address = {
    fullName: String(input.fullName || "").trim(),
    address: String(input.address || "").trim(),
    city: String(input.city || "").trim(),
    postalCode: String(input.postalCode || "").trim(),
    country: String(input.country || "Pakistan").trim(),
    phone: String(input.phone || "").trim(),
  };
  const missing = ["fullName", "address", "city", "postalCode", "phone"].filter((k) => !address[k]);
  if (missing.length) {
    throw new HttpError(400, `Missing delivery details: ${missing.join(", ")}`);
  }
  if (!/^\+?[0-9\s-]{10,15}$/.test(address.phone)) {
    throw new HttpError(400, "Please enter a valid phone number");
  }
  return address;
}

// ---------- Stock ----------

// Atomically reserves stock for every product in the order. If any product
// is short, everything reserved so far is released again.
async function reserveStock(items) {
  const totals = new Map();
  items.forEach((i) => {
    const key = i.productId.toString();
    totals.set(key, (totals.get(key) || 0) + i.quantity);
  });

  const reserved = [];
  for (const [productId, qty] of totals) {
    const res = await Product.updateOne(
      { _id: productId, countInStock: { $gte: qty } },
      { $inc: { countInStock: -qty } }
    );
    if (res.modifiedCount === 0) {
      await releaseStock(reserved);
      const product = await Product.findById(productId).select("name countInStock");
      const name = product ? product.name : "An item";
      throw new HttpError(
        409,
        product && product.countInStock > 0
          ? `Only ${product.countInStock} left of ${name}. Please update your cart.`
          : `${name} just sold out. Please remove it from your cart.`
      );
    }
    reserved.push({ productId, quantity: qty });
  }
  return reserved;
}

async function releaseStock(items) {
  for (const { productId, quantity } of items) {
    await Product.updateOne({ _id: productId }, { $inc: { countInStock: quantity } });
  }
}

// ---------- Orders ----------

async function placeOrder({ owner, user, email, shippingAddress, paymentMethod = "COD", couponCode, source = "web" }) {
  const cart = await cartService.getCart(owner);
  if (!cart || cart.products.length === 0) throw new HttpError(400, "Your cart is empty");

  if (!store.paymentMethods.some((m) => m.code === paymentMethod)) {
    throw new HttpError(400, "Unsupported payment method");
  }

  const contactEmail = user ? user.email : normalizeEmail(email);
  if (!isValidEmail(contactEmail)) throw new HttpError(400, "Please enter a valid email address");

  const address = validateShippingAddress(shippingAddress);
  const totals = await quote(cart, { couponCode, email: contactEmail });
  if (couponCode && totals.couponError) throw new HttpError(400, totals.couponError);

  const orderItems = cart.products.map((p) => ({
    productId: p.productId,
    name: p.name,
    image: p.image,
    price: p.price,
    size: p.size,
    color: p.color,
    quantity: p.quantity,
  }));

  const reserved = await reserveStock(orderItems);

  let order;
  try {
    order = await Order.create({
      user: user ? user._id : undefined,
      guestId: user ? undefined : owner.guestId,
      email: contactEmail,
      orderItems,
      shippingAddress: address,
      paymentMethod,
      itemsPrice: totals.itemsPrice,
      shippingPrice: totals.shippingPrice,
      discount: totals.discount,
      couponCode: totals.couponCode || undefined,
      totalPrice: totals.totalPrice,
      source,
    });
  } catch (error) {
    await releaseStock(reserved);
    throw error;
  }

  await cartService.clearCart(owner);
  if (user) {
    await User.updateOne({ _id: user._id }, { shippingAddress: address, phone: address.phone });
  }
  return order;
}

const canView = (order, user) =>
  user && (user.role === "admin" || (order.user && order.user.toString() === user._id.toString()));

async function getOrderForUser(orderId, user) {
  if (!mongoose.Types.ObjectId.isValid(orderId)) throw new HttpError(404, "Order not found");
  const order = await Order.findById(orderId);
  // Same response for "missing" and "not yours" so order ids can't be probed.
  if (!order || !canView(order, user)) throw new HttpError(404, "Order not found");
  return order;
}

const listUserOrders = (user, limit = 50) =>
  Order.find({ user: user._id }).sort({ createdAt: -1 }).limit(limit);

const listGuestOrders = (guestId, limit = 10) =>
  Order.find({ guestId }).sort({ createdAt: -1 }).limit(limit);

// Finds an order that belongs to the given owner by id or order number.
async function findOwnedOrder(owner, ref) {
  const value = String(ref || "").trim();
  const byOwner = owner.user ? { user: owner.user } : { guestId: owner.guestId };
  const query = mongoose.Types.ObjectId.isValid(value)
    ? { ...byOwner, _id: value }
    : { ...byOwner, orderNumber: value.toUpperCase() };
  const order = await Order.findOne(query);
  if (!order) throw new HttpError(404, "I couldn't find that order on your account");
  return order;
}

// Public order lookup for guests: needs both the order number and the email.
async function trackOrder(orderNumber, email) {
  const number = String(orderNumber || "").trim().toUpperCase();
  const contact = normalizeEmail(email);
  if (!number || !contact) throw new HttpError(400, "Order number and email are required");

  const order = await Order.findOne({ orderNumber: number }).populate("user", "email");
  const orderEmail = order && (order.email || order.user?.email);
  if (!order || normalizeEmail(orderEmail) !== contact) {
    throw new HttpError(404, "No order matches that order number and email");
  }
  return order;
}

async function cancelOrder(order, { reason = "Cancelled by customer" } = {}) {
  if (order.status !== "Processing") {
    throw new HttpError(409, `This order is already ${order.status.toLowerCase()} and can't be cancelled`);
  }
  await releaseStock(order.orderItems.map((i) => ({ productId: i.productId, quantity: i.quantity })));
  order.status = "Cancelled";
  order.cancelledAt = new Date();
  order.cancelReason = reason;
  order.statusHistory.push({ status: "Cancelled", note: reason });
  await order.save();
  return order;
}

async function updateStatus(order, status, note) {
  if (!Order.STATUSES.includes(status)) throw new HttpError(400, "Invalid order status");
  if (order.status === status) return order;
  if (order.status === "Cancelled") throw new HttpError(409, "Cancelled orders can't be changed");

  if (status === "Cancelled") {
    return cancelOrder(order, { reason: note || "Cancelled by store" });
  }

  order.status = status;
  if (status === "Delivered") {
    order.isDelivered = true;
    order.deliveredAt = new Date();
    // Cash on delivery is collected by the courier on delivery.
    if (order.paymentMethod === "COD" && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentStatus = "paid";
    }
  }
  order.statusHistory.push({ status, note });
  await order.save();
  return order;
}

function estimatedDelivery(order) {
  const { min, max } = store.shipping.estimatedDays;
  const from = new Date(order.createdAt);
  const to = new Date(order.createdAt);
  from.setDate(from.getDate() + min);
  to.setDate(to.getDate() + max);
  return { from, to };
}

module.exports = {
  quote,
  validateShippingAddress,
  placeOrder,
  getOrderForUser,
  listUserOrders,
  listGuestOrders,
  findOwnedOrder,
  trackOrder,
  cancelOrder,
  updateStatus,
  estimatedDelivery,
};
