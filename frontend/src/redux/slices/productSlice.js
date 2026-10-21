import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { errorPayload } from "../../utils/api";

//fetch products by collection and optional filters
export const fetchProductsByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async (filters, { rejectWithValue }) => {
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== undefined && v !== null && v !== "")
      );
      const { data } = await api.get("/products", { params });
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Failed to load products"));
    }
  }
);

//fetch a single product
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Product not found"));
    }
  }
);

//fetch similar products (same gender and category)
export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async ({ id }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/similar/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);

//available filter values from the catalogue
export const fetchFacets = createAsyncThunk(
  "products/fetchFacets",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/products/facets");
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  },
  { condition: (_, { getState }) => !getState().products.facets }
);

//reviews + rating summary for a product
export const fetchReviews = createAsyncThunk(
  "products/fetchReviews",
  async ({ id, page = 1, sort = "newest" }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}/reviews`, { params: { page, sort } });
      return { ...data, productId: id };
    } catch (error) {
      return rejectWithValue(errorPayload(error));
    }
  }
);

export const submitReview = createAsyncThunk(
  "products/submitReview",
  async ({ id, review }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/products/${id}/reviews`, review);
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Could not post your review"));
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    total: 0,
    page: 1,
    pages: 1,
    loading: false,
    error: null,
    selectedProduct: null,
    detailLoading: false,
    detailError: null,
    similarProducts: [],
    similarLoading: false,
    facets: null,
    reviews: { productId: null, summary: null, reviews: [], total: 0, page: 1, pages: 1 },
    reviewsLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        const { products, total, page, pages } = action.payload;
        state.loading = false;
        // Page > 1 appends ("Load more"); page 1 replaces.
        state.products = page > 1 ? [...state.products, ...products] : products;
        state.total = total;
        state.page = page;
        state.pages = pages;
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload?.message;
      })
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.similarLoading = true;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.similarLoading = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state) => {
        state.similarLoading = false;
        state.similarProducts = [];
      })
      .addCase(fetchFacets.fulfilled, (state, action) => {
        state.facets = action.payload;
      })
      .addCase(fetchReviews.pending, (state) => {
        state.reviewsLoading = true;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        const { productId, page, reviews } = action.payload;
        const append = page > 1 && state.reviews.productId === productId;
        state.reviewsLoading = false;
        state.reviews = {
          ...action.payload,
          reviews: append ? [...state.reviews.reviews, ...reviews] : reviews,
        };
      })
      .addCase(fetchReviews.rejected, (state) => {
        state.reviewsLoading = false;
      });
  },
});

export default productsSlice.reducer;
