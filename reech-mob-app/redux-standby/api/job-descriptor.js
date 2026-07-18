import { apiSlice } from "./api-slice";
//import { MAIN_API_BASE_PATH } from "@env"
const MAIN_API_BASE_PATH = ""//process.env.MAIN_API_BASE_PATH;

const jobDescriptorApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    //______________________________________________
    listJobDescriptors: builder.query({
      query: () => ({ url: `${MAIN_API_BASE_PATH}/job-descriptor` })
    }),

    //______________________________________________
    getJobDescriptor: builder.query({
      query: (id) => ({ url: `${MAIN_API_BASE_PATH}/job-descriptor/${id}` })
    }),
  })
});

export const {
  useListJobDescriptorsQuery,
  useGetJobDescriptorQuery,
} = jobDescriptorApiSlice;
