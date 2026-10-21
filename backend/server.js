const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoute = require("./routes/cartRoutes");
const checkoutRoute = require("./routes/checkoutRoutes");
const orderRoute = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const storeRoutes = require("./routes/storeRoutes");
const contactRoutes = require("./routes/contactRoutes");
const agentRoutes = require("./routes/agentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productAdminRoutes = require("./routes/productAdminRoutes");
const orderAdminRoutes = require("./routes/orderAdminRoutes");

const app = express();

// Behind Vercel / a proxy: needed for correct client IPs in rate limiting.
app.set("trust proxy", 1);

app.use(helmet());
app.use(express.json({ limit: "1mb" }));

// CLIENT_URL can list several origins separated by commas. When unset
// (local development) every origin is allowed.
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(null, false);
    },
  })
);

const PORT = process.env.PORT || 9000;

// Ensure DB is connected before handling any API request
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.get("/", (req, res) => res.send("Server is Live"));

//user routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoute);
app.use("/api/checkout", checkoutRoute);
app.use("/api/orders", orderRoute);
app.use("/api/upload", uploadRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api", subscriberRoutes);

//Admin route
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", orderAdminRoutes);

app.use(notFound);
app.use(errorHandler);

// Vercel imports the app; locally `node server.js` starts the listener.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
