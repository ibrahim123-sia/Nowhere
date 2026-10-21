import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { errorPayload } from "../../utils/api";

//fetch all products including unpublished ones
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchAdminProducts",
  async (search, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/products", { params: search ? { search } : {} });
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Failed to load products"));
    }
  }
);

//fetch one product for the edit form
export const fetchAdminProduct = createAsyncThunk(
  "adminProducts/fetchAdminProduct",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/admin/products/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Product not found"));
    }
  }
);

//create a new product
export const createProduct = createAsyncThunk(
  "adminProducts/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/products", productData);
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Failed to create product"));
    }
  }
);

//update an existing product
export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/products/${id}`, productData);
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Failed to update product"));
    }
  }
);

//delete a product
export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Failed to delete product"));
    }
  }
);

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: [],
    current: null,
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(fetchAdminProduct.pending, (state) => {
        state.loading = true;
        state.current = null;
        state.error = null;
      })
      .addCase(fetchAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(createProduct.pending, (state) => {
        state.saving = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.saving = false;
        state.products.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state) => {
        state.saving = false;
      })
      .addCase(updateProduct.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.saving = false;
        state.current = action.payload;
        state.products = state.products.map((p) => (p._id === action.payload._id ? action.payload : p));
      })
      .addCase(updateProduct.rejected, (state) => {
        state.saving = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => product._id !== action.payload);
      });
  },
});

export default adminProductSlice.reducer;
