const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");
const { validateObjectId } = require("../middleware/errorMiddleware");
const { escapeRegex } = require("../utils/text");

const router = express.Router();

//@route GET /api/admin/products
//@desc GET all products including unpublished (admin only)
//@access private/admin
router.get("/", protect, admin, async (req, res, next) => {
  try {
    const query = {};
    if (req.query.search) {
      const rx = new RegExp(escapeRegex(req.query.search), "i");
      query.$or = [{ name: rx }, { sku: rx }, { brand: rx }, { category: rx }];
    }
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
});

//@route GET /api/admin/products/:id
//@desc GET one product including unpublished (admin only)
//@access private/admin
router.get("/:id", protect, admin, validateObjectId(), async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product Not Found" });
    res.json(product);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
