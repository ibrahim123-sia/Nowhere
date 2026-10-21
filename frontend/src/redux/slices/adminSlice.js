import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { errorPayload } from "../../utils/api";

export const fetchUsers = createAsyncThunk("admin/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/admin/users");
    return data;
  } catch (error) {
    return rejectWithValue(errorPayload(error, "Failed to load users"));
  }
});

//create a user
export const addUser = createAsyncThunk(
  "admin/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/admin/users", userData);
      return data.user;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Failed to add user"));
    }
  }
);

//update user info
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, ...changes }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/users/${id}`, changes);
      return data.user;
    } catch (error) {
      return rejectWithValue(errorPayload(error, "Failed to update user"));
    }
  }
);

//delete user
export const deleteUser = createAsyncThunk("admin/deleteUser", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/admin/users/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(errorPayload(error, "Failed to delete user"));
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.users = state.users.map((u) => (u._id === action.payload._id ? action.payload : u));
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
      });
  },
});

export default adminSlice.reducer;
