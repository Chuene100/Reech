import { apiSlice } from "./api-slice";
const MAIN_API_BASE_PATH = process.env.MAIN_API_BASE_PATH;

const commentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        //______________________________________________
        postComment: builder.mutation({
            query: (body) => ({
                url: `${MAIN_API_BASE_PATH}/comment`,
                method: "POST",
                body,
            }),
        }),

        //______________________________________________
        listComments: builder.query({
            query: (id) => ({ url: `${MAIN_API_BASE_PATH}/comment/read-all/${id}` }),
            invalidatesTags: (arg) => [{ type: "Comment", id: arg.id }],
        }),

        //______________________________________________
        updateComment: builder.mutation({
            query: ({ body, CommentId }) => ({
                url: `${MAIN_API_BASE_PATH}/comment/${CommentId}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (arg) => [{ type: "Comment", id: arg.id }],
        }),

        //______________________________________________
        deleteComment: builder.mutation({
            query: ({ CommentId }) => ({
                url: `${MAIN_API_BASE_PATH}/comment/${CommentId}`,
                method: "DELETE",
            }),
            invalidatesTags: (arg) => [{ type: "Comment", id: arg.id }],
        }),
    }),
});

export const {
    usePostCommentMutation,
    useListCommentsQuery,
    useUpdateCommentMutation,
    useDeleteCommentMutation,
} = commentApiSlice;
