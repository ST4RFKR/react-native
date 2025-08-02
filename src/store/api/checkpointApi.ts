import { Checkpoint } from '../types/checkpoint';
import { baseApi } from './baseApi'


export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCheckpoint: builder.mutation<void, Checkpoint>({
      query: (data) => ({
        url: '/checkpoint',
        method: 'POST',
        body: data
      }),
    }),
  })
})

export const { useCreateCheckpointMutation} = userApi;