import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.56.1:3000/api",
    prepareHeaders: (headers, { getState }) => {
      return headers;
    },
  }),
  endpoints: () => ({}),
});