import { apiSlice } from "./api-slice";
//import { MAIN_API_BASE_PATH } from "@env"
const MAIN_API_BASE_PATH = ""//process.env.MAIN_API_BASE_PATH;

const applicationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listApplications: builder.query({
      query: () => ({ url: `${MAIN_API_BASE_PATH}/application` }),
    }),

    listMyApplications: builder.query({
      query: (userId) => ({ url: `${MAIN_API_BASE_PATH}/application/${userId}` }),
    }),

    listOppApplications: builder.query({
      query: (oppId) => ({ url: `${MAIN_API_BASE_PATH}/application/readApplications/${oppId}` }),
    }),

    submitApplication: builder.mutation({
      query: (body) => ({
        url: `${MAIN_API_BASE_PATH}/application`,
        method: "POST",
        body,
      }),
    }),

    updateApplication: builder.mutation({
      query: (oppId, body) => ({
        url: `${MAIN_API_BASE_PATH}/application/${oppId}`,
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useListApplicationsQuery,
  useListMyApplicationsQuery,
  useListOppApplicationsQuery,
  useSubmitApplicationMutation,
  useUpdateApplicationMutation,
} = applicationApiSlice;
