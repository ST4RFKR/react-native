

import { NFCCard } from '../types/NFCCard';
import { baseApi } from './baseApi'


export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeCards: builder.query<NFCCard[], void>({
      query: () => '/user',
    }),
  }),
  overrideExisting: false,
})

export const { useGetEmployeeCardsQuery} = userApi;
