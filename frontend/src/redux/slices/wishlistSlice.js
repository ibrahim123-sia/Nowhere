import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "wishlist";

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const save = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

// Keeps just what a product card needs so the wishlist renders offline.
const toItem = (product) => ({
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
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: load() },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.some((item) => item._id === product._id);
      state.items = exists
        ? state.items.filter((item) => item._id !== product._id)
        : [toItem(product), ...state.items];
      save(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      save(state.items);
    },
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
