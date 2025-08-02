import { User } from '../types/user'
import { baseApi } from './baseApi'

export interface Location {
  id: string
  name: string
  address?: string
  nfcTagId?: string
  coordinates?: string
  checkpoints: any[]
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/user',
    }),
  }),
  overrideExisting: false,
})

export const { useGetUsersQuery} = userApi;
