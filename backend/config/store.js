// Single source of truth for store-wide settings. Checkout pricing, the
// storefront and the shopping assistant all read from here.

const store = {
  name: "Nowhere",
  currency: "PKR",
  supportEmail: "support@nowhere.pk",
  supportPhone: "+92 300 0000000",
  supportHours: "Mon-Sat, 10AM - 7PM PKT",

  shipping: {
    standardFee: 250,
    freeShippingThreshold: 5000,
    estimatedDays: { min: 3, max: 5 },
    regions: "All major cities in Pakistan",
  },

  paymentMethods: [{ code: "COD", label: "Cash on Delivery" }],

  // Public promo codes. `minSubtotal` is in PKR.
  coupons: {
    WELCOME10: {
      type: "percent",
      value: 10,
      minSubtotal: 0,
      description: "10% off for newsletter subscribers",
    },
    NOWHERE500: {
      type: "flat",
      value: 500,
      minSubtotal: 6000,
      description: "Rs. 500 off orders above Rs. 6,000",
    },
  },

  policies: {
    shipping:
      "Standard delivery takes 3-5 working days across Pakistan. Shipping is Rs. 250, and free on orders of Rs. 5,000 or more.",
    returns:
      "Unworn items with tags can be returned or exchanged within 30 days of delivery. Sale items can be exchanged but not refunded.",
    payment:
      "We currently accept Cash on Delivery (COD). You pay the courier when your order arrives.",
    cancellation:
      "Orders can be cancelled while they are still Processing. Once an order has shipped it can no longer be cancelled, but it can be returned.",
    sizing:
      "Most styles fit true to size. Check the size guide on each product page, and the fit notes in customer reviews.",
    care: "Care instructions are listed on each product. As a rule, wash cold, inside out, and avoid tumble drying knits.",
  },

  sizeGuide: {
    "Top Wear": {
      unit: "inches",
      columns: ["Size", "Chest", "Waist", "Length"],
      rows: [
        ["XS", "33-35", "27-29", "26"],
        ["S", "35-37", "29-31", "27"],
        ["M", "38-40", "32-34", "28"],
        ["L", "41-43", "35-37", "29"],
        ["XL", "44-46", "38-40", "30"],
        ["XXL", "47-49", "41-43", "31"],
      ],
    },
    "Bottom Wear": {
      unit: "inches",
      columns: ["Size", "Waist", "Hip", "Inseam"],
      rows: [
        ["XS", "24-26", "33-35", "30"],
        ["S", "27-29", "36-38", "30.5"],
        ["M", "30-32", "39-41", "31"],
        ["L", "33-35", "42-44", "31.5"],
        ["XL", "36-38", "45-47", "32"],
        ["XXL", "39-41", "48-50", "32"],
      ],
    },
  },
};

module.exports = store;
