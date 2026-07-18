import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "./api-slice";
//import { MAIN_API_BASE_PATH } from "@env"
const MAIN_API_BASE_PATH = ""//process.env.MAIN_API_BASE_PATH;
import { sub } from "date-fns";

const dataAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt)
  //TODO: sort by Machine Learning ranking instead of createdAt field
});
const initialState = dataAdapter.getInitialState();

const profileApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: builder => ({
    //____________________________________________________
    registerPoster: builder.mutation({
      query: (body) => ({
        url: `${MAIN_API_BASE_PATH}/profile/poster`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Profile", id: "LIST" }]
    }),

    //____________________________________________________
    listSeekersByIdArray: builder.query({
      query: (body) => ({
        url: `${MAIN_API_BASE_PATH}/profile/seekers-from-arr`,
        params: { body: body },
      }),

    }),

    //____________________________________________________
    listPosters: builder.query({
      query: () => ({ url: `${MAIN_API_BASE_PATH}/profile/poster` }),
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
        { type: "Profile", id: "LIST" },
        ...result.ids.map(id => ({ type: "Profile", id }))
      ],
    }),

    //____________________________________________________
    registerSeeker: builder.mutation({
      query: (body) => ({
        url: `${MAIN_API_BASE_PATH}/profile/seeker`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Profile", id: "LIST" }]
    }),

    //______________________________________________
    updateSeeker: builder.mutation({
      query: ({ body, profileId }) => ({
        url: `${MAIN_API_BASE_PATH}/profile/seeker/${profileId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, err, arg) => [{ type: "Profile", id: arg.id }],
    }),


    //____________________________________________________
    listSeekers: builder.query({
      query: () => ({ url: `${MAIN_API_BASE_PATH}/profile/seeker` }),
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
        { type: "Profile", id: "LIST" },
        ...result.ids.map(id => ({ type: "Profile", id }))
      ],
    }),

    //______________________________________________
    readSeeker: builder.query({
      query: (id) => ({ url: `${MAIN_API_BASE_PATH}/profile/seeker/${id}` }),
      invalidatesTags: (result, err, arg) => [{ type: "Profile", id: arg.id }],
    }),

    //______________________________________________
    deleteSeeker: builder.mutation({
      query: ({ profileId }) => ({
        url: `${MAIN_API_BASE_PATH}/profile/seeker/${profileId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, err, arg) => [{ type: "Profile", id: arg.id }],
    }),
  })
});

export const {
  useRegisterPosterMutation,
  useListPostersQuery,
  useListSeekersByIdArrayQuery,
  useReadSeekerQuery,
  useRegisterSeekerMutation,
  useListSeekersQuery,
  useUpdateSeekerMutation,
  useDeleteSeekerMutation,
} = profileApiSlice;

export const listSeekersResult = profileApiSlice.endpoints.listSeekers.select();
export const listSeekersData = createSelector(listSeekersResult, seekersResult => seekersResult.data);

export const {
  selectAll: selectAllSeekers,
  selectById: selectSeekerById,
  selectIds: selectSeekerIds,
} = dataAdapter.getSelectors(state => listSeekersData(state) ?? initialState);