import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { errorPayload } from "../../utils/api";

const getUserFromStorage = () => {
  try {
    const stored = localStorage.getItem("userInfo");
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem("userInfo");
    return null;
  }
};

const newGuestId = () =>
  `guest_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

const storedGuestId = localStorage.getItem("guestId");
const initialGuestId = /^guest_[A-Za-z0-9_-]{4,60}$/.test(storedGuestId || "")
  ? storedGuestId
  : newGuestId();
localStorage.setItem("guestId", initialGuestId);

const saveSession = ({ user, token }) => {
  if (token) localStorage.setItem("userToken", token);
  if (user) localStorage.setItem("userInfo", JSON.stringify(user));
};

// Moves the guest cart into the account right after signing in, before the
// user is set in state (which triggers the cart refresh).
const mergeGuestCart = (guestId) => api.post("/cart/merge", { guestId }).catch(() => null);

const initialState = {
  user: getUserFromStorage(),
  guestId: initialGuestId,
  loading: false,
  error: null,
  otpSent: false,
};

// Login User
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { data } = await api.post("/users/login", userData);
      saveSession(data);
      await mergeGuestCart(getState().auth.guestId);
      return data.user;
    } catch (error) {
      return rejectWithValue({
        ...errorPayload(error, "Login failed"),
        needsVerification: error.response?.data?.needsVerification,
      });
    }
  }
);

// Register user (sends OTP)
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/users/register", userData);
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Registration failed"));
    }
  }
);

// Verify OTP, then the account is active and logged in
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const { data } = await api.post("/users/verify-otp", payload);
      saveSession(data);
      await mergeGuestCart(getState().auth.guestId);
      return data.user;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Verification failed"));
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/users/forgot-password", { email });
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Failed to send OTP"));
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, otp, newPassword }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/users/reset-password", { email, otp, newPassword });
      return data;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Password reset failed"));
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (updates, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/users/profile", updates);
      saveSession(data);
      return data.user;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Could not update profile"));
    }
  }
);

const pending = (state) => {
  state.loading = true;
  state.error = null;
};
const rejected = (state, action) => {
  state.loading = false;
  state.error = action.payload?.message || "Something went wrong";
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.guestId = newGuestId();
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.setItem("guestId", state.guestId);
    },
    resetOtpState: (state) => {
      state.otpSent = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, rejected)

      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(registerUser.rejected, rejected)

      .addCase(verifyOtp.pending, pending)
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.otpSent = false;
      })
      .addCase(verifyOtp.rejected, rejected)

      .addCase(forgotPassword.pending, pending)
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, rejected)

      .addCase(resetPassword.pending, pending)
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, rejected)

      .addCase(updateProfile.pending, pending)
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, rejected);
  },
});

export const { logout, resetOtpState, clearError } = authSlice.actions;

export default authSlice.reducer;
