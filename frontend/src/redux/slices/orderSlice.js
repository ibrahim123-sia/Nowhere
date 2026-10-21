import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { errorPayload } from "../../utils/api";

//Async thunk to fetch user orders
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/orders/my-orders");
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Failed to fetch orders"));
    }
  }
);

//async thunk to fetch order details by id
export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Failed to fetch order details"));
    }
  }
);

//cancel an order that hasn't shipped yet
export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async ({ orderId, reason }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/cancel`, { reason });
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Could not cancel the order"));
    }
  }
);

//look up an order with order number + email (guests)
export const trackOrder = createAsyncThunk(
  "orders/trackOrder",
  async ({ orderNumber, email }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/orders/track", { orderNumber, email });
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Order not found"));
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    orderDetails: null,
    trackedOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearTrackedOrder: (state) => {
      state.trackedOrder = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Request failed";
    };
    builder
      .addCase(fetchUserOrders.pending, pending)
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, rejected)
      .addCase(fetchOrderDetails.pending, (state) => {
        pending(state);
        state.orderDetails = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, rejected)
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const updated = action.payload;
        if (state.orderDetails?._id === updated._id) {
          state.orderDetails = { ...state.orderDetails, ...updated };
        }
        state.orders = state.orders.map((o) => (o._id === updated._id ? updated : o));
      })
      .addCase(trackOrder.pending, (state) => {
        pending(state);
        state.trackedOrder = null;
      })
      .addCase(trackOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.trackedOrder = action.payload;
      })
      .addCase(trackOrder.rejected, rejected);
  },
});

export const { clearTrackedOrder } = orderSlice.actions;
export default orderSlice.reducer;
