import { apiSlice } from "./api-slice";
//import { MAIN_API_BASE_PATH} from "@env"
const MAIN_API_BASE_PATH = ""//process.env.MAIN_API_BASE_PATH;

const jobCategoryApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    //______________________________________________
    listJobCategory: builder.query({
      query: () => ({ url: `${MAIN_API_BASE_PATH}/job-category` })
    }),

    //______________________________________________
    getJobCategory: builder.query({
      query: (id) => ({ url: `${MAIN_API_BASE_PATH}/job-category/${id}` })
    }),
  })
});

export const {
  useListJobCategoryQuery,
  useGetJobCategoryQuery,
} = jobCategoryApiSlice;
