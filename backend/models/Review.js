const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    // Optional so the demo catalogue can ship with sample reviews.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      maxLength: 100,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000,
    },
    fit: {
      type: String,
      enum: ["Runs Small", "True to Size", "Runs Large"],
    },
    sizePurchased: String,
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// One review per customer per product (sample reviews have no user).
reviewSchema.index(
  { product: 1, user: 1 },
  { unique: true, partialFilterExpression: { user: { $exists: true } } }
);

// Recalculate the cached rating and review count on the product.
reviewSchema.statics.syncProductRating = async function (productId) {
  const [stats] = await this.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  await mongoose.model("Product").findByIdAndUpdate(productId, {
    rating: stats ? Math.round(stats.avg * 10) / 10 : 0,
    numReviews: stats ? stats.count : 0,
  });
};

module.exports = mongoose.model("Review", reviewSchema);
