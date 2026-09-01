import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./authSlice";
import studentReducer from "./studentSlice";
import mentorReducer from "./mentorSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  student: studentReducer,
  mentor:mentorReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "student","mentor"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
