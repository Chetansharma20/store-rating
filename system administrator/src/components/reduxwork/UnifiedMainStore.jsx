import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import unifiedUserReducer from "./UnifiedUserSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "role", "isLogin"],
};

const persistedReducer = persistReducer(persistConfig, unifiedUserReducer);

const MainStore = configureStore({
  reducer: {
    user: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const Persistor = persistStore(MainStore);
export default MainStore;