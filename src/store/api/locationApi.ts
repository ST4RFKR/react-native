import { Location } from '../types/location';
import { baseApi } from './baseApi'


export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query<Location[], void>({
      query: () => '/location',
    }),
  }),
  overrideExisting: false,
})

export const { useGetLocationsQuery} = userApi;
