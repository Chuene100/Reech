import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "./api-slice";
//import { MAIN_API_BASE_PATH } from "@env"
const MAIN_API_BASE_PATH = ""//process.env.MAIN_API_BASE_PATH;

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
    }),

    listOppsByIdArray: builder.query({
      query: ({ body, sortField, sortDirection, filter }) => ({
        url: `${MAIN_API_BASE_PATH}/opportunity/feeds-from-array?${new URLSearchParams({
          sortField,
          sortDirection,
        }).toString()}`,
        params: { body: body, filter: JSON.stringify(filter) },
      }),
    }),

    readOpportunityDetails: builder.query({
      query: (id) => ({ url: `${MAIN_API_BASE_PATH}/opportunity/${id}` }),
    }),

    updateOpportunity: builder.mutation({
      query: ({ body, oppId }) => ({
        url: `${MAIN_API_BASE_PATH}/opportunity/${oppId}`,
        method: "PUT",
        body,
      }),
    }),

    postOpportunity: builder.mutation({
      query: (body) => ({
        url: `${MAIN_API_BASE_PATH}/opportunity`,
        method: "POST",
        body,
      }),
    }),

    listMyOpportunities: builder.query({
      query: ({ activeProfileId, sortField, sortDirection, filter }) => ({
        url: `${MAIN_API_BASE_PATH}/opportunity/myopportunities/${activeProfileId}`,
        params: { sortField, sortDirection, filter: JSON.stringify(filter) },
      }),
      // invalidatesTags: (result, err, arg) => [{ type: "Opportunity", id: arg.id }],
    }),

    listSkillsByOpportunity: builder.query({
      query: (oppId) => ({ url: `${MAIN_API_BASE_PATH}/opportunity/${oppId}/skills` }),
    }),

    listApplicationsByOpportunity: builder.query({
      query: (oppId) => ({ url: `${MAIN_API_BASE_PATH}/opportunity/${oppId}/applications` }),
    }),

    updateApplicationByOpportunity: builder.mutation({
      query: (oppId, body) => ({
        url: `${MAIN_API_BASE_PATH}/application/${oppId}`,
        method: "PUT",
        body,
      }),
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
