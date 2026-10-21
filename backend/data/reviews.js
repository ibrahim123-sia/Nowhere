// Deterministic sample reviews for the demo catalogue. Each product gets
// 3-7 reviews so ratings, rating breakdowns and fit feedback have real data.

const NAMES = [
  "Ayesha K.", "Hamza R.", "Fatima S.", "Ali H.", "Zainab M.", "Usman T.",
  "Hira A.", "Bilal N.", "Mahnoor F.", "Saad Q.", "Iqra J.", "Ahmed Z.",
  "Sana W.", "Omar B.", "Maryam I.", "Danish P.", "Areeba C.", "Faizan L.",
];

const TEMPLATES = {
  5: [
    ["Absolutely love it", "The quality is far better than I expected for the price. The {material} feels premium and the colour is exactly like the photos."],
    ["Worth every rupee", "Second time ordering this. Delivery took 3 days and the fit is spot on. Already getting compliments."],
    ["My new favourite", "Wore it all day and it stayed comfortable. Washed it twice already and it still looks new."],
    ["Great fit", "Ordered my usual size and it fits perfectly. Stitching is neat and the fabric breathes well in this heat."],
  ],
  4: [
    ["Really good, minor nitpick", "Lovely {material} and a clean finish. Took a star off because the colour is a shade darker than the picture."],
    ["Solid everyday piece", "Comfortable and easy to style. Would buy again when it's on sale."],
    ["Happy with it", "Good quality and quick COD delivery. Packaging could be a bit better but the product itself is great."],
  ],
  3: [
    ["Decent but check the size", "The fabric is nice but the fit wasn't quite what I expected. Read the size guide before ordering."],
    ["Okay for the price", "Does the job. Not as soft as I hoped after the first wash, but still wearable."],
  ],
};

const FIT_NOTES = {
  "True to Size": "Fits true to size.",
  "Runs Small": "Runs a little small, consider sizing up.",
  "Runs Large": "Slightly roomy, you could size down.",
};

// Small seeded PRNG so every run produces the same reviews.
function rng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function buildSampleReviews(product, index) {
  const rand = rng(index * 7919 + 17);
  const count = 3 + Math.floor(rand() * 5);
  const reviews = [];

  for (let i = 0; i < count; i++) {
    const roll = rand();
    const rating = roll < 0.6 ? 5 : roll < 0.9 ? 4 : 3;
    const pool = TEMPLATES[rating];
    const [title, body] = pool[Math.floor(rand() * pool.length)];
    const fitRoll = rand();
    const fit =
      fitRoll < 0.72 ? "True to Size" : fitRoll < 0.88 ? "Runs Small" : "Runs Large";
    const size = product.sizes[Math.floor(rand() * product.sizes.length)];
    const daysAgo = 3 + Math.floor(rand() * 120);

    reviews.push({
      name: NAMES[(index * 3 + i * 5) % NAMES.length],
      rating,
      title,
      comment: `${body.replace("{material}", (product.material || "fabric").toLowerCase())} ${FIT_NOTES[fit]}`,
      fit,
      sizePurchased: size,
      verifiedPurchase: rand() < 0.8,
      createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
    });
  }

  return reviews;
}

module.exports = { buildSampleReviews };
