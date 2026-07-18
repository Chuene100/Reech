import { apiSlice } from "./api-slice";
//import { MAIN_API_BASE_PATH } from "@env"
const MAIN_API_BASE_PATH = process.env.MAIN_API_BASE_PATH;

const jobTitleApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    //______________________________________________
    listJobTitles: builder.query({
      query: () => ({ url: `${MAIN_API_BASE_PATH}/job-title` }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
    }),

    //______________________________________________
    getJobTitle: builder.query({
      query: (id) => ({ url: `${MAIN_API_BASE_PATH}/job-title/${id}` }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
    }),
  })
});

export const {
  useListJobTitlesQuery,
  useGetJobTitleQuery,
} = jobTitleApiSlice;
