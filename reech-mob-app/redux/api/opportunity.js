import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "./api-slice";
//import { MAIN_API_BASE_PATH } from "@env"
const MAIN_API_BASE_PATH = process.env.MAIN_API_BASE_PATH;

const dataAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
  //TODO: sort by Machine Learning ranking instead of createdAt field
});
const initialState = dataAdapter.getInitialState();

const opportunityApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    listOpportunities: builder.query({
      query: () => ({ url: `${MAIN_API_BASE_PATH}/opportunity` }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
    }),

    listOppsByIdArray: builder.query({
      query: ({ body, sortField, sortDirection, filter }) => ({
        url: `${MAIN_API_BASE_PATH}/opportunity/feeds-from-array?${new URLSearchParams({
          sortField,
          sortDirection,
        }).toString()}`,
        extraOptions: {
          userContext: "individual",
          backend: "reech-main-api"
        },
        params: { body: body, filter: JSON.stringify(filter) },
      }),
    }),

    readOpportunityDetails: builder.query({
      query: (id) => ({ url: `${MAIN_API_BASE_PATH}/opportunity/${id}` }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
    }),

    updateOpportunity: builder.mutation({
      query: ({ body, oppId }) => ({
        url: `${MAIN_API_BASE_PATH}/opportunity/${oppId}`,
        method: "PUT",
        body,
      }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
    }),

    postOpportunity: builder.mutation({
      query: (body) => ({
        url: `${MAIN_API_BASE_PATH}/opportunity`,
        method: "POST",
        body,
      }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
    }),

    listMyOpportunities: builder.query({
      query: ({ activeProfileId, sortField, sortDirection, filter }) => ({
        url: `${MAIN_API_BASE_PATH}/opportunity/myopportunities/${activeProfileId}`,
        params: { sortField, sortDirection, filter: JSON.stringify(filter) },
      }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
      // invalidatesTags: (result, err, arg) => [{ type: "Opportunity", id: arg.id }],
    }),

    listSkillsByOpportunity: builder.query({
      query: (oppId) => ({ url: `${MAIN_API_BASE_PATH}/opportunity/${oppId}/skills` }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
    }),

    listApplicationsByOpportunity: builder.query({
      query: (oppId) => ({ url: `${MAIN_API_BASE_PATH}/opportunity/${oppId}/applications` }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
    }),

    updateApplicationByOpportunity: builder.mutation({
      query: (oppId, body) => ({
        url: `${MAIN_API_BASE_PATH}/application/${oppId}`,
        method: "PUT",
        body,
      }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
    }),
  }),
});

export const {
  useListOpportunitiesQuery,
  useListOppsByIdArrayQuery,
  usePostOpportunityMutation,
  useListMyOpportunitiesQuery,
  useReadOpportunityDetailsQuery,
  useListApplicationsByOpportunityQuery,
  useUpdateOpportunityMutation,
  useUpdateApplicationByOpportunityMutation,
  useListSkillsByOpportunityQuery,
} = opportunityApiSlice;
