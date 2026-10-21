// Upgrades an existing catalogue in place without deleting anything:
//  - matches products by SKU and fills in the enriched sample data
//    (real photos, PKR prices, fit, fabric, care, highlights, stock levels)
//  - adds sample reviews to products that have none and syncs ratings
//  - gives older orders an order number and status history
//  - marks admin accounts as verified so they can log in
//
//   npm run enhance             apply the changes
//   npm run enhance -- --dry    show what would change

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product");
const Review = require("../models/Review");
const Order = require("../models/Order");
const User = require("../models/User");
const products = require("../data/products");
const { buildSampleReviews } = require("../data/reviews");

dotenv.config();

const DRY_RUN = process.argv.includes("--dry");

async function enhanceProducts() {
  let updated = 0;
  let reviewsAdded = 0;
  const missing = [];

  for (const [index, data] of products.entries()) {
    const product = await Product.findOne({ sku: data.sku });
    if (!product) {
      missing.push(data.sku);
      continue;
    }

    const { discountPrice, ...rest } = data;
    if (!DRY_RUN) {
      await Product.updateOne(
        { _id: product._id },
        discountPrice ? { $set: { ...rest, discountPrice } } : { $set: rest, $unset: { discountPrice: "" } }
      );
    }
    updated += 1;

    if ((await Review.countDocuments({ product: product._id })) === 0) {
      const reviews = buildSampleReviews(data, index).map((r) => ({ ...r, product: product._id }));
      if (!DRY_RUN) {
        await Review.insertMany(reviews);
        await Review.syncProductRating(product._id);
      }
      reviewsAdded += reviews.length;
    }
  }

  console.log(`Products updated: ${updated}, sample reviews added: ${reviewsAdded}`);
  if (missing.length) console.log(`SKUs not in the database (skipped): ${missing.join(", ")}`);
}

async function backfillOrders() {
  const orders = await Order.find({
    $or: [{ orderNumber: { $exists: false } }, { statusHistory: { $size: 0 } }],
  });
  for (const order of orders) {
    if (DRY_RUN) continue;
    if (!order.orderNumber) order.orderNumber = Order.generateOrderNumber();
    if (order.statusHistory.length === 0) {
      order.statusHistory.push({ status: "Processing", note: "Order placed", at: order.createdAt });
      if (order.status !== "Processing") {
        order.statusHistory.push({ status: order.status, at: order.deliveredAt || order.updatedAt });
      }
    }
    if (!order.itemsPrice) {
      order.itemsPrice = order.orderItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
    }
    await order.save({ validateBeforeSave: false });
  }
  console.log(`Orders backfilled: ${orders.length}`);
}

async function verifyAdmins() {
  const filter = { role: "admin", isVerified: { $ne: true } };
  const count = await User.countDocuments(filter);
  if (!DRY_RUN) await User.updateMany(filter, { isVerified: true });
  console.log(`Admin accounts verified: ${count}`);
}

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    if (DRY_RUN) console.log("Dry run - nothing will be written");
    await enhanceProducts();
    await backfillOrders();
    await verifyAdmins();
    await mongoose.disconnect();
  } catch (error) {
    console.error("Enhancement failed:", error);
    process.exit(1);
  }
})();
