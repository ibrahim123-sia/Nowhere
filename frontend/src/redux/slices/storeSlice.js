import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

// Sensible defaults so the UI renders before /store/config arrives.
const DEFAULT_CONFIG = {
  shipping: { standardFee: 250, freeShippingThreshold: 5000, estimatedDays: { min: 3, max: 5 } },
  policies: {},
  sizeGuide: {},
  supportEmail: "support@nowhere.pk",
  supportPhone: "+92 300 0000000",
};

export const fetchStoreConfig = createAsyncThunk(
  "store/fetchConfig",
  async () => {
    const { data } = await api.get("/store/config");
    return data;
  },
  { condition: (_, { getState }) => !getState().store.loaded }
);

const storeSlice = createSlice({
  name: "store",
  initialState: { config: DEFAULT_CONFIG, loaded: false },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStoreConfig.fulfilled, (state, action) => {
      state.config = { ...DEFAULT_CONFIG, ...action.payload };
      state.loaded = true;
    });
  },
});

export default storeSlice.reducer;
