import { apiSlice } from "./api-slice";
const MAIN_API_BASE_PATH = process.env.MAIN_API_BASE_PATH;

const bubbleApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //______________________________________________
        postHowTo: builder.mutation({
            query: (body) => ({
                url: `${MAIN_API_BASE_PATH}/howTo`,
                method: "POST",
                body,
            }),
        }),

        //______________________________________________
        howToFeed: builder.query({
            query: () => ({ url: `${MAIN_API_BASE_PATH}/howTo` })
        }),

        //______________________________________________
        readHowToDetails: builder.query({
            query: (id) => ({ url: `${MAIN_API_BASE_PATH}/howTo/${id}` }),
        }),

        //______________________________________________
        listMyHowTos: builder.query({
            query: (userId) => ({ url: `${MAIN_API_BASE_PATH}/howTo/myhowto/${userId}` }),
            invalidatesTags: (result, err, arg) => [{ type: "HowTo", id: arg.id }],
        }),

        //______________________________________________
        updateHowTo: builder.mutation({
            query: ({ body, howToId }) => ({
                url: `${MAIN_API_BASE_PATH}/howTo/${howToId}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, err, arg) => [{ type: "HowTo", id: arg.id }],
        }),

        //______________________________________________
        deleteHowTo: builder.mutation({
            query: ({ howToId }) => ({
                url: `${MAIN_API_BASE_PATH}/howTo/${howToId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, err, arg) => [{ type: "HowTo", id: arg.id }],
        }),
    }),
});

export const {
    usePostHowToMutation,
    useReadHowToDetailsQuery,
    useHowToFeedQuery,
    useListMyHowTosQuery,
    useUpdateHowToMutation,
    useDeleteHowToMutation,
} = bubbleApiSlice;
