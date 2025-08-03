import { createSlice, PayloadAction } from '@reduxjs/toolkit';


import { User } from '../types/user';
import { NFCCard } from '../types/NFCCard';
import { Vehicle } from '../types/vehicle';
import { Location } from '../types/location';
import { Checkpoint } from '../types/checkpoint';
import { CheckpointPhoto } from '../types/checkpointPhoto';


interface LocalState {
  locations: Location[];
  employeeCards: NFCCard[];
  users: User[];
  vehicle: Vehicle[];
  checkpoints: Checkpoint[] ;
  checkpointPhotos: CheckpointPhoto[];
  lastSync: string | null;
}

const initialState: LocalState = {
  locations: [],
  employeeCards: [],
  users: [],
  vehicle: [],
  checkpoints: [],
  checkpointPhotos: [],
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
      setCheckpoints: (state, action: PayloadAction<Checkpoint[]>) => {
    state.checkpoints = action.payload;
  },
  addCheckpoint: (state, action: PayloadAction<Checkpoint & {id: string}>) => {
      // ИСПРАВЛЕНИЕ: инициализируем массив если он undefined (redux-persist)
      if (!state.checkpoints) {
        state.checkpoints = [];
      }
      state.checkpoints.push(action.payload);
      console.log('Checkpoint added to Redux:', action.payload);
      console.log('Total checkpoints:', state.checkpoints.length);
    },
  setCheckpointPhotos: (state, action: PayloadAction<CheckpointPhoto[]>) => {
    state.checkpointPhotos = action.payload;
  },
    addCheckpointPhoto: (state, action: PayloadAction<CheckpointPhoto>) => {
      // ИСПРАВЛЕНИЕ: инициализируем массив если он undefined (redux-persist)
      if (!state.checkpointPhotos) {
        state.checkpointPhotos = [];
      }
      state.checkpointPhotos.push(action.payload);
      console.log('CheckpointPhoto added to Redux:', action.payload);
      console.log('Total checkpointPhotos:', state.checkpointPhotos.length);
    },
    setLastSync: (state, action: PayloadAction<string>) => {
      state.lastSync = action.payload;
    },
    clearLocalCheckpoints: (state) => {
      state.checkpoints = [];
    },
    clearLocalCheckpointsPhotos: (state) => {
      state.checkpointPhotos = [];
    },
    clearLocalData: () => initialState,
  },
   extraReducers: (builder) => {
    builder.addCase('persist/REHYDRATE', (state, action: any) => {
      console.log('Redux-persist REHYDRATE:', action.payload);
      // Убеждаемся что массивы инициализированы после восстановления
      if (action.payload?.local) {
        const local = action.payload.local;
        if (!local.checkpoints) local.checkpoints = [];
        if (!local.checkpointPhotos) local.checkpointPhotos = [];
        if (!local.locations) local.locations = [];
        if (!local.employeeCards) local.employeeCards = [];
        if (!local.users) local.users = [];
        if (!local.vehicle) local.vehicle = [];
      }
    });
  },
});

export const { 
  setLocations, 
  setEmployeeCards, 
  setUsers, 
  setVehicles,
  setCheckpoints,
  addCheckpoint,
  setCheckpointPhotos,
  addCheckpointPhoto,
  setLastSync,
  clearLocalCheckpoints,
  clearLocalCheckpointsPhotos,
  clearLocalData
} = localSlice.actions;

export const localReducer = localSlice.reducer;