// ordersSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "http://localhost:5000";

const initialState = {
  totalOrders: null,
  totalEarnings: null,
  status: "idle",
  error: null,
};

export const fetchTotalOrders = createAsyncThunk(
  "orders/fetchTotalOrders",
  async () => {
    try {
      const response = await axios.get(`${url}/api/orders/total-orders`);
      return response.data.totalOrders;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchTotalEarnings = createAsyncThunk(
  "orders/fetchTotalEarnings",
  async () => {
    try {
      const response = await axios.get(`${url}/api/orders/total-earnings`);
      return response.data.totalEarnings;
    } catch (error) {
      throw error;
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTotalOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.totalOrders = action.payload;
      })
      .addCase(fetchTotalOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchTotalEarnings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTotalEarnings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.totalEarnings = action.payload;
      })
      .addCase(fetchTotalEarnings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default orderSlice.reducer;
