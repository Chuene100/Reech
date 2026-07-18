import { apiSlice } from "./api-slice";
//import { MAIN_API_BASE_PATH } from "@env"
const MAIN_API_BASE_PATH = process.env.MAIN_API_BASE_PATH;

const bubbleApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //______________________________________________
        postBubble: builder.mutation({
            query: (body) => ({
                url: `${MAIN_API_BASE_PATH}/bubble`,
                method: "POST",
                body,
            }),
            extraOptions: {
                userContext: "individual",
                backend: "reech-main-api"
            },
        }),

        //______________________________________________
        bubbleFeed: builder.query({
            query: () => ({ url: `${MAIN_API_BASE_PATH}/bubble` }),
            extraOptions: {
                userContext: "individual",
                backend: "reech-main-api"
            },
        }),

        //______________________________________________
        readBubbleDetails: builder.query({
            query: (id) => ({ url: `${MAIN_API_BASE_PATH}/bubble/${id}` }),
            extraOptions: {
                userContext: "individual",
                backend: "reech-main-api"
            },
        }),

        //______________________________________________
        listMyBubbles: builder.query({
            query: (activeProfileId) => ({ url: `${MAIN_API_BASE_PATH}/bubble/mybubbles/${activeProfileId}` }),
            extraOptions: {
                userContext: "individual",
                backend: "reech-main-api"
            },
            invalidatesTags: (result, err, arg) => [{ type: "Bubble", id: arg.id }],
        }),

        //______________________________________________
        updateBubble: builder.mutation({
            query: ({ body, bubbleId }) => ({
                url: `${MAIN_API_BASE_PATH}/bubble/${bubbleId}`,
                method: "PUT",
                body,
            }),
            extraOptions: {
                userContext: "individual",
                backend: "reech-main-api"
            },
            invalidatesTags: (result, err, arg) => [{ type: "Bubble", id: arg.id }],
        }),

        //______________________________________________
        deleteBubble: builder.mutation({
            query: ({ bubbleId }) => ({
                url: `${MAIN_API_BASE_PATH}/bubble/${bubbleId}`,
                method: "DELETE",
            }),
            extraOptions: {
                userContext: "individual",
                backend: "reech-main-api"
            },
            invalidatesTags: (result, err, arg) => [{ type: "Bubble", id: arg.id }],
        }),
    }),
});

export const {
    usePostBubbleMutation,
    useReadBubbleDetailsQuery,
    useBubbleFeedQuery,
    useListMyBubblesQuery,
    useUpdateBubbleMutation,
    useDeleteBubbleMutation,
} = bubbleApiSlice;
