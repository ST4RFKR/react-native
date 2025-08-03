
import { CheckpointPhoto } from '../types/checkpointPhoto';
import { baseApi } from './baseApi'


export const checkpointPhotoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCheckpointPhoto: builder.mutation<void, CheckpointPhoto>({
      query: (data) => ({
        url: '/checkpoint-photo',
        method: 'POST',
        body: data
      }),
    }),
  })
})

export const { useCreateCheckpointPhotoMutation} = checkpointPhotoApi;