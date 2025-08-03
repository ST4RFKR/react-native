import { Checkpoint } from '../types/checkpoint';
import { baseApi } from './baseApi'


export const checkpointApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCheckpoint: builder.query<Checkpoint[], { locationId: string, limit: number }>({
      query: ({ locationId, limit}) => `/checkpoint?locationId=${locationId}&limit=${limit}`,
      providesTags: ["Checkpoint"],
    }),
    createCheckpoint: builder.mutation<void, Checkpoint>({
      query: (data) => ({
        url: '/checkpoint',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ["Checkpoint"],
    }),
  })
})

export const {useGetCheckpointQuery, useCreateCheckpointMutation} = checkpointApi;