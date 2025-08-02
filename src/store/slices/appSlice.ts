import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Role, User } from "../types/user";
import { Location } from "../types/location";

export enum Lang {
  EN = "en",
  RU = "ru",
}

export interface AppState {
  lang: Lang;
    isConnected: boolean
    currentLocation: Location
    currentUser: User
}

const initialState = {
  lang: Lang.EN,
  isConnected:  true,
  currentLocation: {
    id: '',
    name: '',
    address: '',
    nfcTagId: '',
    coordinates: '',
    checkpoints: []
  }, 
  currentUser: {
    id: '',
    name: '',
    email: '',
    phone: '',
    role: Role.DRIVER,
    cards: [],
  }
};



export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateAppSettings: (
      state: AppState,
      action: PayloadAction<{ lang: Lang }>
    ) => {
      const { lang } = action.payload;
      state.lang = lang;
    },
    updateConnectionStatus: (
      state: AppState,
      action: PayloadAction<boolean>
    ) => {
      state.isConnected = action.payload;
    },
    updateSelectedLocation: (
      state: AppState,
      action: PayloadAction<Location>
    ) => {
      state.currentLocation = action.payload;
    },
    updateSelectedCurrentUser: (
      state: AppState,
      action: PayloadAction<User>
    ) => {
      state.currentUser = action.payload;
    },
  },
});

export const {
    updateAppSettings,
    updateConnectionStatus,
    updateSelectedLocation
} = appSlice.actions;

export const selectAppSettings = (state: { app: AppState }): AppState => state.app;

export const appReducer = appSlice.reducer;