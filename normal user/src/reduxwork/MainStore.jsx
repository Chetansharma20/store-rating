import { configureStore } from "@reduxjs/toolkit";
import userLogin from "./UserSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";


const persistConfig = {
  key: "user",
  version: 1,
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userLogin);

const MainStore = configureStore({
  reducer: {
    user: persistedUserReducer,
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
