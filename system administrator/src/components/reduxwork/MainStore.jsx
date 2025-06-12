import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";
import { persistStore, persistReducer, FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage"; // default to localStorage for web

// Persist config for "user"
const persistConfig = {
  key: "user",
  version: 1,
  storage,
};

// Wrap your user reducer
const persistedUserReducer = persistReducer(persistConfig, userReducer);

// Configure store
const MainStore = configureStore({
  reducer: {
    user: persistedUserReducer, // wrap your user reducer only
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const Persistor = persistStore(MainStore);
export default MainStore;
