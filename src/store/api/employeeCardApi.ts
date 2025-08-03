

import { NFCCard } from '../types/NFCCard';
import { baseApi } from './baseApi'


export const employeeCardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeCards: builder.query<NFCCard[], void>({
      query: () => '/nfc-card',
      providesTags: ["NFCCard"],
    }),
  }),
  overrideExisting: false,
})

export const { useGetEmployeeCardsQuery} = employeeCardApi;
