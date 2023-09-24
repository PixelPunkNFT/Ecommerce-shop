import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import productsReducer, { productsFetch } from "./slices/productsSlice";
import cartReducer, { getTotals } from "./slices/cartSlice";
import authReducer from "./slices/authSlice";
import totalUsersReducer from "./slices/totalUsersSlice"; // Importa il tuo reducer totalUsersSlice
import ordersReducer from "./slices/ordersSlice"; // Importa il tuo reducer ordersSlice
import { productsApi } from "./slices/productsApi";
import 'bootstrap/dist/css/bootstrap.min.css';

const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    auth: authReducer,
    totalUsers: totalUsersReducer,
    orders: ordersReducer, // Aggiungi il reducer ordersSlice qui
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
});

store.dispatch(productsFetch());
store.dispatch(getTotals());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
