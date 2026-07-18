import { apiSlice } from "./api-slice";
const MAIN_API_BASE_PATH = process.env.MAIN_API_BASE_PATH;

const thoughtApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //______________________________________________
        postThought: builder.mutation({
            query: (body) => ({
                url: `${MAIN_API_BASE_PATH}/thought`,
                method: "POST",
                body,
            }),
        }),

        //______________________________________________
        thoughtFeed: builder.query({
            query: () => ({ url: `${MAIN_API_BASE_PATH}/thought` })
        }),

        //______________________________________________
        readThoughtDetails: builder.query({
            query: (id) => ({ url: `${MAIN_API_BASE_PATH}/thought/${id}` }),
        }),

        //______________________________________________
        listMyThoughts: builder.query({
            query: (userId) => ({ url: `${MAIN_API_BASE_PATH}/thought/mythought/${userId}` }),
            invalidatesTags: (result, err, arg) => [{ type: "Thought", id: arg.id }],
        }),

        //______________________________________________
        updateThought: builder.mutation({
            query: ({ body, ThoughtId }) => ({
                url: `${MAIN_API_BASE_PATH}/thought/${ThoughtId}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, err, arg) => [{ type: "Thought", id: arg.id }],
        }),

        //______________________________________________
        deleteThought: builder.mutation({
            query: ({ ThoughtId }) => ({
                url: `${MAIN_API_BASE_PATH}/thought/${ThoughtId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, err, arg) => [{ type: "Thought", id: arg.id }],
        }),
    }),
});

export const {
    usePostThoughtMutation,
    useReadThoughtDetailsQuery,
    useThoughtFeedQuery,
    useListMyThoughtsQuery,
    useUpdateThoughtMutation,
    useDeleteThoughtMutation,
} = thoughtApiSlice;
