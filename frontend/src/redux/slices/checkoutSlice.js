import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { errorPayload } from "../../utils/api";

const LAST_ORDER_KEY = "lastOrder";

const loadLastOrder = () => {
  try {
    return JSON.parse(sessionStorage.getItem(LAST_ORDER_KEY)) || null;
  } catch {
    return null;
  }
};

//server-side totals for the current cart (shipping, promo code, total)
export const fetchQuote = createAsyncThunk(
  "checkout/fetchQuote",
  async ({ couponCode, email } = {}, { getState, rejectWithValue }) => {
    try {
      const { data } = await api.post("/checkout/quote", {
        couponCode,
        email,
        guestId: getState().auth.guestId,
      });
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Could not price your cart"));
    }
  }
);

//place a cash on delivery order from the cart
export const placeOrder = createAsyncThunk(
  "checkout/placeOrder",
  async (checkoutData, { getState, rejectWithValue }) => {
    try {
      const { data } = await api.post("/checkout", {
        ...checkoutData,
        guestId: getState().auth.guestId,
      });
      sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Checkout failed"));
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    quote: null,
    quoteLoading: false,
    lastOrder: loadLastOrder(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCheckoutError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuote.pending, (state) => {
        state.quoteLoading = true;
      })
      .addCase(fetchQuote.fulfilled, (state, action) => {
        state.quoteLoading = false;
        state.quote = action.payload;
      })
      .addCase(fetchQuote.rejected, (state) => {
        state.quoteLoading = false;
      })
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.lastOrder = action.payload;
        state.quote = null;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Checkout failed";
      });
  },
});

export const { clearCheckoutError } = checkoutSlice.actions;
export default checkoutSlice.reducer;
