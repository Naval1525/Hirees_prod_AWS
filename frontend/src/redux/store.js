import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import jobSlice from "./jobSlice.js";
import companySlice from "./companySlice.js";
import applicationSlice from "./application.js";
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

const authPersistConfig = {
  key: "auth",
  storage,
  blacklist: ['loading', 'error'],
  // Add security measures
  serialize: true, // Ensure data is properly serialized
  timeout: 2000, // Add timeout for storage operations
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authSlice),
  job: jobSlice,
  company: companySlice,
  application: applicationSlice
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Only ignore redux-persist actions instead of disabling completely
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Add specific paths to ignore if needed
        ignoredPaths: ['auth.someSpecificPath']
      },
    }),
  devTools: process.env.NODE_ENV !== 'production', // Disable Redux DevTools in production
});

export default store;