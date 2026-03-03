"use client";

import axiosInstance from "@/utils/axios/AxiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ========================
// ASYNC THUNKS
// ========================

// 1️⃣ Register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("token", data.token);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);

// 2️⃣ Login via Password
export const loginViaPassword = createAsyncThunk(
  "auth/loginViaPassword",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("credentials", credentials);

      const { data } = await axiosInstance.post(
        "/auth/login_password",
        credentials,
      );

      console.log("data", data);

      localStorage.setItem("token", data.user.token);

      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

// 3️⃣ Send OTP
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async (email, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/auth/send_login_otp", { email });
      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP",
      );
    }
  },
);

// 4️⃣ Login via OTP
export const loginViaOtp = createAsyncThunk(
  "auth/loginViaOtp",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/login_otp", credentials);

      localStorage.setItem("token", data.token);

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Invalid OTP");
    }
  },
);

// 5️⃣ Forgot Password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/forgot_password", {
        email,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed");
    }
  },
);

// 6️⃣ Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/auth/reset_password",
        payload,
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Reset failed");
    }
  },
);

// ========================
// INITIAL STATE
// ========================

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// ========================
// SLICE
// ========================

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN PASSWORD
      .addCase(loginViaPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginViaPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginViaPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN OTP
      .addCase(loginViaOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })

      // COMMON LOADING HANDLING
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        },
      );
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
