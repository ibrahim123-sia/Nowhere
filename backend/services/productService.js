const mongoose = require("mongoose");
const Product = require("../models/Product");
const Review = require("../models/Review");
const Order = require("../models/Order");
const HttpError = require("../utils/httpError");
const { escapeRegex } = require("../utils/text");

const MAX_LIMIT = 48;

// Price the customer pays, usable inside aggregation pipelines.
const EFFECTIVE_PRICE = {
  $cond: [
    { $and: [{ $gt: ["$discountPrice", 0] }, { $lt: ["$discountPrice", "$price"] }] },
    "$discountPrice",
    "$price",
  ],
};

const list = (value) =>
  String(value || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

const anyOf = (field, values) => ({
  [field]: { $in: values.map((v) => new RegExp(`^${escapeRegex(v)}$`, "i")) },
});

const SPECIAL_COLLECTIONS = ["all", "new-arrivals", "sale", "featured"];

// Translates storefront / assistant filters into an aggregation $match.
function buildMatch(filters = {}, { includeUnpublished = false } = {}) {
  const and = [];
  if (!includeUnpublished) and.push({ isPublished: true });

  const collection = String(filters.collection || "").toLowerCase();
  if (collection && !SPECIAL_COLLECTIONS.includes(collection)) {
    const name = collection.replace(/-/g, " ");
    and.push({ collections: new RegExp(`^${escapeRegex(name)}$`, "i") });
  }
  if (collection === "sale" || filters.onSale === true || filters.onSale === "true") {
    and.push({ $expr: { $lt: [EFFECTIVE_PRICE, "$price"] } });
  }
  if (collection === "featured") and.push({ isFeatured: true });

  if (filters.category && String(filters.category).toLowerCase() !== "all") {
    and.push(anyOf("category", list(filters.category)));
  }
  if (filters.gender) {
    const genders = list(filters.gender);
    and.push(anyOf("gender", [...genders, "Unisex"]));
  }
  if (filters.color) and.push(anyOf("colors", list(filters.color)));
  if (filters.size) and.push(anyOf("sizes", list(filters.size)));
  if (filters.material) and.push(anyOf("material", list(filters.material)));
  if (filters.brand) and.push(anyOf("brand", list(filters.brand)));
  if (filters.inStock === true || filters.inStock === "true") {
    and.push({ countInStock: { $gt: 0 } });
  }

  const min = Number(filters.minPrice);
  const max = Number(filters.maxPrice);
  if (min > 0) and.push({ $expr: { $gte: [EFFECTIVE_PRICE, min] } });
  if (max > 0) and.push({ $expr: { $lte: [EFFECTIVE_PRICE, max] } });

  // Every search word must appear somewhere in the product.
  const words = String(filters.search || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 8);
  for (const word of words) {
    const rx = new RegExp(escapeRegex(word.replace(/s$/i, "")), "i");
    and.push({
      $or: [
        { name: rx },
        { description: rx },
        { category: rx },
        { brand: rx },
        { material: rx },
        { collections: rx },
        { colors: rx },
        { tags: rx },
        { fit: rx },
        { occasion: rx },
      ],
    });
  }

  return and.length ? { $and: and } : {};
}

function buildSort(sortBy, collection) {
  switch (sortBy) {
    case "priceAsc":
      return { effectivePrice: 1, _id: 1 };
    case "priceDesc":
      return { effectivePrice: -1, _id: 1 };
    case "popularity":
    case "rating":
      return { rating: -1, numReviews: -1, _id: 1 };
    case "newest":
      return { createdAt: -1, _id: 1 };
    default:
      return collection === "new-arrivals"
        ? { createdAt: -1, _id: 1 }
        : { isFeatured: -1, rating: -1, _id: 1 };
  }
}

async function searchProducts(filters = {}, options = {}) {
  const limit = Math.min(Math.max(Number(filters.limit) || 24, 1), MAX_LIMIT);
  const page = Math.max(Number(filters.page) || 1, 1);
  const match = buildMatch(filters, options);
  const sort = buildSort(filters.sortBy, String(filters.collection || "").toLowerCase());

  const [result] = await Product.aggregate([
    { $match: match },
    { $addFields: { effectivePrice: EFFECTIVE_PRICE } },
    {
      $facet: {
        products: [{ $sort: sort }, { $skip: (page - 1) * limit }, { $limit: limit }],
        total: [{ $count: "count" }],
      },
    },
  ]);

  const total = result.total[0]?.count || 0;
  return {
    products: result.products,
    total,
    page,
    pages: Math.max(Math.ceil(total / limit), 1),
  };
}

// Distinct filter values that actually exist in the published catalogue.
async function getFacets() {
  const [facets] = await Product.aggregate([
    { $match: { isPublished: true } },
    { $addFields: { effectivePrice: EFFECTIVE_PRICE } },
    {
      $group: {
        _id: null,
        categories: { $addToSet: "$category" },
        genders: { $addToSet: "$gender" },
        brands: { $addToSet: "$brand" },
        materials: { $addToSet: "$material" },
        collections: { $addToSet: "$collections" },
        colors: { $push: "$colors" },
        sizes: { $push: "$sizes" },
        minPrice: { $min: "$effectivePrice" },
        maxPrice: { $max: "$effectivePrice" },
      },
    },
  ]);

  if (!facets) {
    return { categories: [], genders: [], brands: [], materials: [], collections: [], colors: [], sizes: [], priceRange: { min: 0, max: 0 } };
  }

  const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];
  const clean = (arr) => [...new Set(arr.filter(Boolean))].sort();
  const sizes = [...new Set(facets.sizes.flat())].sort(
    (a, b) => (SIZE_ORDER.indexOf(a) + 1 || 99) - (SIZE_ORDER.indexOf(b) + 1 || 99)
  );

  return {
    categories: clean(facets.categories),
    genders: clean(facets.genders),
    brands: clean(facets.brands),
    materials: clean(facets.materials),
    collections: clean(facets.collections),
    colors: clean(facets.colors.flat()),
    sizes,
    priceRange: { min: facets.minPrice || 0, max: facets.maxPrice || 0 },
  };
}

