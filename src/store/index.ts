import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";



import {
  createTransform,
  FLUSH,
  PAUSE,
  PERSIST,
  PersistConfig,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import persistReducer from "redux-persist/es/persistReducer";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { appReducer } from "./slices/appSlice";
import { localReducer } from "./slices/localSlice";

const reducers = combineReducers({
  app: appReducer,
  local: localReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof reducers>;

const rtkQueryTransform = createTransform(
  (inboundState: any) => {
    // You can add custom transformation logic here if needed
    return undefined;
  },
  (outboundState: any) => {
    // Reset RTK Query state on rehydration
    return undefined;
  },
  { whitelist: [baseApi.reducerPath] }
);

const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage: AsyncStorage,
  transforms: [rtkQueryTransform],
  // Remove blacklist as we're using transforms now
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;