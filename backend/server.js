const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoute=require("./routes/cartRoutes");
const checkoutRoute=require("./routes/checkoutRoutes");
const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 9000;

connectDB();

// 5. Register routes AFTER middleware
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoute);
app.use("/api/checkout", checkoutRoute);


// Test route
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});