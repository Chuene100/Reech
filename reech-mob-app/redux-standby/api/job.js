import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "./api-slice";
//import { MAIN_API_BASE_PATH } from "@env"
import { sub } from "date-fns";
const MAIN_API_BASE_PATH = ""//process.env.MAIN_API_BASE_PATH;

const dataAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt)
  //TODO: sort by Machine Learning ranking instead of createdAt field
});
const initialState = dataAdapter.getInitialState();

const jobApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({

    createJob: builder.mutation({
      query: (body) => ({
        url: `${MAIN_API_BASE_PATH}/opportunity`,
        method: "POST",
        body,
      }),
    }),

    updateJob: builder.mutation({
      query: ({ jobID, ...body }) => ({
        url: `${MAIN_API_BASE_PATH}/opportunity/${jobID}`,
        method: "PUT",
        body,
      }),
    }),

    myJobs: builder.query({
      query: ({ creatorId }) => ({ url: `${MAIN_API_BASE_PATH}/opportunity/myopportunities/${creatorId}` }),
    }),

    getJob: builder.query({
      query: ({ jobID }) => ({ url: `${MAIN_API_BASE_PATH}/opportunity/${jobID}` }),
    }),

    getJobSkills: builder.query({
      query: ({ jobID }) => ({ url: `${MAIN_API_BASE_PATH}/opportunity/${jobID}/skills` }),
    }),

    getJobApplications: builder.query({
      query: ({ jobID }) => ({ url: `${MAIN_API_BASE_PATH}/opportunity/${jobID}/applications` }),
    }),

    getMyJobApplications: builder.query({
      query: ({ jobID }) => ({ url: `${MAIN_API_BASE_PATH}/profile/seeker/${jobID}/applications` }),
      transformResponse: (responseData) => {
        let min = 1;
        const loadedData = responseData.map(dta => {
          if (!dta?.createdAt) { dta.createdAt = sub(new Date(), { minutes: min++ }).toISOString(); }
          if (!dta?.reactions) { dta.reactions = { comments: 0, likes: 0 }; }
          return dta;
        });
        return dataAdapter.setAll(initialState, loadedData);
      },
      providesTags: (result = [], err, arg) => [
        { type: "Application", id: "LIST" },
        ...result.ids.map(id => ({ type: "Application", id }))
      ],
    }),

    applyForJob: builder.mutation({
      query: ({ jobID, ...body }) => ({
        url: `${MAIN_API_BASE_PATH}/opportunity/${jobID}/apply`,
        method: "POST",
        body,
      }),
    }),

    updateJobApplication: builder.mutation({
      query: ({ jobID, ...body }) => ({
        url: `${MAIN_API_BASE_PATH}/application/${jobID}`,
        method: "PUT",
        body,
      }),
    }),

  })
});

export const {
  useCreateJobMutation,
  useUpdateJobMutation,
  useApplyForJobMutation,
  useGetJobApplicationsQuery,
  useGetJobQuery,
  useGetJobSkillsQuery,
  useGetMyJobApplicationsQuery,
  useMyJobsQuery,
  useUpdateJobApplicationMutation,
} = jobApiSlice;
