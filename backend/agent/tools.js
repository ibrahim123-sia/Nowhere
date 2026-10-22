// Tools the shopping assistant can call. Every handler acts as the shopper
// making the request (ctx.owner comes from the JWT / guest id, never from the
// model), and order placement / cancellation go through a two-step
// prepare -> confirm flow enforced here on the server.

const store = require("../config/store");
const Review = require("../models/Review");
const productService = require("../services/productService");
const cartService = require("../services/cartService");
const orderService = require("../services/orderService");
const { sendOrderConfirmation } = require("../utils/mailer");
const { productPath } = require("../utils/text");

const PENDING_TTL_MS = 15 * 60 * 1000;

const rs = (n) => `Rs. ${Math.round(Number(n) || 0).toLocaleString("en-US")}`;

const shortDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

// ---------- Shapers (keep tool results small for free-tier token limits) ----------

function productCard(p) {
  const price = p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price;
  return {
    id: String(p._id),
    name: p.name,
    brand: p.brand,
    gender: p.gender,
    category: p.category,
    price,
    originalPrice: price < p.price ? p.price : undefined,
    rating: p.rating,
    reviews: p.numReviews,
    colors: p.colors,
    sizes: p.sizes,
    inStock: p.countInStock > 0,
    onlyLeft: p.countInStock > 0 && p.countInStock <= 5 ? p.countInStock : undefined,
    stock: p.countInStock,
    image: p.images?.[0]?.url,
    url: productPath(p),
  };
}

// The model only needs inStock / onlyLeft; image, url and stock are for the chat window.
const modelCard = ({ image, url, stock, ...rest }) => rest;

function cartView(cart, totals) {
  const summary = cartService.summarize(cart);
  return {
    items: summary.products.map((i) => ({
      productId: String(i.productId),
      name: i.name,
      size: i.size,
      color: i.color,
      quantity: i.quantity,
      unitPrice: i.price,
      lineTotal: i.price * i.quantity,
    })),
    itemCount: summary.itemCount,
    subtotal: totals.itemsPrice,
    shipping: totals.shippingPrice,
    total: totals.totalPrice,
    freeShippingRemaining: totals.freeShippingRemaining,
  };
}

function orderView(order) {
  const eta = orderService.estimatedDelivery(order);
  return {
    orderNumber: order.orderNumber,
    status: order.status,
    placedOn: order.createdAt?.toISOString().slice(0, 10),
    estimatedDelivery:
      order.status === "Delivered" || order.status === "Cancelled"
        ? undefined
        : `${shortDate(eta.from)} - ${shortDate(eta.to)}`,
    items: order.orderItems.map((i) => `${i.quantity} x ${i.name} (${i.size}, ${i.color})`),
    total: order.totalPrice,
    paymentMethod: order.paymentMethod,
    city: order.shippingAddress?.city,
    timeline: (order.statusHistory || []).map((s) => `${s.status} on ${shortDate(s.at)}`),
    canCancel: order.status === "Processing",
  };
}

async function currentCartView(ctx) {
  const cart = await cartService.getCart(ctx.owner);
  const totals = await orderService.quote(cart);
  return cartView(cart, totals);
}

// Shows the shopper their bag (with quantity / remove / checkout buttons)
// under the reply. The chat window reads the live cart; this is a snapshot.
function showCart(ctx, view) {
  ctx.emit("cart_view", { itemCount: view.itemCount, total: view.total });
  return view;
}

// Identifies the exact cart contents an order summary was priced from.
const cartSignature = (cart) =>
  (cart?.products || [])
    .map((i) => `${i.productId}:${i.size}:${i.color}:${i.quantity}:${i.price}`)
    .sort()
    .join("|");

// ---------- Tool definitions ----------

