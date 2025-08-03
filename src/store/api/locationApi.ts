import { Location } from '../types/location';
import { baseApi } from './baseApi'


export const locationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query<Location[], void>({
      query: () => '/location',
       providesTags: ["Location"],
    }),
  }),
  overrideExisting: false,

})

export const { useGetLocationsQuery} = locationApi;
