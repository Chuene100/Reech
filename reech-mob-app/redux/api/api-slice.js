import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { setCredentials, removeCredentials } from "../features/auth-slice";
import { setCurrentUser } from "../features/user-slice";

//import { REACT_APP_API_URL, SvcTkn_Main_API, MAIN_API_BASE_PATH } from "@env";
const MAIN_API_BASE_PATH = process.env.MAIN_API_BASE_PATH;
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const SvcTkn_Main_API = process.env.SvcTkn_Main_API;

const API_BASE_URL = REACT_APP_API_URL

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "omit",
  prepareHeaders: (headers, { getState }) => {
    // if user is authenticated, add auth token to request header
    const userTokens = getState().auth;
    if (typeof userTokens.access_token === "string") {
      headers.set("Authorization", `Bearer ${userTokens.access_token}`);
    }
    const svcToken = SvcTkn_Main_API
    headers.set("Svc-Tkn", `Bearer ${svcToken}`)
    return headers;
  },
});

// if token expires automatically refresh token
const refreshQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "omit",
  prepareHeaders: (headers, { getState }) => {
    // if user is authenticated, add auth token to request header
    const userTokens = getState().auth;
    if (typeof userTokens.refresh_token === "string") {
      headers.set("Authorization", `Bearer ${userTokens.refresh_token}`);
    }
    const svcToken = SvcTkn_Main_API
    headers.set("Svc-Tkn", `Bearer ${svcToken}`)
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // try and refresh token
    const userTokens = api.getState().auth;

    const refreshResult = await refreshQuery(
      {
        url: `${MAIN_API_BASE_PATH}/auth/get-new-access-token`,
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult.error) {
      api.dispatch(removeCredentials());
    } else if (refreshResult?.data) {
      // store the new token
      api.dispatch(
        setCredentials({
          ...userTokens,
          access_token: refreshResult.data.access_token,
        })
      );
    }

    // retry the initial query
    result = await baseQuery(args, api, extraOptions);
  }

  // Sentry.Native.captureException(new Error(`baseQueryWithReauth-reponse-object := ${JSON.stringify(result)}`));

  return result;
};

const dataAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});
const initialState = dataAdapter.getInitialState();

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Profile",
    "User",
    "Opportunity",
    "Application",
    "Bubble",
    "Vouch",
    "Chat",
    "HowTo",
    "Thought",
    "Community",
    "CommunityPost",
    "Comment",
    "Ride",
  ],
  endpoints: (builder) => ({
    //______________________________________________
    signUp: builder.mutation({
      query: (body) => ({
        url: `${MAIN_API_BASE_PATH}/signup`,
        method: "POST",
        body,
      }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    //______________________________________________
    updateUser: builder.mutation({
      query: ({ body, userId }) => ({
        url: `${MAIN_API_BASE_PATH}/user/${userId}`,
        method: "PUT",
        body,
      }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
      invalidatesTags: (result, err, arg) => [{ type: "User", id: arg.id }],

      async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCurrentUser({ current_user: data?.data }))
        }
        catch (err) {
          console.error(err)
        }
      },
    }),

    //______________________________________________
    updateForeignUser: builder.mutation({
      query: ({ body, userId }) => ({
        url: `${MAIN_API_BASE_PATH}/user/foreign/${userId}`,
        method: "PUT",
        body,
      }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
      invalidatesTags: (result, err, arg) => [{ type: "User", id: arg.id }],
    }),

    //______________________________________________
    deleteUser: builder.mutation({
      query: ({ userId }) => ({
        url: `${MAIN_API_BASE_PATH}/user/${userId}`,
        method: "DELETE",
      }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
      invalidatesTags: (result, err, arg) => [{ type: "User", id: arg.id }],
    }),

    //______________________________________________
    listMyProfiles: builder.query({
      query: (activeUserId) => ({ url: `${MAIN_API_BASE_PATH}/user/my-profiles/${activeUserId}` }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
      providesTags: (result = [], err, arg) => [
        { type: "Profile", id: "LIST" },
        // ...result.ids.map((id) => ({ type: "Profile", id })),
      ],
    }),

    //______________________________________________
    readUser: builder.query({
      query: (activeUserId) => ({ url: `${MAIN_API_BASE_PATH}/user/${activeUserId}` }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
      invalidatesTags: (result, err, arg) => [{ type: "User", id: arg.id }],
    }),

    //______________________________________________
    readRequests: builder.query({
      query: (activeUserId) => ({ url: `${MAIN_API_BASE_PATH}/user/requests/${activeUserId}` }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
      invalidatesTags: (result, err, arg) => [{ type: "User", id: arg.id }],
    }),

    //______________________________________________
    readAllUser: builder.query({
      query: () => ({ url: `${MAIN_API_BASE_PATH}/user` }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
      providesTags: (result = [], err, arg) => [
        { type: "User", id: "LIST" },
      ],
    }),

    //______________________________________________
    readMyUsers: builder.query({
      query: (activeUserId) => ({ url: `${MAIN_API_BASE_PATH}/user/myusers/${activeUserId}` }),
      providesTags: (result = [], err, arg) => [
        { type: "User", id: "LIST" },
      ],
      invalidatesTags: (result, err, arg) => [
        { type: "User", id: arg.id }
      ]
    }),

    //______________________________________________
    readBubbleMates: builder.query({
      query: (body) => ({
        url: `${MAIN_API_BASE_PATH}/user/read-bubble-mates`,
        params: { body: JSON.stringify(body) },
      }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
      providesTags: (result = [], err, arg) => [
        { type: "User", id: "LIST" },
      ],
    }),

    //______________________________________________
    homeFeed: builder.query({
      query: ({ sortField, sortDirection, filter }) => ({
        url: `${MAIN_API_BASE_PATH}/feed?${new URLSearchParams({
          sortField,
          sortDirection,
        }).toString()}`,
        params: { filter: JSON.stringify(filter) },
      }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
    }),

    //______________________________________________
    uploadSingleFile: builder.mutation({
      query: (body) => ({
        url: `${MAIN_API_BASE_PATH}/application/singleFile`,
        method: "PATCH",
        body,
      }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
    }),
    //_____________________For SignUp use only___
    uploadSingleFileNoAuth: builder.mutation({
      query: (body) => ({
        url: `${MAIN_API_BASE_PATH}/application/singleFileNoAuth`,
        method: "PATCH",
        body,
      }),
      extraOptions: {
        userContext: "individual",
        backend: "reech-main-api"
      },
    }),

  }),
});


// generate and export mutation/query hooks
export const {
  useSignUpMutation,
  useUpdateUserMutation,
  useUpdateForeignUserMutation,
  useUploadSingleFileMutation,
  useUploadSingleFileNoAuthMutation,
  useListMyProfilesQuery,
  useDeleteUserMutation,
  useReadUserQuery,
  useReadRequestsQuery,
  useReadAllUserQuery,
  useReadMyUsersQuery,
  useReadBubbleMatesQuery,
  useHomeFeedQuery,
} = apiSlice;