const definitions = [
  {
    name: "search_products",
    description:
      "Search the Nowhere catalogue. Use for any request to find, browse or recommend clothes. Results are also shown to the shopper as product cards.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "Keywords, e.g. 'white linen shirt' or 'joggers'" },
        gender: { type: "string", enum: ["Men", "Women"] },
        category: { type: "string", enum: ["Top Wear", "Bottom Wear"] },
        color: { type: "string" },
        size: { type: "string", enum: ["XS", "S", "M", "L", "XL", "XXL"] },
        minPrice: { type: "number", description: "PKR" },
        maxPrice: { type: "number", description: "PKR" },
        onSale: { type: "boolean" },
        sortBy: { type: "string", enum: ["popularity", "priceAsc", "priceDesc", "newest"] },
        limit: { type: "integer", minimum: 1, maximum: 8 },
      },
    },
  },
  {
    name: "get_product_details",
    description:
      "Full details for one product: description, fit, fabric, care, sizes, colours, stock and a review summary including fit feedback.",
    parameters: {
      type: "object",
      properties: { productId: { type: "string" } },
      required: ["productId"],
    },
  },
  {
    name: "get_cart",
    description: "Show the shopper's current cart with totals and shipping.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "add_to_cart",
    description:
      "Add a product to the cart. Size and colour must be one of the product's options; ask the shopper if they haven't chosen.",
    parameters: {
      type: "object",
      properties: {
        productId: { type: "string" },
        size: { type: "string" },
        color: { type: "string" },
        quantity: { type: "integer", minimum: 1, maximum: 10 },
      },
      required: ["productId", "size", "color"],
    },
  },
  {
    name: "update_cart_item",
    description: "Change the quantity of a cart item. Quantity 0 removes it.",
    parameters: {
      type: "object",
      properties: {
        productId: { type: "string" },
        size: { type: "string" },
        color: { type: "string" },
        quantity: { type: "integer", minimum: 0, maximum: 10 },
      },
      required: ["productId", "size", "color", "quantity"],
    },
  },
  {
    name: "get_store_info",
    description: "Store policies and help: shipping, returns, payment, cancellation, sizing, care, contact, size_guide, promotions.",
    parameters: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          enum: ["shipping", "returns", "payment", "cancellation", "sizing", "care", "contact", "size_guide", "promotions"],
        },
      },
      required: ["topic"],
    },
  },
  {
    name: "get_checkout_details",
    description:
      "Who is checking out: whether the shopper is signed in, their email and any saved delivery address. Call before collecting delivery details.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "prepare_checkout",
    description:
      "Validate delivery details and price the cart for a Cash on Delivery order. This does NOT place the order: it shows the shopper a summary to confirm. Set useSavedAddress to true to use the saved address.",
    parameters: {
      type: "object",
      properties: {
        useSavedAddress: { type: "boolean" },
        fullName: { type: "string" },
        address: { type: "string", description: "House / street / area" },
        city: { type: "string" },
        postalCode: { type: "string" },
        phone: { type: "string" },
        email: { type: "string", description: "Required for guests only" },
        couponCode: { type: "string" },
      },
    },
  },
  {
    name: "prepare_cancellation",
    description:
      "Start cancelling one of the shopper's orders (only possible while it is Processing). Shows a confirmation; it does NOT cancel yet.",
    parameters: {
      type: "object",
      properties: {
        orderNumber: { type: "string" },
        reason: { type: "string" },
      },
      required: ["orderNumber"],
    },
  },
  {
    name: "confirm_pending_action",
    description:
      "Carry out the order or cancellation prepared earlier. Only call this after the shopper has clearly said yes in a new message.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "discard_pending_action",
    description: "Drop a prepared order or cancellation when the shopper says no or wants to change something.",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "track_order",
    description:
      "Order status and delivery timeline. Without an order number, lists the shopper's recent orders. Guests looking up an order from another device must give the order number and email.",
    parameters: {
      type: "object",
      properties: {
        orderNumber: { type: "string", description: "e.g. NW-K7Q2M9XA" },
        email: { type: "string" },
      },
    },
  },
  {
    name: "reorder",
    description: "Add all available items from one of the shopper's past orders back into the cart.",
    parameters: {
      type: "object",
      properties: { orderNumber: { type: "string" } },
      required: ["orderNumber"],
    },
  },
];

// ---------- Handlers ----------

