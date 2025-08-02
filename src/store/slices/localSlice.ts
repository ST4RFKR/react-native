import { createSlice, PayloadAction } from '@reduxjs/toolkit';


import { User } from '../types/user';
import { NFCCard } from '../types/NFCCard';
import { Vehicle } from '../types/vehicle';
import { Location } from '../types/location';


interface LocalState {
  locations: Location[];
  employeeCards: NFCCard[];
  users: User[];
  vehicle: Vehicle[]
  lastSync: string | null;
}

const initialState: LocalState = {
  locations: [],
  employeeCards: [],
  users: [],
  vehicle: [],
  lastSync: null,

};

export const localSlice = createSlice({
  name: 'local',
  initialState,
  reducers: {
    setLocations: (state, action: PayloadAction<Location[]>) => {
      state.locations = action.payload;
    },
    setEmployeeCards: (state, action: PayloadAction<NFCCard[]>) => {
      state.employeeCards = action.payload;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
        setVehicles: (state, action: PayloadAction<Vehicle[]>) => {
      state.vehicle = action.payload;
    },
    setLastSync: (state, action: PayloadAction<string>) => {
      state.lastSync = action.payload;
    },
    clearLocalData: () => initialState,
  },
});

export const { 
  setLocations, 
  setEmployeeCards, 
  setUsers, 
  setVehicles,
  setLastSync,
  clearLocalData
} = localSlice.actions;

export const localReducer = localSlice.reducer;