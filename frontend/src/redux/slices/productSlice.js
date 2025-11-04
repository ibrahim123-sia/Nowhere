import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch products by collection and optimal filters
export const fetchProductsByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async ({
    collection,
    size,
    color,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    search,
    category,
    material,
    brand,
    limit,
  }) => {
    const query = new URLSearchParams();
    if (collection) query.append("collection", collection);
    if (size) query.append("size", size);
    if (color) query.append("color", color);
    if (gender) query.append("gender", gender);
    if (minPrice) query.append("minPrice", minPrice);
    if (maxPrice) query.append("maxPrice", maxPrice);
    if (sortBy) query.append("sortBy", sortBy);
    if (search) query.append("search", search);
    if (category) query.append("category", category);
    if (material) query.append("material", material);
    if (brand) query.append("brand", brand);
    if (limit) query.append("limit", limit);

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
    );
    
    // Log for debugging
    console.log('Products API Response:', response.data);
    
    return response.data;
  }
);

// Async thunk to fetch single product
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
    );
    
    // Log for debugging
    console.log('Product Details API Response:', response.data);
    
    return response.data;
  }
);

// Async thunk to update product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  }
);

// Async thunk to fetch similar products
export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async ({ id }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
    );
    
    // Log for debugging
    console.log('Similar Products API Response:', response.data);
    
    return response.data;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null, // store detail of single product
    similarProducts: [],
    loading: false,
    error: null,
    filters: {
      category: "",
      size: "",
      color: "",
      gender: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
      search: "",
      material: "",
      collection: "",
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: "",
        size: "",
        color: "",
        gender: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        search: "",
        material: "",
        collection: "",
      };
    },
    clearProducts: (state) => {
      state.products = [];
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearSimilarProducts: (state) => {
      state.similarProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetching products with filter
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loading = false;
        
        // Handle different response formats safely
        let productsArray = [];
        
        if (Array.isArray(action.payload)) {
          // Direct array response: []
          productsArray = action.payload;
        } else if (action.payload && Array.isArray(action.payload.products)) {
          // Object with products array: { products: [], count: 0 }
          productsArray = action.payload.products;
        } else if (action.payload && Array.isArray(action.payload.data)) {
          // Object with data array: { data: [], success: true }
          productsArray = action.payload.data;
        } else if (action.payload?.data && Array.isArray(action.payload.data.products)) {
          // Nested structure: { data: { products: [] } }
          productsArray = action.payload.data.products;
        } else {
          // Fallback - log error and use empty array
          console.error('Unexpected products response format:', action.payload);
          productsArray = [];
        }
        
        state.products = productsArray;
        state.error = null;
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to fetch products';
        state.products = [];
      })
      
      // Handle fetching single product detail
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        
        // Handle different response formats for single product
        if (action.payload && typeof action.payload === 'object') {
          if (action.payload.product) {
            // Nested: { product: {...} }
            state.selectedProduct = action.payload.product;
          } else if (action.payload.data) {
            // Nested: { data: {...} }
            state.selectedProduct = action.payload.data;
          } else {
            // Direct product object
            state.selectedProduct = action.payload;
          }
        } else {
          console.error('Unexpected product details format:', action.payload);
          state.selectedProduct = null;
        }
        
        state.error = null;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to fetch product details';
        state.selectedProduct = null;
      })
      
      // Handle updating product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        
        let updatedProduct = action.payload;
        
        // Handle different response formats
        if (action.payload?.product) {
          updatedProduct = action.payload.product;
        } else if (action.payload?.data) {
          updatedProduct = action.payload.data;
        }
        
        // Update in products array if exists
        if (updatedProduct && updatedProduct._id) {
          const index = state.products.findIndex(
            (product) => product._id === updatedProduct._id
          );
          if (index !== -1) {
            state.products[index] = updatedProduct;
          }
        }
        
        // Update selected product if it's the same product
        if (state.selectedProduct && state.selectedProduct._id === updatedProduct?._id) {
          state.selectedProduct = updatedProduct;
        }
        
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to update product';
      })
      
      // Handle fetching similar products
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        
        // Handle different response formats for similar products
        let similarProductsArray = [];
        
        if (Array.isArray(action.payload)) {
          similarProductsArray = action.payload;
        } else if (action.payload && Array.isArray(action.payload.similarProducts)) {
          similarProductsArray = action.payload.similarProducts;
        } else if (action.payload && Array.isArray(action.payload.data)) {
          similarProductsArray = action.payload.data;
        } else if (action.payload?.data && Array.isArray(action.payload.data.similarProducts)) {
          similarProductsArray = action.payload.data.similarProducts;
        } else {
          console.error('Unexpected similar products format:', action.payload);
          similarProductsArray = [];
        }
        
        state.similarProducts = similarProductsArray;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Failed to fetch similar products';
        state.similarProducts = [];
      });
  },
});

export const { 
  setFilters, 
  clearFilters, 
  clearProducts, 
  clearSelectedProduct, 
  clearSimilarProducts 
} = productsSlice.actions;

export default productsSlice.reducer;