async function getProduct(id, { includeUnpublished = false } = {}) {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new HttpError(404, "Product not found");
  const product = await Product.findById(id);
  if (!product || (!includeUnpublished && product.isPublished === false)) {
    throw new HttpError(404, "Product not found");
  }
  return product;
}

async function getSimilarProducts(id, limit = 4) {
  const product = await getProduct(id);
  const similar = await Product.find({
    _id: { $ne: product._id },
    isPublished: true,
    gender: product.gender,
    category: product.category,
  })
    .sort({ rating: -1 })
    .limit(Math.min(Number(limit) || 4, 12));
  return similar;
}

const getNewArrivals = (limit = 8) =>
  Product.find({ isPublished: true }).sort({ createdAt: -1 }).limit(Math.min(Number(limit) || 8, 24));

const getBestSellers = (limit = 8) =>
  Product.find({ isPublished: true })
    .sort({ rating: -1, numReviews: -1 })
    .limit(Math.min(Number(limit) || 8, 24));

async function suggestProducts(q, limit = 6) {
  const term = String(q || "").trim();
  if (term.length < 2) return [];
  const { products } = await searchProducts({ search: term, limit, sortBy: "popularity" });
  return products.map((p) => ({
    _id: p._id,
    name: p.name,
    image: p.images?.[0]?.url,
    price: p.price,
    discountPrice: p.discountPrice,
    category: p.category,
    gender: p.gender,
  }));
}

// ---------- Reviews ----------

async function getReviewSummary(productId) {
  const id = new mongoose.Types.ObjectId(productId);
  const [stats] = await Review.aggregate([
    { $match: { product: id } },
    {
      $facet: {
        overall: [{ $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } }],
        ratings: [{ $group: { _id: "$rating", count: { $sum: 1 } } }],
        fit: [{ $match: { fit: { $exists: true } } }, { $group: { _id: "$fit", count: { $sum: 1 } } }],
      },
    },
  ]);

  const overall = stats.overall[0];
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  stats.ratings.forEach((r) => (distribution[r._id] = r.count));
  const fit = { "Runs Small": 0, "True to Size": 0, "Runs Large": 0 };
  stats.fit.forEach((f) => (fit[f._id] = f.count));

  return {
    average: overall ? Math.round(overall.avg * 10) / 10 : 0,
    count: overall ? overall.count : 0,
    distribution,
    fit,
  };
}

async function listReviews(productId, { page = 1, limit = 5, sort = "newest" } = {}) {
  const sortMap = {
    newest: { createdAt: -1 },
    highest: { rating: -1, createdAt: -1 },
    lowest: { rating: 1, createdAt: -1 },
  };
  const perPage = Math.min(Number(limit) || 5, 20);
  const current = Math.max(Number(page) || 1, 1);
  const filter = { product: productId };
  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .sort(sortMap[sort] || sortMap.newest)
      .skip((current - 1) * perPage)
      .limit(perPage)
      .select("-user"),
    Review.countDocuments(filter),
  ]);
  return { reviews, total, page: current, pages: Math.max(Math.ceil(total / perPage), 1) };
}

async function addReview(productId, user, { rating, title, comment, fit, sizePurchased }) {
  const product = await getProduct(productId);
  const score = Number(rating);
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    throw new HttpError(400, "Rating must be a whole number from 1 to 5");
  }
  if (!comment || String(comment).trim().length < 10) {
    throw new HttpError(400, "Please write at least a few words (10+ characters)");
  }
  if (await Review.exists({ product: product._id, user: user._id })) {
    throw new HttpError(409, "You have already reviewed this product");
  }

  const purchased = await Order.exists({
    user: user._id,
    status: { $ne: "Cancelled" },
    "orderItems.productId": product._id,
  });

  const review = await Review.create({
    product: product._id,
    user: user._id,
    name: user.name,
    rating: score,
    title: title ? String(title).slice(0, 100) : undefined,
    comment: String(comment).slice(0, 1000),
    fit: ["Runs Small", "True to Size", "Runs Large"].includes(fit) ? fit : undefined,
    sizePurchased: product.sizes.includes(sizePurchased) ? sizePurchased : undefined,
    verifiedPurchase: Boolean(purchased),
  });
  await Review.syncProductRating(product._id);
  return review;
}

module.exports = {
  EFFECTIVE_PRICE,
  buildMatch,
  searchProducts,
  getFacets,
  getProduct,
  getSimilarProducts,
  getNewArrivals,
  getBestSellers,
  suggestProducts,
  getReviewSummary,
  listReviews,
  addReview,
};
