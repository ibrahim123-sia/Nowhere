const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoute=require("./routes/cartRoutes");
const checkoutRoute=require("./routes/checkoutRoutes");
const orderRoute=require("./routes/orderRoutes");
const uploadRoutes=require("./routes/uploadRoutes");
const subscriberRoutes=require("./routes/subscriberRoutes");
const adminRoutes=require("./routes/adminRoutes");
const productAdminRoutes=require("./routes/productAdminRoutes");
const orderAdminRoutes=require("./routes/orderAdminRoutes");
const app = express();
app.use(express.json());
app.use(cors());



const PORT = process.env.PORT || 9000;

connectDB();

app.get("/", (req, res) => res.send("Server is Live"));

//user routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoute);
app.use("/api/checkout", checkoutRoute);
app.use("/api/orders", orderRoute);
app.use("/api/upload", uploadRoutes);
app.use("/api", subscriberRoutes);

//Admin route
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", orderAdminRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;