import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "./api-slice";
//import { MAIN_API_BASE_PATH } from "@env"
const MAIN_API_BASE_PATH = ""//process.env.MAIN_API_BASE_PATH;

const dataAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
  //TODO: sort by Machine Learning ranking instead of createdAt field
});
const initialState = dataAdapter.getInitialState();

const chatApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createChatRoom: builder.mutation({
      query: (body) => ({
        url: `${MAIN_API_BASE_PATH}/chat-room/initiate`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Chat", id: "LIST" }],
    }),

    postMessage: builder.mutation({
      query: (body) => ({
        url: `${MAIN_API_BASE_PATH}/chat-room/${body.roomId}/message`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Chat", id: "LIST" }],
    }),

    listChatRooms: builder.query({
      query: () => ({ url: `${MAIN_API_BASE_PATH}/chat-room` }),
      providesTags: (result = [], err, arg) => [
        { type: "Chat", id: "LIST" },
      ],
    }),

    listRoomMessages: builder.query({
      query: (roomId) => ({
        url: `${MAIN_API_BASE_PATH}/chat-room/${roomId}`,
        params: { roomId: "64cc41d59ae4ff99616cdd04" }
      }),
      providesTags: (result = [], err, arg) => [
        { type: "Chat", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateChatRoomMutation,
  usePostMessageMutation,
  useListChatRoomsQuery,
  useListRoomMessagesQuery,
} = chatApiSlice;
