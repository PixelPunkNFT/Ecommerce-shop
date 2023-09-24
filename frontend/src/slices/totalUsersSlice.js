// totalUsersSlice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Includi l'URL dell'API del tuo server
const url = "http://localhost:5000"; // Sostituisci con l'URL corretto

const initialState = {
  totalUsers: null, // Inizialmente null finché non carichi i dati
  status: "idle",
};

export const fetchTotalUsers = createAsyncThunk(
  "totalUsers/fetchTotalUsers",
  async () => {
    try {
      const response = await axios.get(`${url}/api/users/count`); // Utilizza l'endpoint corretto
      return response.data.totalUsers; // Assicurati che la risposta includa "totalUsers"
    } catch (error) {
      throw error;
    }
  }
);

const totalUsers = createSlice({
  name: "totalUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTotalUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.totalUsers = action.payload;
      })
      .addCase(fetchTotalUsers.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default totalUsers.reducer;
