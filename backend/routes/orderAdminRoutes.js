const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");
const { validateObjectId } = require("../middleware/errorMiddleware");
const orderService = require("../services/orderService");

const router = express.Router();

//@route GET /api/admin/orders
//@desc GET all orders, newest first, optionally filtered by status (admin only)
//@access private/admin
router.get("/", protect, admin, async (req, res, next) => {
  try {
    const query = Order.STATUSES.includes(req.query.status) ? { status: req.query.status } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 }).populate("user", "name email");
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

//@route GET /api/admin/orders/stats
//@desc dashboard numbers: revenue, orders by status, low stock, recent orders
//@access private/admin
router.get("/stats", protect, admin, async (req, res, next) => {
  try {
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [byStatus, revenue, last30, lowStock, recentOrders, productCount] = await Promise.all([
      Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Order.aggregate([
        { $match: { status: { $ne: "Cancelled" } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: { status: { $ne: "Cancelled" }, createdAt: { $gte: since } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$totalPrice" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Product.find({ countInStock: { $lte: 5 } }).sort({ countInStock: 1 }).limit(8).select("name sku countInStock images"),
      Order.find({}).sort({ createdAt: -1 }).limit(6).populate("user", "name email"),
      Product.countDocuments(),
    ]);

    res.json({
      revenue: revenue[0]?.total || 0,
      orderCount: revenue[0]?.count || 0,
      averageOrderValue: revenue[0] ? Math.round(revenue[0].total / revenue[0].count) : 0,
      ordersByStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
      salesLast30Days: last30,
      lowStock,
      recentOrders,
      productCount,
    });
  } catch (error) {
    next(error);
  }
});

//@route PUT /api/admin/orders/:id
//@desc update order status (admin only)
//@access private/admin
router.put("/:id", protect, admin, validateObjectId(), async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await orderService.updateStatus(order, req.body.status, req.body.note);
    res.json(await order.populate("user", "name email"));
  } catch (error) {
    next(error);
  }
});

//@route DELETE /api/admin/orders/:id
//@desc delete an order (admin only); stock is returned if it never shipped
//@access private/admin
router.delete("/:id", protect, admin, validateObjectId(), async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status === "Processing") {
      await orderService.cancelOrder(order, { reason: "Deleted by store" });
    }
    await order.deleteOne();
    res.json({ message: "Order Removed" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
