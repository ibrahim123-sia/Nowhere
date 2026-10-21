const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const HttpError = require("../utils/httpError");

const MAX_QTY_PER_LINE = 10;

// The cart owner always comes from the server: the authenticated user, or
// the guest id for shoppers who are not signed in. Client-sent user ids are
// never trusted.
function resolveOwner(user, guestId) {
  if (user) return { user: user._id };
  const id = typeof guestId === "string" ? guestId.trim() : "";
  if (!/^guest_[A-Za-z0-9_-]{4,60}$/.test(id)) {
    throw new HttpError(400, "A valid guest id is required");
  }
  return { guestId: id };
}

const findCart = (owner) => Cart.findOne(owner.user ? { user: owner.user } : { guestId: owner.guestId });

const matchOption = (options, value) =>
  options.find((o) => o.toLowerCase() === String(value || "").trim().toLowerCase());

const same = (a, b) => String(a || "").toLowerCase() === String(b || "").trim().toLowerCase();

const sameLine = (item, productId, size, color) =>
  item.productId.toString() === String(productId) && same(item.size, size) && same(item.color, color);

const recalc = (cart) => {
  cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return cart;
};

function summarize(cart) {
  if (!cart) return { products: [], totalPrice: 0, itemCount: 0 };
  const json = cart.toObject ? cart.toObject() : cart;
  return {
    ...json,
    itemCount: json.products.reduce((n, item) => n + item.quantity, 0),
  };
}

async function loadProduct(productId) {
  if (!mongoose.Types.ObjectId.isValid(productId)) throw new HttpError(404, "Product not found");
  const product = await Product.findById(productId);
  if (!product || product.isPublished === false) throw new HttpError(404, "Product not found");
  return product;
}

// Validates size / colour / quantity against the product and returns canonical values.
function validateLine(product, { size, color, quantity }) {
  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1) throw new HttpError(400, "Quantity must be at least 1");

  const canonicalSize = matchOption(product.sizes, size);
  if (!canonicalSize) {
    throw new HttpError(400, `Please choose a size: ${product.sizes.join(", ")}`);
  }
  const canonicalColor = matchOption(product.colors, color);
  if (!canonicalColor) {
    throw new HttpError(400, `Please choose a colour: ${product.colors.join(", ")}`);
  }
  if (product.countInStock <= 0) throw new HttpError(409, `${product.name} is out of stock`);

  return { size: canonicalSize, color: canonicalColor, quantity: qty };
}

function checkStock(product, quantity) {
  if (quantity > product.countInStock) {
    throw new HttpError(
      409,
      `Only ${product.countInStock} left in stock for ${product.name}`
    );
  }
  if (quantity > MAX_QTY_PER_LINE) {
    throw new HttpError(400, `You can add up to ${MAX_QTY_PER_LINE} of an item per order`);
  }
}

// Re-prices items from the live catalogue and drops products that no longer exist.
async function refresh(cart) {
  if (!cart || cart.products.length === 0) return cart;
  const ids = cart.products.map((p) => p.productId);
  const products = await Product.find({ _id: { $in: ids } });
  const byId = new Map(products.map((p) => [p._id.toString(), p]));

  let changed = false;
  cart.products = cart.products.filter((item) => {
    const product = byId.get(item.productId.toString());
    if (!product || product.isPublished === false) {
      changed = true;
      return false;
    }
    const price = product.effectivePrice();
    if (item.price !== price || item.name !== product.name) {
      item.price = price;
      item.name = product.name;
      item.image = product.images[0]?.url || item.image;
      changed = true;
    }
    return true;
  });

  if (changed) {
    recalc(cart);
    await cart.save();
  }
  return cart;
}

async function getCart(owner) {
  return refresh(await findCart(owner));
}

async function addItem(owner, { productId, size, color, quantity = 1 }) {
  const product = await loadProduct(productId);
  const line = validateLine(product, { size, color, quantity });

  let cart = await findCart(owner);
  if (!cart) cart = new Cart({ ...owner, products: [] });

  const existing = cart.products.find((p) => sameLine(p, product._id, line.size, line.color));
  const newQty = (existing ? existing.quantity : 0) + line.quantity;
  checkStock(product, newQty);

  if (existing) {
    existing.quantity = newQty;
    existing.price = product.effectivePrice();
  } else {
    cart.products.push({
      productId: product._id,
      name: product.name,
      image: product.images[0]?.url,
      price: product.effectivePrice(),
      size: line.size,
      color: line.color,
      quantity: line.quantity,
    });
  }

  recalc(cart);
  await cart.save();
  return { cart, product, line: { ...line, quantity: newQty } };
}

async function updateItem(owner, { productId, size, color, quantity }) {
  const cart = await findCart(owner);
  if (!cart) throw new HttpError(404, "Your cart is empty");

  const index = cart.products.findIndex((p) => sameLine(p, productId, size, color));
  if (index === -1) throw new HttpError(404, "That item is not in your cart");

  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 0) throw new HttpError(400, "Quantity must be 0 or more");

  if (qty === 0) {
    cart.products.splice(index, 1);
  } else {
    const product = await loadProduct(productId);
    checkStock(product, qty);
    cart.products[index].quantity = qty;
  }

  recalc(cart);
  await cart.save();
  return cart;
}

const removeItem = (owner, { productId, size, color }) =>
  updateItem(owner, { productId, size, color, quantity: 0 });

async function clearCart(owner) {
  await Cart.deleteOne(owner.user ? { user: owner.user } : { guestId: owner.guestId });
}

// Moves a guest cart into the user's cart on login, combining quantities.
async function mergeGuestCart(user, guestId) {
  const guestCart = guestId ? await Cart.findOne({ guestId }) : null;
  const userCart = await Cart.findOne({ user: user._id });

  if (!guestCart || guestCart.products.length === 0) {
    if (guestCart) await guestCart.deleteOne();
    return refresh(userCart);
  }

  if (!userCart) {
    guestCart.user = user._id;
    guestCart.guestId = undefined;
    await guestCart.save();
    return refresh(guestCart);
  }

  guestCart.products.forEach((guestItem) => {
    const existing = userCart.products.find((item) =>
      sameLine(item, guestItem.productId, guestItem.size, guestItem.color)
    );
    if (existing) {
      existing.quantity = Math.min(existing.quantity + guestItem.quantity, MAX_QTY_PER_LINE);
    } else {
      userCart.products.push(guestItem);
    }
  });

  recalc(userCart);
  await userCart.save();
  await guestCart.deleteOne();
  return refresh(userCart);
}

// Adds the items from a past order back into the cart, skipping anything
// that is no longer available.
async function reorder(owner, order) {
  const added = [];
  const skipped = [];
  for (const item of order.orderItems) {
    try {
      await addItem(owner, {
        productId: item.productId,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      });
      added.push(item.name);
    } catch (error) {
      skipped.push({ name: item.name, reason: error.message });
    }
  }
  return { cart: await findCart(owner), added, skipped };
}

module.exports = {
  MAX_QTY_PER_LINE,
  resolveOwner,
  findCart,
  getCart,
  summarize,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  mergeGuestCart,
  reorder,
};
