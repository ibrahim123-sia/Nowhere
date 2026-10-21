import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { errorPayload } from "../../utils/api";

//fetch all orders (admin only), optionally by status
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async (status, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/orders", { params: status ? { status } : {} });
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Failed to fetch orders"));
    }
  }
);

//dashboard numbers
export const fetchAdminStats = createAsyncThunk(
  "adminOrders/fetchAdminStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/orders/stats");
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Failed to load dashboard"));
    }
  }
);

//update order status
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, status, note }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/orders/${id}`, { status, note });
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Failed to update order"));
    }
  }
);

//delete order
export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/orders/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Failed to delete order"));
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    stats: null,
    loading: false,
    statsLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(fetchAdminStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload?.message;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        state.orders = state.orders.map((o) => (o._id === updated._id ? updated : o));
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((order) => order._id !== action.payload);
      });
  },
});

export default adminOrderSlice.reducer;
