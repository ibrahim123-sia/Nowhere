import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { errorPayload } from "../../utils/api";

const EMPTY_CART = { products: [], totalPrice: 0, itemCount: 0 };

//helper function to load cart from localstorage
const loadCartFromStorage = () => {
  try {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : EMPTY_CART;
  } catch {
    return EMPTY_CART;
  }
};

//helper function to save cart to localstorage
const saveCartStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// The server identifies the cart from the auth token, or the guest id for guests.
const guestIdOf = (getState) => getState().auth.guestId;

//fetch cart for guest or a user
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { data } = await api.get("/cart", { params: { guestId: guestIdOf(getState) } });
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Failed to fetch cart"));
    }
  }
);

//add an item to the cart for the user or guest
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity, size, color }, { getState, rejectWithValue }) => {
    try {
      const { data } = await api.post("/cart", {
        productId,
        quantity,
        size,
        color,
        guestId: guestIdOf(getState),
      });
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Failed to add to cart"));
    }
  }
);

//update the quantity of an item in the cart
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ productId, quantity, size, color }, { getState, rejectWithValue }) => {
    try {
      const { data } = await api.put("/cart", {
        productId,
        quantity,
        size,
        color,
        guestId: guestIdOf(getState),
      });
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Failed to update item quantity"));
    }
  }
);

//remove an item from the cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, size, color }, { getState, rejectWithValue }) => {
    try {
      const { data } = await api.delete("/cart", {
        data: { productId, size, color, guestId: guestIdOf(getState) },
      });
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Failed to remove item"));
    }
  }
);

//add the items of a past order back into the cart
export const reorder = createAsyncThunk(
  "cart/reorder",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/cart/reorder", { orderId });
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Failed to reorder"));
    }
  }
);

const setCart = (state, cart) => {
  state.loading = false;
  state.cart = cart || EMPTY_CART;
  saveCartStorage(state.cart);
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromStorage(),
    loading: false,
    error: null,
    drawerOpen: false,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = EMPTY_CART;
      localStorage.removeItem("cart");
    },
    openCartDrawer: (state) => {
      state.drawerOpen = true;
    },
    closeCartDrawer: (state) => {
      state.drawerOpen = false;
    },
  },
  extraReducers: (builder) => {
    const thunks = [fetchCart, addToCart, updateCartItemQuantity, removeFromCart];
    thunks.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => setCart(state, action.payload))
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || "Cart request failed";
        });
    });
    builder.addCase(reorder.fulfilled, (state, action) => setCart(state, action.payload.cart));
  },
});

export const { clearCart, openCartDrawer, closeCartDrawer } = cartSlice.actions;
export default cartSlice.reducer;
