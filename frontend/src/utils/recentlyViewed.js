const KEY = "recentlyViewed";
const LIMIT = 8;

export const getRecentlyViewed = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};

// Remembers a product card summary, newest first.
export const addRecentlyViewed = (product) => {
  if (!product?._id) return;
  const item = {
    _id: product._id,
    name: product.name,
    brand: product.brand,
    price: product.price,
    discountPrice: product.discountPrice,
    images: product.images?.slice(0, 2),
    rating: product.rating,
    numReviews: product.numReviews,
    colors: product.colors,
    countInStock: product.countInStock,
  };
  const list = [item, ...getRecentlyViewed().filter((p) => p._id !== product._id)].slice(0, LIMIT);
  localStorage.setItem(KEY, JSON.stringify(list));
};
