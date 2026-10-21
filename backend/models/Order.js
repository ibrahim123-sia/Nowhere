const mongoose = require("mongoose");
const crypto = require("crypto");

const ORDER_STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    size: String,
    color: String,
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const statusEventSchema = new mongoose.Schema(
  {
    status: { type: String, enum: ORDER_STATUSES, required: true },
    note: String,
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    // Registered customers have a user; guest orders carry guestId + email.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    guestId: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    itemsPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    paymentStatus: {
      type: String,
      default: "pending",
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "Processing",
    },
    statusHistory: [statusEventSchema],
    cancelledAt: {
      type: Date,
    },
    cancelReason: {
      type: String,
    },
    source: {
      type: String,
      enum: ["web", "assistant"],
      default: "web",
    },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ guestId: 1, createdAt: -1 });

// Short, human-friendly reference customers can quote, e.g. NW-K7Q2M9XA.
orderSchema.statics.generateOrderNumber = function () {
  return `NW-${crypto.randomBytes(6).toString("base64url").toUpperCase().replace(/[-_]/g, "X")}`;
};

orderSchema.pre("validate", function (next) {
  if (!this.orderNumber) {
    this.orderNumber = this.constructor.generateOrderNumber();
  }
  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory.push({ status: this.status, note: "Order placed" });
  }
  next();
});

orderSchema.statics.STATUSES = ORDER_STATUSES;

module.exports = mongoose.model("Order", orderSchema);