const handlers = {
  async search_products(args, ctx) {
    const { products, total } = await productService.searchProducts({
      search: args.query,
      gender: args.gender,
      category: args.category,
      color: args.color,
      size: args.size,
      minPrice: args.minPrice,
      maxPrice: args.maxPrice,
      onSale: args.onSale,
      sortBy: args.sortBy || "popularity",
      limit: Math.min(Number(args.limit) || 6, 8),
    });
    const cards = products.map(productCard);
    if (cards.length) ctx.emit("products", { cards });
    return {
      total,
      products: cards.map(modelCard),
      note: cards.length ? undefined : "No matches. Suggest loosening a filter or a similar style.",
    };
  },

  async get_product_details({ productId }, ctx) {
    const product = await productService.getProduct(productId);
    const [summary, reviews] = await Promise.all([
      productService.getReviewSummary(product._id),
      Review.find({ product: product._id }).sort({ createdAt: -1 }).limit(3).select("rating title comment fit"),
    ]);
    ctx.emit("products", { cards: [productCard(product)] });
    return {
      ...modelCard(productCard(product)),
      description: product.description,
      material: product.material,
      fit: product.fit,
      highlights: product.highlights,
      care: product.careInstructions,
      occasion: product.occasion,
      stock: product.countInStock,
      reviewSummary: {
        average: summary.average,
        count: summary.count,
        fitFeedback: summary.fit,
      },
      recentReviews: reviews.map((r) => `${r.rating}/5 ${r.title || ""}: ${r.comment}`.slice(0, 220)),
    };
  },

  async get_cart(args, ctx) {
    return showCart(ctx, await currentCartView(ctx));
  },

  async add_to_cart(args, ctx) {
    const { product, line } = await cartService.addItem(ctx.owner, {
      productId: args.productId,
      size: args.size,
      color: args.color,
      quantity: args.quantity || 1,
    });
    ctx.emit("cart", { action: "added", name: product.name });
    return {
      added: `${product.name} (${line.size}, ${line.color})`,
      quantityInCart: line.quantity,
      cart: showCart(ctx, await currentCartView(ctx)),
    };
  },

  async update_cart_item(args, ctx) {
    await cartService.updateItem(ctx.owner, args);
    ctx.emit("cart", { action: "updated" });
    return { updated: true, cart: showCart(ctx, await currentCartView(ctx)) };
  },

  async get_store_info({ topic }) {
    switch (topic) {
      case "contact":
        return { email: store.supportEmail, phone: store.supportPhone, hours: store.supportHours };
      case "size_guide":
        return store.sizeGuide;
      case "promotions":
        return Object.entries(store.coupons).map(([code, c]) => ({ code, details: c.description }));
      default:
        return { [topic]: store.policies[topic] || "No information on that topic." };
    }
  },

  async get_checkout_details(args, ctx) {
    if (!ctx.user) {
      return {
        signedIn: false,
        note: "Guest checkout: ask for full name, address, city, postal code, phone and email.",
      };
    }
    const saved = ctx.user.shippingAddress;
    return {
      signedIn: true,
      name: ctx.user.name,
      email: ctx.user.email,
      savedAddress: saved?.address ? saved : null,
    };
  },

  async prepare_checkout(args, ctx) {
    const cart = await cartService.getCart(ctx.owner);
    if (!cart || cart.products.length === 0) {
      return { error: "The cart is empty. Help the shopper add items first." };
    }

    const saved = ctx.user?.shippingAddress?.address ? ctx.user.shippingAddress : null;
    const source = {
      fullName: ctx.user?.name,
      ...(args.useSavedAddress && saved ? pickAddress(saved) : {}),
      ...pickAddress(args),
    };
    const shippingAddress = orderService.validateShippingAddress(source);
    const email = ctx.user ? ctx.user.email : String(args.email || "").trim().toLowerCase();
    if (!ctx.user && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: "A valid email is needed for guest orders (for the confirmation and tracking)." };
    }

    const totals = await orderService.quote(cart, { couponCode: args.couponCode, email });
    const summary = {
      items: cart.products.map((i) => ({
        name: i.name,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        lineTotal: i.price * i.quantity,
        image: i.image,
      })),
      itemsPrice: totals.itemsPrice,
      shippingPrice: totals.shippingPrice,
      discount: totals.discount,
      couponCode: totals.couponCode,
      totalPrice: totals.totalPrice,
      paymentMethod: "Cash on Delivery",
      shippingAddress,
      email,
    };

    ctx.session.pendingAction = {
      type: "place_order",
      turn: ctx.session.turn,
      createdAt: Date.now(),
      payload: { shippingAddress, email, couponCode: totals.couponCode || undefined, cart: cartSignature(cart) },
      summary,
    };
    ctx.emit("confirm", { kind: "order", summary });

    return {
      status: "awaiting_confirmation",
      total: totals.totalPrice,
      shipping: totals.shippingPrice,
      couponNote: totals.couponError || undefined,
      instruction:
        "The shopper now sees an order summary with Confirm / Cancel buttons. Briefly recap the total and ask them to confirm. Do not call confirm_pending_action until they reply yes.",
    };
  },

  async prepare_cancellation({ orderNumber, reason }, ctx) {
    const order = await orderService.findOwnedOrder(ctx.owner, orderNumber);
    if (order.status !== "Processing") {
      return { error: `Order ${order.orderNumber} is ${order.status} and can no longer be cancelled.` };
    }
    ctx.session.pendingAction = {
      type: "cancel_order",
      turn: ctx.session.turn,
      createdAt: Date.now(),
      payload: { orderId: String(order._id), reason: reason ? String(reason).slice(0, 200) : undefined },
      summary: { orderNumber: order.orderNumber, totalPrice: order.totalPrice, items: order.orderItems.length },
    };
    ctx.emit("confirm", { kind: "cancel", summary: ctx.session.pendingAction.summary });
    return {
      status: "awaiting_confirmation",
      instruction: "Ask the shopper to confirm the cancellation. Do not call confirm_pending_action until they reply yes.",
    };
  },

  async confirm_pending_action(args, ctx) {
    return executePendingAction(ctx);
  },

  async discard_pending_action(args, ctx) {
    const had = Boolean(ctx.session.pendingAction);
    ctx.session.pendingAction = null;
    ctx.emit("confirm_cleared", {});
    return { discarded: had };
  },

  async track_order({ orderNumber, email }, ctx) {
    if (!orderNumber) {
      const orders = ctx.user
        ? await orderService.listUserOrders(ctx.user, 5)
        : await orderService.listGuestOrders(ctx.guestId, 5);
      return orders.length
        ? { recentOrders: orders.map(orderView) }
        : { recentOrders: [], note: "No orders found for this shopper on this device." };
    }
    try {
      return orderView(await orderService.findOwnedOrder(ctx.owner, orderNumber));
    } catch {
      if (!email) {
        return { error: "That order isn't on this account. Ask for the email used for the order to look it up." };
      }
      return orderView(await orderService.trackOrder(orderNumber, email));
    }
  },

  async reorder({ orderNumber }, ctx) {
    const order = await orderService.findOwnedOrder(ctx.owner, orderNumber);
    const { added, skipped } = await cartService.reorder(ctx.owner, order);
    if (added.length) ctx.emit("cart", { action: "reordered" });
    return { added, skipped, cart: showCart(ctx, await currentCartView(ctx)) };
  },
};

