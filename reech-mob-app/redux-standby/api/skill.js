import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "./api-slice";
//import { MAIN_API_BASE_PATH } from "@env"
const MAIN_API_BASE_PATH = ""//process.env.MAIN_API_BASE_PATH;

const dataAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt)
});

const skillApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    listSkills: builder.query({
      query: () => ({ url: `${MAIN_API_BASE_PATH}/skill` })
    }),

    registerSkills: builder.mutation({
      query: (body) => ({
        url: `${MAIN_API_BASE_PATH}/skill`,
        method: "POST",
        body,
      }),
    }),

  })
});

export const {
  useListSkillsQuery,
  useRegisterSkillsMutation,
} = skillApiSlice;
