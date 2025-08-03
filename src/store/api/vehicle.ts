
import { Vehicle } from '../types/vehicle'
import { baseApi } from './baseApi'

export interface Location {
  id: string
  name: string
  address?: string
  nfcTagId?: string
  coordinates?: string
  checkpoints: any[]
}

export const vehicleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVehicles: builder.query<Vehicle[], void>({
      query: () => '/vehicle',
      providesTags: ["Vehicle"],
    }),
  }),
  overrideExisting: false,
})

export const { useGetVehiclesQuery} = vehicleApi;
