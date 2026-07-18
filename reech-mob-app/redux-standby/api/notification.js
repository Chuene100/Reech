import { apiSlice } from "./api-slice";
//import { MAIN_API_BASE_PATH } from "@env"
const MAIN_API_BASE_PATH = ""//process.env.MAIN_API_BASE_PATH;

const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendNotification: builder.mutation({
      query: (body) => ({
        url: `${MAIN_API_BASE_PATH}/notification`,
        method: "POST",
        body,
      }),
    }),

    listMyNotification: builder.query({
      query: (userId) => ({ url: `${MAIN_API_BASE_PATH}/notification/${userId}` }),
    }),

    readNotification: builder.query({
      query: (oppId) => ({ url: `${MAIN_API_BASE_PATH}/notification/read-one/${oppId}` }),
    }),

    updateNotification: builder.mutation({
      query: (oppId, body) => ({
        url: `${MAIN_API_BASE_PATH}/notification/${oppId}`,
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useSendNotificationMutation,
  useListMyNotificationQuery,
  useReadNotificationQuery,
  useUpdateNotificationMutation,
} = notificationApiSlice;
