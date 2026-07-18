import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const SvcTkn_ML_API_KEY = process.env.SvcTkn_ML_API_KEY;
const API_BASE_URL = process.env.REACT_APP_API_URL

const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        const svcToken = SvcTkn_ML_API_KEY
        headers.set("Svc-Tkn", `Bearer ${svcToken}`)
        return headers;
    },
});

export const mlApiSlice = createApi({
    reducerPath: 'ml-api',
    baseQuery: baseQuery,
    tagTypes: ['User', 'Opportunity', 'Bubble'],
    keepUnusedDataFor: 60,
    endpoints: builder => ({})
})