const ADDRESS_FIELDS = ["fullName", "address", "city", "postalCode", "country", "phone"];

// Copies only non-empty address fields (works for plain objects and Mongoose paths).
const pickAddress = (source = {}) =>
  Object.fromEntries(ADDRESS_FIELDS.map((f) => [f, source[f]]).filter(([, v]) => v));

// Runs the prepared order / cancellation. Used by the confirm tool and by
// the Confirm button in the chat window (which skips the model entirely).
async function executePendingAction(ctx) {
  const pending = ctx.session.pendingAction;
  if (!pending) return { error: "There is nothing waiting for confirmation." };

  if (Date.now() - pending.createdAt > PENDING_TTL_MS) {
    ctx.session.pendingAction = null;
    return { error: "That confirmation expired. Prepare it again." };
  }
  // The shopper must confirm in a later message than the one that prepared it.
  if (pending.turn >= ctx.session.turn) {
    return {
      error: "Not confirmed yet. Show the summary and wait for the shopper to reply yes in their next message.",
    };
  }

  ctx.session.pendingAction = null;

  if (pending.type === "place_order") {
    // The shopper can change the bag from the chat or the site after seeing
    // the summary; never place an order for a total they haven't seen.
    const cart = await cartService.getCart(ctx.owner);
    if (pending.payload.cart && cartSignature(cart) !== pending.payload.cart) {
      return { error: "Your bag changed after the order summary was shown, so I haven't placed the order. Ask me to check out again to see the updated total." };
    }
    const order = await orderService.placeOrder({
      owner: ctx.owner,
      user: ctx.user,
      email: pending.payload.email,
      shippingAddress: pending.payload.shippingAddress,
      couponCode: pending.payload.couponCode,
      paymentMethod: "COD",
      source: "assistant",
    });
    sendOrderConfirmation(order).catch((err) => console.error("Order email failed:", err.message));
    ctx.emit("cart", { action: "cleared" });
    ctx.emit("order", {
      orderId: String(order._id),
      orderNumber: order.orderNumber,
      totalPrice: order.totalPrice,
      email: order.email,
      isGuest: !ctx.user,
    });
    return {
      placed: true,
      orderNumber: order.orderNumber,
      total: rs(order.totalPrice),
      email: order.email,
      estimatedDelivery: orderView(order).estimatedDelivery,
    };
  }

  if (pending.type === "cancel_order") {
    const order = await orderService.findOwnedOrder(ctx.owner, pending.payload.orderId);
    await orderService.cancelOrder(order, { reason: pending.payload.reason || "Cancelled via assistant" });
    ctx.emit("order_cancelled", { orderNumber: order.orderNumber });
    return { cancelled: true, orderNumber: order.orderNumber };
  }

  return { error: "Unknown action" };
}

// Human-readable status shown in the chat while a tool runs.
const LABELS = {
  search_products: "Searching the catalogue",
  get_product_details: "Checking product details",
  get_cart: "Checking your cart",
  add_to_cart: "Adding to your cart",
  update_cart_item: "Updating your cart",
  get_store_info: "Looking up store info",
  get_checkout_details: "Getting your details",
  prepare_checkout: "Preparing your order summary",
  prepare_cancellation: "Preparing cancellation",
  confirm_pending_action: "Confirming",
  discard_pending_action: "Cancelling that",
  track_order: "Tracking your order",
  reorder: "Adding your past order to the cart",
};

const toolSchemas = definitions.map((d) => ({ type: "function", function: d }));

module.exports = { toolSchemas, handlers, LABELS, executePendingAction, productCard };
