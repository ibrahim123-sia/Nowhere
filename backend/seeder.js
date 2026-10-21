// Resets the catalogue on a fresh database: replaces all products and their
// reviews with the sample data and makes sure an admin account exists.
// Users, orders and carts are left untouched.
//
//   npm run seed
//
// Admin credentials come from ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD.
// To upgrade an existing catalogue in place instead, use `npm run enhance`.

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const Review = require("./models/Review");
const User = require("./models/User");
const products = require("./data/products");
const { buildSampleReviews } = require("./data/reviews");

dotenv.config();

async function ensureAdmin() {
  const email = (process.env.ADMIN_EMAIL || "admin@nowhere.pk").toLowerCase();
  let admin = await User.findOne({ email });
  if (!admin) {
    if (!process.env.ADMIN_PASSWORD) {
      throw new Error("Set ADMIN_PASSWORD in .env so the seeder can create the admin account");
    }
    admin = await User.create({
      name: process.env.ADMIN_NAME || "Store Admin",
      email,
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
      isVerified: true,
    });
    console.log(`Created admin ${email}`);
  } else if (admin.role !== "admin" || !admin.isVerified) {
    admin.role = "admin";
    admin.isVerified = true;
    await admin.save();
  }
  return admin;
}

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const admin = await ensureAdmin();

    await Review.deleteMany();
    await Product.deleteMany();

    const created = await Product.insertMany(products.map((p) => ({ ...p, user: admin._id })));

    for (const [index, product] of created.entries()) {
      const reviews = buildSampleReviews(product, index).map((r) => ({ ...r, product: product._id }));
      await Review.insertMany(reviews);
      await Review.syncProductRating(product._id);
    }

    console.log(`Seeded ${created.length} products with sample reviews`);
    process.exit();
  } catch (error) {
    console.error("Error seeding the data", error);
    process.exit(1);
  }
};

seedData();
