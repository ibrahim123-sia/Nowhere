const express = require("express");
const Product = require("../models/Product");
const Review = require("../models/Review");
const { protect, admin } = require("../middleware/authMiddleware");
const { validateObjectId } = require("../middleware/errorMiddleware");
const productService = require("../services/productService");

const router = express.Router();

const EDITABLE_FIELDS = [
  "name", "description", "price", "discountPrice", "countInStock", "sku",
  "category", "brand", "sizes", "colors", "collections", "material", "gender",
  "fit", "season", "occasion", "highlights", "careInstructions", "origin",
  "images", "isFeatured", "isPublished", "tags", "metaTitle", "metaDescription",
  "metaKeywords", "dimensions", "weight",
];

const toList = (value) =>
  Array.isArray(value)
    ? value.map((v) => String(v).trim()).filter(Boolean)
    : String(value || "").split(",").map((v) => v.trim()).filter(Boolean);

// Picks the editable fields from the request body and normalises their types.
function productInput(body) {
  const data = {};
  for (const field of EDITABLE_FIELDS) {
    if (body[field] !== undefined) data[field] = body[field];
  }
  ["sizes", "colors", "occasion", "highlights", "careInstructions", "tags"].forEach((f) => {
    if (data[f] !== undefined) data[f] = toList(data[f]);
  });
  ["price", "countInStock", "weight"].forEach((f) => {
    if (data[f] !== undefined && data[f] !== "") data[f] = Number(data[f]);
  });
  if (data.discountPrice !== undefined) {
    const discount = Number(data.discountPrice);
    // An empty or zero discount clears it.
    data.discountPrice = discount > 0 ? discount : undefined;
  }
  if (Array.isArray(data.images)) {
    data.images = data.images
      .filter((img) => img && img.url)
      .map((img) => ({ url: String(img.url), altText: String(img.altText || "") }));
  }
  return data;
}

function validateProduct(data) {
  if (data.price !== undefined && !(data.price >= 0)) return "Price must be a positive number";
  if (data.countInStock !== undefined && !(Number.isInteger(data.countInStock) && data.countInStock >= 0)) {
    return "Stock must be a whole number of 0 or more";
  }
  const price = data.price;
  if (data.discountPrice !== undefined && price !== undefined && data.discountPrice >= price) {
    return "Discount price must be lower than the regular price";
  }
  return null;
}

//@route Post /api/products
//@desc create a new product
//@access private/admin
router.post("/", protect, admin, async (req, res, next) => {
  try {
    const data = productInput(req.body);
    const invalid = validateProduct(data);
    if (invalid) return res.status(400).json({ message: invalid });

    const product = await Product.create({ ...data, user: req.user._id });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

//@route PUT /api/products/:id
//@desc update existing product
//@access private/admin
router.put("/:id", protect, admin, validateObjectId(), async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product Not Found" });

    const data = productInput(req.body);
    const invalid = validateProduct({ price: product.price, ...data });
    if (invalid) return res.status(400).json({ message: invalid });

    // A cleared discount arrives as undefined, which unsets the field.
    Object.assign(product, data);
    res.json(await product.save());
  } catch (error) {
    next(error);
  }
});

//@route DELETE /api/products/:id
//@desc delete product by id
//@access private/admin
router.delete("/:id", protect, admin, validateObjectId(), async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product Not Found" });

    await product.deleteOne();
    await Review.deleteMany({ product: product._id });
    res.json({ message: "Product Removed" });
  } catch (error) {
    next(error);
  }
});

//@route GET /api/products
//@desc search the catalogue with optional filters, sorting and pagination
//@access public
router.get("/", async (req, res, next) => {
  try {
    res.json(await productService.searchProducts(req.query));
  } catch (error) {
    next(error);
  }
});

//@route GET /api/products/facets
//@desc available filter values (sizes, colours, brands, price range...)
//@access public
router.get("/facets", async (req, res, next) => {
  try {
    res.json(await productService.getFacets());
  } catch (error) {
    next(error);
  }
});

//@route GET /api/products/suggest?q=
//@desc quick search suggestions for the search bar
//@access public
router.get("/suggest", async (req, res, next) => {
  try {
    res.json(await productService.suggestProducts(req.query.q));
  } catch (error) {
    next(error);
  }
});

//@route GET /api/products/best-sellers
//@desc top rated products
//@access public
router.get("/best-sellers", async (req, res, next) => {
  try {
    res.json(await productService.getBestSellers(req.query.limit));
  } catch (error) {
    next(error);
  }
});

//@route GET /api/products/new-arrivals
//@desc latest products by creation date
//@access public
router.get("/new-arrivals", async (req, res, next) => {
  try {
    res.json(await productService.getNewArrivals(req.query.limit));
  } catch (error) {
    next(error);
  }
});

//@route GET /api/products/similar/:id
//@desc products with the same gender and category
//@access public
router.get("/similar/:id", validateObjectId(), async (req, res, next) => {
  try {
    res.json(await productService.getSimilarProducts(req.params.id, req.query.limit));
  } catch (error) {
    next(error);
  }
});

//@route GET /api/products/:id/reviews
//@desc reviews for a product with rating summary
//@access public
router.get("/:id/reviews", validateObjectId(), async (req, res, next) => {
  try {
    const [summary, list] = await Promise.all([
      productService.getReviewSummary(req.params.id),
      productService.listReviews(req.params.id, req.query),
    ]);
    res.json({ summary, ...list });
  } catch (error) {
    next(error);
  }
});

//@route POST /api/products/:id/reviews
//@desc add a review (one per customer)
//@access private
router.post("/:id/reviews", protect, validateObjectId(), async (req, res, next) => {
  try {
    const review = await productService.addReview(req.params.id, req.user, req.body);
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
});

//@route GET /api/products/:id
//@desc get a single product
//@access public
router.get("/:id", validateObjectId(), async (req, res, next) => {
  try {
    res.json(await productService.getProduct(req.params.id));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
